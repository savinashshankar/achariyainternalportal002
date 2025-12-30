"""
One-time OAuth authorization script
Run this once to authorize the application
"""

from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import pickle
import os

# Scopes needed
SCOPES = ['https://www.googleapis.com/auth/drive']

def authorize():
    """Run OAuth flow and save token"""
    
    creds = None
    token_path = 'token.pickle'
    
    # Check if token already exists
    if os.path.exists(token_path):
        print("Token already exists! Loading...")
        with open(token_path, 'rb') as token:
            creds = pickle.load(token)
    
    # If no valid credentials, run OAuth flow
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("Refreshing expired token...")
            creds.refresh(Request())
        else:
            print("Running OAuth authorization flow...")
            print("Your browser will open - please login and authorize the app")
            print()
            
            flow = InstalledAppFlow.from_client_secrets_file(
                'oauth_credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
            
            print("\nAuthorization successful!")
        
        # Save the credentials for next time
        with open(token_path, 'wb') as token:
            pickle.dump(creds, token)
            print(f"Token saved to {token_path}")
    
    print("\n" + "="*60)
    print("SUCCESS! You're authorized.")
    print("You can now run: python main.py <file-id>")
    print("="*60)

if __name__ == '__main__':
    authorize()
