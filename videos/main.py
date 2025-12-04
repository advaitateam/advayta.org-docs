import os

# CONFIGURATION
# Set to True to see what would happen without changing files
DRY_RUN = False 
TARGET_DIR = "."  # Current directory

def rename_recursive(directory):
    # topdown=False is CRITICAL. 
    # It ensures we process files inside a folder before renaming the folder itself.
    for root, dirs, files in os.walk(directory, topdown=False):
        
        # 1. Rename Files
        for filename in files:
            rename_item(root, filename)

        # 2. Rename Directories
        for dirname in dirs:
            rename_item(root, dirname)

def rename_item(root, name):
    new_name = name.lower()
    
    # Skip if name is already lowercase
    if name == new_name:
        return

    old_path = os.path.join(root, name)
    new_path = os.path.join(root, new_name)

    # COLLISION CHECK
    # If "File.txt" becomes "file.txt" and "file.txt" already exists, skip it.
    if os.path.exists(new_path):
        print(f"⚠️ SKIPPING: '{name}' -> '{new_name}' (Target already exists)")
        return

    if DRY_RUN:
        print(f"[DRY RUN] Would rename: '{name}' -> '{new_name}'")
    else:
        try:
            os.rename(old_path, new_path)
            print(f"✅ Renamed: '{name}' -> '{new_name}'")
        except OSError as e:
            print(f"❌ Error renaming '{name}': {e}")

if __name__ == "__main__":
    print(f"Starting rename in: {os.path.abspath(TARGET_DIR)}")
    if DRY_RUN:
        print("--- DRY RUN MODE (No changes will be applied) ---")
    
    rename_recursive(TARGET_DIR)
    
    print("Done.")
