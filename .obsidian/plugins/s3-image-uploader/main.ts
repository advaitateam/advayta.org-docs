import {
	App,
	Editor,
	FileSystemAdapter,
	MarkdownView,
	Notice,
	Plugin,
	PluginSettingTab,
	RequestUrlParam,
	Setting,
	TFile,
	TextComponent,
	requestUrl,
	setIcon,
} from "obsidian";
import imageCompression from "browser-image-compression";
import { filesize } from "filesize";
import { minimatch } from "minimatch";

interface pasteFunction {
	(
		this: HTMLElement,
		event: ClipboardEvent | DragEvent,
		editor: Editor
	): void;
}

interface FilerFileMeta {
	id?: number | string;
	filename?: string;
	original_filename?: string;
	original_ext?: string;
	mime?: string;
	type?: string;
	url?: string;
	meta_data?: Record<string, unknown>;
	created_at?: string;
	updated_at?: string;
}

interface FilerSignedUploadResponse {
	url?: string;
	meta?: FilerFileMeta;
}

interface FilerUploaderSettings {
	apiBaseUrl: string;
	apiPublicUrl: string;
	authorizationHeader: string;
	userIdentities: Record<string, string>;
	apiKey: string;
	signUrlPath: string;
	fileUrlTemplate: string;
	folder: string;
	uploadOnDrag: boolean;
	localUpload: boolean;
	localUploadFolder: string;
	uploadVideo: boolean;
	uploadAudio: boolean;
	uploadPdf: boolean;
	queryStringValue: string;
	queryStringKey: string;
	enableImageCompression: boolean;
	maxImageCompressionSize: number;
	imageCompressionQuality: number;
	maxImageWidthOrHeight: number;
	ignorePattern: string;
}

type UploadableFileType = "image" | "video" | "audio" | "pdf" | "ppt" | "doc" | "docx";

const DEFAULT_SETTINGS: Omit<
	FilerUploaderSettings,
	"apiBaseUrl" | "apiPublicUrl" | "authorizationHeader" | "userIdentities" | "apiKey" | "folder"
> = {
	signUrlPath: "/v1.0/internal/files/signurl",
	fileUrlTemplate: "{apiPublicUrl}/v1.0/public/files/{id}",
	uploadOnDrag: true,
	localUpload: false,
	localUploadFolder: "",
	uploadVideo: false,
	uploadAudio: false,
	uploadPdf: false,
	queryStringValue: "",
	queryStringKey: "",
	enableImageCompression: false,
	maxImageCompressionSize: 1,
	imageCompressionQuality: 0.9,
	maxImageWidthOrHeight: 4096,
	ignorePattern: "",
};

export default class S3UploaderPlugin extends Plugin {
	settings: FilerUploaderSettings;
	pasteFunction: pasteFunction;

	private async requestSignedUpload(
		file: File,
		uploadPath: string
	): Promise<FilerSignedUploadResponse> {
		const apiBaseUrl = normalizeBaseUrl(this.settings.apiBaseUrl);
		const authorizationHeader = this.settings.authorizationHeader.trim();
		const apiKey = this.settings.apiKey.trim();
		if (!apiBaseUrl) {
			throw new Error("Filer API base URL is required");
		}
		if (!authorizationHeader && !apiKey) {
			throw new Error("Authorization header or API key is required");
		}

		const response = await requestUrl({
			url: joinUrl(apiBaseUrl, normalizeApiRoute(this.settings.signUrlPath)),
			method: "POST",
			headers: {
				...(authorizationHeader
					? { Authorization: authorizationHeader }
					: {}),
				...(apiKey ? { "X-API-Key": apiKey } : {}),
				'x-requested-with': 'XMLHttpRequest',
				'Content-Type': 'application/json',
				accept: 'application/json',
			},
			body: JSON.stringify({
				filename: file.name,
				mime: file.type || "application/octet-stream",
				path: uploadPath,
				is_public: true,
			}),
			contentType: "application/json",
			throw: false,
		});

		if (response.status < 200 || response.status >= 300) {
			throw new Error(formatHttpError("Filer API", response));
		}

		const data = parseJsonResponse(response) as FilerSignedUploadResponse;
		if (!data?.url) {
			throw new Error("Filer API response did not include an upload URL");
		}

		return data;
	}

