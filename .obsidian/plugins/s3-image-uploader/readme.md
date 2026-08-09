# Filer Image Uploader

This Obsidian plugin uploads pasted and dropped files through the filer API instead of talking to cloud storage directly.

## How it works

1. The plugin calls the signed upload endpoint, by default `POST /v1.0/auth/files/signurl`.
2. The API returns a signed `PUT` URL plus file metadata.
3. The plugin uploads the binary to that signed URL with the required `x-goog-meta-file-id` header.
4. The plugin inserts a markdown URL built from a configurable template.

## Required settings

- `Filer API Base URL`
- `Authorization Header`
- `Signed Upload Path`
- `Inserted File URL Template`

The URL template supports these placeholders:

- `{apiBaseUrl}`
- `{id}`
- `{filename}`
- `{original_filename}`
- `{original_ext}`
- `{mime}`
- `{type}`

Default template:

```text
{apiBaseUrl}/v1.0/public/files/{id}
```

If your rendered markdown should use a different route, such as a public filer route or CDN, change the template accordingly.

## Upload path

`Upload path` is combined with the current note path and sent to the API as the request `path`. It supports `${year}`, `${month}`, and `${day}` tokens.
Path segments are normalized to API-safe slugs, so spaces and punctuation in note names are converted before upload.

Examples:

```text
/
/docs/${year}/${month}
/offers/active
```

## Local mode

`Copy to local folder` still works and bypasses the API entirely.

## Frontmatter overrides

These note-level overrides are still supported:

```yaml
---
uploadOnDrag: true
localUpload: false
uploadFolder: "/docs/${year}/${month}"
uploadVideo: true
uploadAudio: true
uploadPdf: true
---
```
