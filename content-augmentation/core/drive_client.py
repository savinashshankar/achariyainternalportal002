"""
Google Drive API client for file operations - OAuth version
"""

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload, MediaFileUpload
from typing import Optional, Dict, List
import pickle
import os
import io
import tempfile


SCOPES = ['https://www.googleapis.com/auth/drive']


class DriveClient:
    """Client for interacting with Google Drive API using OAuth"""
    
    def __init__(self):
        """Initialize Drive API client with OAuth"""
        creds = None
        
        # Load token if exists
        if os.path.exists('token.pickle'):
            with open('token.pickle', 'rb') as token:
                creds = pickle.load(token)
        
        # If no valid creds, get them
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                raise Exception("No valid credentials. Run: python authorize.py first!")
        
        self.service = build('drive', 'v3', credentials=creds)
    
    def download_file(self, file_id: str) -> bytes:
        """Download file content from Google Drive"""
        request = self.service.files().get_media(fileId=file_id)
        file_buffer = io.BytesIO()
        downloader = MediaIoBaseDownload(file_buffer, request)
        
        done = False
        while not done:
            status, done = downloader.next_chunk()
        
        return file_buffer.getvalue()
    
    def upload_file(
        self,
        file_content: bytes,
        filename: str,
        folder_id: str,
        mime_type: str = 'application/octet-stream'
    ) -> str:
        """Upload file to Google Drive and return file ID"""
        
        # Upload directly from memory - no temp file needed!
        from googleapiclient.http import MediaIoBaseUpload
        file_buffer = io.BytesIO(file_content)
        
        file_metadata = {
            'name': filename,
            'parents': [folder_id]
        }
        
        media = MediaIoBaseUpload(file_buffer, mimetype=mime_type, resumable=True)
        
        file = self.service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id'
        ).execute()
        
        return file.get('id')
    
    def get_file_metadata(self, file_id: str) -> Dict:
        """Get file metadata"""
        return self.service.files().get(
            fileId=file_id,
            fields='id,name,mimeType,size,createdTime,modifiedTime,parents'
        ).execute()
    
    def make_file_public(self, file_id: str) -> str:
        """Make file publicly accessible and return URL"""
        
        # Set permission to public
        self.service.permissions().create(
            fileId=file_id,
            body={'type': 'anyone', 'role': 'reader'}
        ).execute()
        
        # Return public URL
        return f"https://drive.google.com/uc?id={file_id}&export=download"
    
    def list_files_in_folder(self, folder_id: str) -> List[Dict]:
        """List all files in a folder"""
        results = self.service.files().list(
            q=f"'{folder_id}' in parents and trashed=false",
            fields='files(id,name,mimeType,createdTime)'
        ).execute()
        
        return results.get('files', [])


# Global instance
drive_client = DriveClient()