	private async uploadFile(file: File, uploadPath: string): Promise<string> {
		const signedUpload = await this.requestSignedUpload(file, uploadPath);
		const fileId = signedUpload.meta?.id;
		if (fileId === undefined || fileId === null) {
			throw new Error("Filer API response did not include meta.id");
		}

		const body = await file.arrayBuffer();
		const uploadRequest: RequestUrlParam = {
			url: signedUpload.url!,
			method: "PUT",
			body,
			headers: {
				"x-goog-meta-file-id": String(fileId),
				'x-requested-with': 'XMLHttpRequest',
				'Content-Type': signedUpload.meta?.mime || "application/octet-stream",
			},
			throw: false,
		};
		const uploadResponse = await requestUrl(uploadRequest);
		if (uploadResponse.status < 200 || uploadResponse.status >= 300) {
			throw new Error(formatHttpError("Signed upload", uploadResponse));
		}

		return this.buildInsertedFileUrl(signedUpload.meta);
	}

	private buildInsertedFileUrl(meta?: FilerFileMeta): string {
		if (!meta) {
			throw new Error("Filer API response did not include file metadata");
		}

		const replacements: Record<string, string> = {
			apiBaseUrl: normalizeBaseUrl(this.settings.apiPublicUrl),
			id:
				meta.id === undefined || meta.id === null ? "" : String(meta.id),
			filename: meta.filename ?? "",
			original_filename: meta.original_filename ?? "",
			original_ext: meta.original_ext ?? "",
			mime: meta.mime ?? "",
			type: meta.type ?? "",
		};
		const template =
			this.settings.fileUrlTemplate.trim() ||
			DEFAULT_SETTINGS.fileUrlTemplate;
		const rendered = template.replace(/\{(\w+)\}/g, (_, key: string) => {
			return replacements[key] ?? "";
		});
		const finalUrl = /^https?:\/\//i.test(rendered)
			? rendered
			: joinUrl(replacements.apiBaseUrl, normalizeApiRoute(rendered));

		return appendConfiguredQueryParams(
			finalUrl || meta.url || "",
			this.settings.queryStringKey,
			this.settings.queryStringValue
		);
	}

	async compressImage(file: File): Promise<ArrayBuffer> {
		const compressedFile = await imageCompression(file, {
			useWebWorker: false,
			maxWidthOrHeight: this.settings.maxImageWidthOrHeight,
			maxSizeMB: this.settings.maxImageCompressionSize,
			initialQuality: this.settings.imageCompressionQuality,
		});

		const fileBuffer = await compressedFile.arrayBuffer();
		const originalSize = filesize(file.size);
		const newSize = filesize(compressedFile.size);

		new Notice(`Image compressed from ${originalSize} to ${newSize}`);

		return fileBuffer;
	}

	private shouldIgnoreCurrentFile(): boolean {
		const noteFile = this.app.workspace.getActiveFile();
		if (!noteFile || !this.settings.ignorePattern) {
			return false;
		}

		return matchesGlobPattern(noteFile.path, this.settings.ignorePattern);
	}

