#!/bin/bash

# Configuration
LIST_FILE="files_to_delete.txt"
TRASH_DIR="trash_duplicates"

# 1. Check if the list file exists
if [ ! -f "$LIST_FILE" ]; then
    echo "Error: '$LIST_FILE' not found."
    echo "Please make sure the text file with filenames is in this directory."
    exit 1
fi

# 2. Create a trash directory for safety
if [ ! -d "$TRASH_DIR" ]; then
    mkdir -p "$TRASH_DIR"
    echo "Created safe backup folder: $TRASH_DIR"
fi

echo "========================================="
echo "Starting cleanup..."
echo "Files will be MOVED to '$TRASH_DIR' (not permanently deleted)."
echo "========================================="

# 3. Process the file list
while IFS= read -r filename; do
    # Skip comments (lines starting with #) and empty lines
    if [[ "$filename" =~ ^#.*$ ]] || [[ -z "$filename" ]]; then
        continue
    fi

    # Trim leading/trailing whitespace just in case
    filename=$(echo "$filename" | xargs)

    # Find and move the files
    # We use -print0 and read -d '' to handle filenames with spaces correctly
    find . -type f -name "$filename" -not -path "./$TRASH_DIR/*" -print0 | while IFS= read -r -d '' filepath; do
        echo "Found and moving: $filepath"
        
        # Move the file to the trash directory
        # We use --backup=t (if available on GNU mv) or just mv to avoid overwriting if duplicates exist in trash
        mv "$filepath" "$TRASH_DIR/"
    done

done < "$LIST_FILE"

echo "========================================="
echo "Job done!"
echo "Please review the contents of '$TRASH_DIR'."
echo "If satisfied, you can remove the trash folder using: rm -rf $TRASH_DIR"
echo "========================================="
