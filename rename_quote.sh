#!/bin/bash

# Function to process files recursively
process_files() {
  # Find all files in the current directory and subdirectories
  find . -type f -name '*"*' -print0 | while IFS= read -r -d '' file; do
    # Extract the directory path and filename
    dir=$(dirname "$file")
    filename=$(basename "$file")

    # Remove double quotes from the filename
    new_filename="${filename//\"/}"

    # Construct the new file path
    new_file="$dir/$new_filename"

    # Rename the file if the new filename is different
    if [ "$file" != "$new_file" ]; then
      mv "$file" "$new_file"
      echo "Renamed: '$file' -> '$new_file'"
    fi
  done
}

# Start processing from the current directory
process_files