	async pasteHandler(
		ev: ClipboardEvent | DragEvent | Event | null,
		editor: Editor,
		directFile?: File
	): Promise<void> {
		if (ev?.defaultPrevented) {
			return;
		}

		const noteFile = this.app.workspace.getActiveFile();
		if (!noteFile?.name) {
			return;
		}

		const fm = this.app.metadataCache.getFileCache(noteFile)?.frontmatter;
		const localUpload = fm?.localUpload ?? this.settings.localUpload;
		const uploadVideo = fm?.uploadVideo ?? this.settings.uploadVideo;
		const uploadAudio = fm?.uploadAudio ?? this.settings.uploadAudio;
		const uploadPdf = fm?.uploadPdf ?? this.settings.uploadPdf;

		let files: File[] = [];
		if (directFile) {
			files = [directFile];
		} else if (ev) {
			switch (ev.type) {
				case "paste":
					files = Array.from(
						(ev as ClipboardEvent).clipboardData?.files || []
					);
					break;
				case "drop":
					if (
						!this.settings.uploadOnDrag &&
						!(fm && fm.uploadOnDrag)
					) {
						return;
					}
					files = Array.from(
						(ev as DragEvent).dataTransfer?.files || []
					);
					break;
				case "input":
					files = Array.from(
						(ev.target as HTMLInputElement).files || []
					);
					break;
			}
		}

		if (files.length === 0) {
			return;
		}

		if (this.shouldIgnoreCurrentFile()) {
			return;
		}

		if (ev) {
			ev.preventDefault();
		}

		new Notice("Uploading files...");
		const cursorPos = editor.getCursor();

		const uploads = files.map(async (originalFile) => {
			const detectedType = detectUploadableType(
				originalFile,
				uploadVideo,
				uploadAudio,
				uploadPdf
			);
			if (!detectedType) {
				return;
			}

			let file = originalFile;
			let buf = await file.arrayBuffer();
			const digest = await generateFileHash(new Uint8Array(buf));
			const originalExtension = file.name.split(".").pop();
			const newFileName = originalExtension
				? `${digest}.${originalExtension}`
				: digest;

			if (
				detectedType === "image" &&
				this.settings.enableImageCompression
			) {
				buf = await this.compressImage(file);
			}

			file = new File([buf], newFileName, {
				type: file.type || "application/octet-stream",
			});

			let folder = "";
			if (localUpload) {
				folder = fm?.uploadFolder ?? this.settings.localUploadFolder;
			} else {
				folder = fm?.uploadFolder ?? this.settings.folder;
			}

			folder = replaceDateTokens(folder);
			const localKey = buildLocalFileKey(folder, newFileName);
			const uploadPath = buildRemoteUploadPath(folder, noteFile);

			try {
				let url: string;
				if (!localUpload) {
					url = await this.uploadFile(file, uploadPath);
				} else {
					await this.app.vault.adapter.writeBinary(
						localKey,
						new Uint8Array(buf)
					);
					url =
						this.app.vault.adapter instanceof FileSystemAdapter
							? this.app.vault.adapter.getFilePath(localKey)
							: localKey;
				}

				return wrapFileDependingOnType(url, detectedType, "");
			} catch (error) {
				console.error(error);
				return `Error uploading file: ${getErrorMessage(error)}`;
			}
		});

		try {
			const results = await Promise.all(uploads);
			const validResults = results.filter(
				(result): result is string => result !== undefined
			);

			if (validResults.length > 0) {
				editor.transaction({
					changes: [
						{
							from: cursorPos,
							text: validResults.join("\n"),
						},
					],
				});

				new Notice("All files uploaded successfully");
			}
		} catch (error) {
			console.error("Error during upload or insertion:", error);
			new Notice(`Error: ${getErrorMessage(error)}`);
		}
	}

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new S3UploaderSettingTab(this.app, this));

		this.addCommand({
			id: "upload-image",
			name: "Upload image",
			icon: "image-plus",
			mobileOnly: false,
			editorCallback: (editor) => {
				const input = document.createElement("input");
				input.type = "file";
				input.oninput = (event) => {
					if (!event.target) {
						return;
					}
					this.pasteHandler(event, editor);
				};
				input.click();
				input.remove();
			},
		});

		this.pasteFunction = (
			event: ClipboardEvent | DragEvent,
			editor: Editor
		) => {
			this.pasteHandler(event, editor);
		};

		this.registerEvent(
			this.app.workspace.on("editor-paste", this.pasteFunction)
		);
		this.registerEvent(
			this.app.workspace.on("editor-drop", this.pasteFunction)
		);
		this.registerEvent(
			this.app.vault.on("create", async (file) => {
				if (!(file instanceof TFile)) {
					return;
				}
				if (!file.path.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
					return;
				}

				// Skip if the new file's path matches ignorePattern.
				// Without this, any image written into the vault by an external
				// process (build script, asset sync, IDE) gets uploaded and the
				// local copy deleted, even when the user never dropped it.
				if (
					this.settings.ignorePattern &&
					matchesGlobPattern(file.path, this.settings.ignorePattern)
				) {
					return;
				}

				const activeView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!activeView) {
					return;
				}
				if (this.shouldIgnoreCurrentFile()) {
					return;
				}

				try {
					const fileContent = await this.app.vault.readBinary(file);
					const newFile = new File([fileContent], file.name, {
						type: `image/${file.extension}`,
					});

					await this.pasteHandler(null, activeView.editor, newFile);
					await new Promise((resolve) => setTimeout(resolve, 50));

					const content = activeView.editor.getValue();
					const obsidianLink = (this.app.vault as any).getConfig(
						"useMarkdownLinks"
					)
						? `![](${file.name.split(" ").join("%20")})`
						: `![[${file.name}]]`;
					const position = content.indexOf(obsidianLink);

					if (position !== -1) {
						const from = activeView.editor.offsetToPos(position);
						const to = activeView.editor.offsetToPos(
							position + obsidianLink.length
						);
						activeView.editor.replaceRange("", from, to);
					} else {
						new Notice(`Failed to find: ${obsidianLink}`);
					}

					await this.app.vault.delete(file);
				} catch (error) {
					new Notice(`Error processing file: ${getErrorMessage(error)}`);
				}
			})
		);
	}

	onunload() {}

	async loadSettings() {
		const savedData = (await this.loadData()) ?? {};
		this.settings = {
			apiBaseUrl: normalizeBaseUrl(savedData.apiBaseUrl ?? ""),
			apiPublicUrl: normalizeBaseUrl(savedData.apiPublicUrl ?? ""),
			authorizationHeader: savedData.authorizationHeader ?? "",
			userIdentities: savedData.userIdentities ?? {},
			apiKey: savedData.apiKey ?? savedData["x-api-key"] ?? "",
			signUrlPath: normalizeApiRoute(
				savedData.signUrlPath ?? DEFAULT_SETTINGS.signUrlPath
			),
			fileUrlTemplate:
				savedData.fileUrlTemplate ?? DEFAULT_SETTINGS.fileUrlTemplate,
			folder: savedData.folder ?? "",
			uploadOnDrag:
				savedData.uploadOnDrag ?? DEFAULT_SETTINGS.uploadOnDrag,
			localUpload: savedData.localUpload ?? DEFAULT_SETTINGS.localUpload,
			localUploadFolder:
				savedData.localUploadFolder ??
				DEFAULT_SETTINGS.localUploadFolder,
			uploadVideo:
				savedData.uploadVideo ?? DEFAULT_SETTINGS.uploadVideo,
			uploadAudio:
				savedData.uploadAudio ?? DEFAULT_SETTINGS.uploadAudio,
			uploadPdf: savedData.uploadPdf ?? DEFAULT_SETTINGS.uploadPdf,
			queryStringValue:
				savedData.queryStringValue ??
				DEFAULT_SETTINGS.queryStringValue,
			queryStringKey:
				savedData.queryStringKey ?? DEFAULT_SETTINGS.queryStringKey,
			enableImageCompression:
				savedData.enableImageCompression ??
				DEFAULT_SETTINGS.enableImageCompression,
			maxImageCompressionSize:
				savedData.maxImageCompressionSize ??
				DEFAULT_SETTINGS.maxImageCompressionSize,
			imageCompressionQuality:
				savedData.imageCompressionQuality ??
				DEFAULT_SETTINGS.imageCompressionQuality,
			maxImageWidthOrHeight:
				savedData.maxImageWidthOrHeight ??
				DEFAULT_SETTINGS.maxImageWidthOrHeight,
			ignorePattern:
				savedData.ignorePattern ?? DEFAULT_SETTINGS.ignorePattern,
		};
	}

	async saveSettings() {
		await this.saveData({ ...this.settings });
	}
}

