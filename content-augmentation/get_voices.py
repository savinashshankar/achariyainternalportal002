"""
Get available voices from HeyGen API
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('HEYGEN_API_KEY')
api_url = os.getenv('HEYGEN_API_URL', 'https://api.heygen.com/v2')

headers = {
    'X-Api-Key': api_key,
    'Content-Type': 'application/json'
}

print("Fetching available voices...")

try:
    response = requests.get(
        f"{api_url}/voices",
        headers=headers,
        timeout=30
    )
    
    if response.status_code == 200:
        data = response.json()
        voices = data.get('data', {}).get('voices', [])
        
        # Filter for female English voices
        female_voices = [v for v in voices if v.get('gender') == 'female' and 'en' in v.get('language', '').lower()]
        
        print(f"\nFound {len(female_voices)} female English voices:")
        for i, voice in enumerate(female_voices[:10]):  # Show first 10
            print(f"{i+1}. {voice.get('name')} (ID: {voice.get('voice_id')})")
            
        # Recommend first one
        if female_voices:
            recommended = female_voices[0]
            print(f"\n✅ Recommended: {recommended.get('name')}")
            print(f"   Voice ID: {recommended.get('voice_id')}")
    else:
        print(f"Error: {response.status_code} - {response.text}")
        
except Exception as e:
    print(f"Error: {e}")
