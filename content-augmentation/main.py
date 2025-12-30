"""
Main entry point for content augmentation service
"""

import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from workers.orchestrator import orchestrator
from core.drive_client import drive_client


def main():
    """Main entry point"""
    
    print("\n" + "="*60)
    print("ACHARIYA CONTENT AUGMENTATION SERVICE")
    print("="*60 + "\n")
    
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python main.py <google-drive-file-id>")
        print("  python main.py --monitor  (watch for new uploads)")
        print("\nExample:")
        print("  python main.py 1a2B3c4D5e6F7g8H9i0J")
        sys.exit(1)
    
    if sys.argv[1] == '--monitor':
        # Monitor mode - watch for new files
        monitor_mode()
    else:
        # Process single file
        file_id = sys.argv[1]
        orchestrator.process_file(file_id)


def monitor_mode():
    """Monitor Drive folder for new uploads"""
    import time
    from config.settings import settings
    
    print("📡 Monitoring mode activated")
    print(f"Watching folder: {settings.google_drive_folder_id}")
    print("Upload a file to /source/ folder to trigger processing...\n")
    
    seen_files = set()
    
    # Get initial files in source folder
    try:
        # Find source folder in the structure
        # For MVP, we'll use a simplified approach
        print("⚠️  Monitor mode: Manual file ID required for MVP")
        print("Please run: python main.py <file-id>")
        return
    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    main()