class S3UploaderSettingTab extends PluginSettingTab {
	plugin: S3UploaderPlugin;
	private compressionSizeSettings: Setting;
	private compressionQualitySettings: Setting;
	private compressionDimensionSettings: Setting;

	constructor(app: App, plugin: S3UploaderPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	private toggleCompressionSettings(show: boolean): void {
		if (
			this.compressionSizeSettings &&
			this.compressionQualitySettings &&
			this.compressionDimensionSettings
		) {
			const displayStyle = show ? "" : "none";
			this.compressionSizeSettings.settingEl.style.display = displayStyle;
			this.compressionQualitySettings.settingEl.style.display =
				displayStyle;
			this.compressionDimensionSettings.settingEl.style.display =
				displayStyle;
		}
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h2", {
			text: "Settings for Filer Image Uploader",
		});
		containerEl.createEl("br");

		const coffeeDiv = containerEl.createDiv("coffee");
		const coffeeLink = coffeeDiv.createEl("a", {
			href: "https://www.buymeacoffee.com/jvsteiner",
		});
		const coffeeImg = coffeeLink.createEl("img", {
			attr: {
				src: "https://cdn.buymeacoffee.com/buttons/v2/default-blue.png",
			},
		});
		coffeeImg.height = 45;
		containerEl.createEl("br");

		new Setting(containerEl)
			.setName("Filer API Base URL")
			.setDesc(
				"The base URL for the filer API. Example: https://filer-api.advayta.org"
			)
			.addText((text) =>
				text
					.setPlaceholder("https://filer-api.advayta.org")
					.setValue(this.plugin.settings.apiBaseUrl)
					.onChange(async (value) => {
						this.plugin.settings.apiBaseUrl = normalizeBaseUrl(
							value.trim()
						);
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Authorization Header")
			.setDesc(
				"Sent exactly as the Authorization header when requesting the signed upload URL."
			)
			.addText((text) => {
				wrapTextWithPasswordHide(text);
				text.setPlaceholder("identity id or bearer token")
					.setValue(this.plugin.settings.authorizationHeader)
					.onChange(async (value) => {
						this.plugin.settings.authorizationHeader = value.trim();
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("API Key")
			.setDesc(
				"Sent as X-API-Key when requesting the signed upload URL."
			)
			.addText((text) => {
				wrapTextWithPasswordHide(text);
				text.setPlaceholder("internal API key")
					.setValue(this.plugin.settings.apiKey)
					.onChange(async (value) => {
						this.plugin.settings.apiKey = value.trim();
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Signed Upload Path")
			.setDesc(
				"The API route used to request the signed upload URL."
			)
			.addText((text) =>
				text
					.setPlaceholder("/v1.0/auth/files/signurl")
					.setValue(this.plugin.settings.signUrlPath)
					.onChange(async (value) => {
						this.plugin.settings.signUrlPath = normalizeApiRoute(
							value.trim() || DEFAULT_SETTINGS.signUrlPath
						);
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Inserted File URL Template")
			.setDesc(
				"Used after upload to build the markdown URL. Supports {apiBaseUrl}, {id}, {filename}, {original_filename}, {original_ext}, {mime}, and {type}."
			)
			.addText((text) =>
				text
					.setPlaceholder("{apiBaseUrl}/v1.0/public/files/{id}")
					.setValue(this.plugin.settings.fileUrlTemplate)
					.onChange(async (value) => {
						this.plugin.settings.fileUrlTemplate =
							value.trim() || DEFAULT_SETTINGS.fileUrlTemplate;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Upload path")
			.setDesc(
				"Optional base filer path. Supports ${year}, ${month}, and ${day}. The current note path is appended automatically."
			)
			.addText((text) =>
				text
					.setPlaceholder("/docs/${year}/${month}")
					.setValue(this.plugin.settings.folder)
					.onChange(async (value) => {
						this.plugin.settings.folder = value.trim();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Upload on drag")
			.setDesc(
				"Upload drag and drop files as well as pasted files. To override this setting on a per-document basis, add uploadOnDrag: true to note frontmatter."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.uploadOnDrag)
					.onChange(async (value) => {
						this.plugin.settings.uploadOnDrag = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Upload video files")
			.setDesc(
				"Upload videos. To override on a per-document basis, add uploadVideo: true to note frontmatter."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.uploadVideo)
					.onChange(async (value) => {
						this.plugin.settings.uploadVideo = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Upload audio files")
			.setDesc(
				"Upload audio files. To override on a per-document basis, add uploadAudio: true to note frontmatter."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.uploadAudio)
					.onChange(async (value) => {
						this.plugin.settings.uploadAudio = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Upload pdf files")
			.setDesc(
				"Upload and embed PDF files. To override on a per-document basis, add uploadPdf: true to note frontmatter. Local uploads are not supported for PDF files."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.uploadPdf)
					.onChange(async (value) => {
						this.plugin.settings.uploadPdf = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Copy to local folder")
			.setDesc(
				"Copy files to a local folder instead of the filer API. To override on a per-document basis, add localUpload: true to note frontmatter."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.localUpload)
					.onChange(async (value) => {
						this.plugin.settings.localUpload = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Local folder")
			.setDesc(
				'Local folder to save files when local uploads are enabled. To override on a per-document basis, add uploadFolder: "my-folder" to note frontmatter.'
			)
			.addText((text) =>
				text
					.setPlaceholder("folder")
					.setValue(this.plugin.settings.localUploadFolder)
					.onChange(async (value) => {
						this.plugin.settings.localUploadFolder = value.trim();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Query String Key")
			.setDesc(
				"Optional query string key appended to the inserted markdown URL."
			)
			.addText((text) =>
				text
					.setPlaceholder("size")
					.setValue(this.plugin.settings.queryStringKey)
					.onChange(async (value) => {
						this.plugin.settings.queryStringKey = value.trim();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Query String Value")
			.setDesc(
				"Optional query string value appended to the inserted markdown URL."
			)
			.addText((text) =>
				text
					.setPlaceholder("big")
					.setValue(this.plugin.settings.queryStringValue)
					.onChange(async (value) => {
						this.plugin.settings.queryStringValue = value.trim();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Enable Image Compression")
			.setDesc("Reduce image size before uploading.")
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.enableImageCompression)
					.onChange(async (value) => {
						this.plugin.settings.enableImageCompression = value;
						await this.plugin.saveSettings();
						this.toggleCompressionSettings(value);
					});
			});

		this.compressionSizeSettings = new Setting(containerEl)
			.setName("Max Image Size")
			.setDesc(
				"Maximum size of the image after compression in MB. Default is 1MB."
			)
			.addText((text) =>
				text
					.setPlaceholder("1")
					.setValue(
						this.plugin.settings.maxImageCompressionSize.toString()
					)
					.onChange(async (value) => {
						const newValue = parseFloat(value);
						if (isNaN(newValue) || newValue <= 0) {
							new Notice(
								"Max Image Compression Size must be a number greater than 0"
							);
							return;
						}

						this.plugin.settings.maxImageCompressionSize = newValue;
						await this.plugin.saveSettings();
					})
			);

		this.compressionQualitySettings = new Setting(containerEl)
			.setName("Image Compression Quality")
			.setDesc(
				"Maximum quality of the image after compression. Default is 0.7."
			)
			.addSlider((slider) => {
				slider.setDynamicTooltip();
				slider.setLimits(0.0, 1.0, 0.05);
				slider.setValue(this.plugin.settings.imageCompressionQuality);
				slider.onChange(async (value) => {
					this.plugin.settings.imageCompressionQuality = value;
					await this.plugin.saveSettings();
				});
			});

		this.compressionDimensionSettings = new Setting(containerEl)
			.setName("Max Image Width or Height")
			.setDesc(
				"Maximum width or height of the image after compression. Default is 4096px."
			)
			.addText((text) =>
				text
					.setPlaceholder("4096")
					.setValue(
						this.plugin.settings.maxImageWidthOrHeight.toString()
					)
					.onChange(async (value) => {
						const parsedValue = parseInt(value);
						if (isNaN(parsedValue) || parsedValue <= 0) {
							new Notice(
								"Max Image Width or Height must be a number greater than 0"
							);
							return;
						}

						this.plugin.settings.maxImageWidthOrHeight =
							parsedValue;
						await this.plugin.saveSettings();
					})
			);

		this.toggleCompressionSettings(
			this.plugin.settings.enableImageCompression
		);

		new Setting(containerEl)
			.setName("Ignore Pattern")
			.setDesc(
				"Glob pattern to ignore files or folders. Separate multiple patterns with commas."
			)
			.addText((text) =>
				text
					.setPlaceholder("private/*, **/drafts/**")
					.setValue(this.plugin.settings.ignorePattern)
					.onChange(async (value) => {
						this.plugin.settings.ignorePattern = value.trim();
						await this.plugin.saveSettings();
					})
			);
	}
}

const wrapTextWithPasswordHide = (text: TextComponent) => {
	const hider = text.inputEl.insertAdjacentElement(
		"beforebegin",
		createSpan()
	);
	if (!hider) {
		return;
	}
	setIcon(hider as HTMLElement, "eye-off");

	hider.addEventListener("click", () => {
		const isText = text.inputEl.getAttribute("type") === "text";
		if (isText) {
			setIcon(hider as HTMLElement, "eye-off");
			text.inputEl.setAttribute("type", "password");
		} else {
			setIcon(hider as HTMLElement, "eye");
			text.inputEl.setAttribute("type", "text");
		}
		text.inputEl.focus();
	});
	text.inputEl.setAttribute("type", "password");
	return text;
};

const wrapFileDependingOnType = (
	location: string,
	type: UploadableFileType,
	localBase: string
) => {
	const srcPrefix = localBase ? "file://" + localBase + "/" : "";

	if (type === "image") {
		return `![image](${location})`;
	} else if (type === "video") {
		return `<video src="${srcPrefix}${location}" controls />`;
	} else if (type === "audio") {
		return `<audio src="${srcPrefix}${location}" controls />`;
	} else if (type === "pdf") {
		if (localBase) {
			throw new Error("PDFs cannot be embedded in local mode");
		}
		return `<iframe frameborder=0 style="width: 100%; height: 3000px;border:0"
		src="${location}">
		</iframe>`;
	} else if (type === "ppt") {
		return `<iframe
	    src='https://view.officeapps.live.com/op/embed.aspx?src=${location}'
	    style="width: 100%; height: 3000px;border:0" frameborder='0'>
	  </iframe>`;
	} else if (type === "doc" || type === "docx") {
		return `<iframe
	    src='https://view.officeapps.live.com/op/embed.aspx?src=${location}'
	    style="width: 100%; height: 3000px;border:0" frameborder='0'>
	  </iframe>`;
	}

	throw new Error("Unknown file type");
};

async function generateFileHash(data: Uint8Array): Promise<string> {
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	return hashHex.slice(0, 32);
}

function matchesGlobPattern(filePath: string, pattern: string): boolean {
	if (!pattern || pattern.trim() === "") {
		return false;
	}

	const patterns = pattern.split(",").map((value) => value.trim());
	return patterns.some((value) => minimatch(filePath, value));
}

function replaceDateTokens(value: string): string {
	const currentDate = new Date();
	return value
		.replace("${year}", currentDate.getFullYear().toString())
		.replace(
			"${month}",
			String(currentDate.getMonth() + 1).padStart(2, "0")
		)
		.replace("${day}", String(currentDate.getDate()).padStart(2, "0"));
}

function buildLocalFileKey(folder: string, fileName: string): string {
	const normalizedFolder = folder
		.trim()
		.replace(/\\/g, "/")
		.replace(/^\/+/, "")
		.replace(/\/+$/, "");
	return normalizedFolder ? `${normalizedFolder}/${fileName}` : fileName;
}

function buildRemoteUploadPath(folder: string, noteFile: TFile): string {
	return normalizeUploadPath(
		joinPathSegments(folder, stripFileExtension(noteFile.path))
	);
}

function joinPathSegments(...segments: string[]): string {
	return segments
		.flatMap((segment) =>
			segment
				.trim()
				.replace(/\\/g, "/")
				.split("/")
		)
		.map(normalizeUploadPathSegment)
		.filter(Boolean)
		.join("/");
}

function stripFileExtension(pathValue: string): string {
	return pathValue.replace(/\.[^/.]+$/, "");
}

function normalizeUploadPathSegment(segment: string): string {
	return segment
		.trim()
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^A-Za-z0-9_-]+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-+|-+$/g, "")
		.toLowerCase();
}

function normalizeUploadPath(pathValue: string): string {
	const normalizedPath = pathValue
		.trim()
		.replace(/\\/g, "/")
		.replace(/\/+$/, "")
		.replace(/^\/+/, "");
	return normalizedPath ? `/${normalizedPath}` : "/";
}

function normalizeApiRoute(pathValue: string): string {
	const normalized = pathValue.trim();
	if (!normalized) {
		return "/";
	}
	return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

function normalizeBaseUrl(value: string): string {
	const trimmed = value.trim();
	if (!trimmed) {
		return "";
	}
	const withProtocol = /^https?:\/\//i.test(trimmed)
		? trimmed
		: `https://${trimmed}`;
	return withProtocol.replace(/\/+$/, "");
}

function joinUrl(baseUrl: string, pathValue: string): string {
	return `${normalizeBaseUrl(baseUrl)}${normalizeApiRoute(pathValue)}`;
}

function appendConfiguredQueryParams(
	url: string,
	key: string,
	value: string
): string {
	if (!key || !value) {
		return url;
	}

	const urlObject = new URL(url);
	urlObject.searchParams.append(key, value);
	return urlObject.toString();
}

function parseJsonResponse(response: {
	json?: unknown;
	text?: string;
}): unknown {
	if (response.json !== undefined) {
		return response.json;
	}

	if (!response.text) {
		return undefined;
	}

	try {
		return JSON.parse(response.text);
	} catch (error) {
		console.error("Failed to parse JSON response", error);
		return undefined;
	}
}

function formatHttpError(
	label: string,
	response: { status: number; text?: string }
): string {
	const details = response.text?.trim();
	return details
		? `${label} returned ${response.status}: ${details}`
		: `${label} returned ${response.status}`;
}

function detectUploadableType(
	file: File,
	uploadVideo: boolean,
	uploadAudio: boolean,
	uploadPdf: boolean
): UploadableFileType | undefined {
	const mime = file.type.toLowerCase();
	const fileName = file.name.toLowerCase();

	if (
		(mime.startsWith("video/") ||
			/\.(mp4|mov|avi|mkv|webm|m4v)$/i.test(fileName)) &&
		uploadVideo
	) {
		return "video";
	}
	if (
		(mime.startsWith("audio/") ||
			/\.(mp3|wav|ogg|m4a|flac|aac)$/i.test(fileName)) &&
		uploadAudio
	) {
		return "audio";
	}
	if (
		mime === "application/pdf" ||
		(uploadPdf && /\.pdf$/i.test(fileName))
	) {
		return uploadPdf ? "pdf" : undefined;
	}
	if (
		mime.startsWith("image/") ||
		/\.(png|jpe?g|gif|webp|bmp|svg|avif|heic|heif)$/i.test(fileName)
	) {
		return "image";
	}
	if (
		mime.includes("presentation") ||
		mime.includes("powerpoint") ||
		/\.(ppt|pptx)$/i.test(fileName)
	) {
		return "ppt";
	}
	if (
		mime === "application/msword" ||
		mime ===
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
		mime.includes("wordprocessingml") ||
		/\.(doc|docx)$/i.test(fileName)
	) {
		return /\.docx$/i.test(fileName) ? "docx" : "doc";
	}

	return undefined;
}

function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}
	return String(error);
}
