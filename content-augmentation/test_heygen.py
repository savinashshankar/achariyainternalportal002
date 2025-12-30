"""
HeyGen API Diagnostic Script - Test connection and authentication
"""

import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_heygen_connection():
    """Test HeyGen API connection and authentication"""
    
    api_key = os.getenv('HEYGEN_API_KEY')
    api_url = os.getenv('HEYGEN_API_URL', 'https://api.heygen.com/v2')
    
    print("=" * 60)
    print("HEYGEN API DIAGNOSTIC TEST")
    print("=" * 60)
    print()
    
    # Check API key
    if not api_key:
        print("ERROR: HEYGEN_API_KEY not found in .env file")
        return
    
    print(f"API Key: {api_key[:20]}...{api_key[-10:]}")
    print(f"API URL: {api_url}")
    print()
    
    # Test 1: List available avatars
    print("Test 1: Listing available avatars...")
    print("-" * 60)
    
    headers = {
        'X-Api-Key': api_key,
        'Content-Type': 'application/json'
    }
    
    try:
        # Try to list avatars
        response = requests.get(
            f"{api_url}/avatars",
            headers=headers,
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:500]}")
        print()
        
        if response.status_code == 200:
            data = response.json()
            avatars = data.get('data', {}).get('avatars', [])
            print(f"Found {len(avatars)} avatars:")
            for avatar in avatars[:5]:  # Show first 5
                print(f"  - {avatar.get('avatar_name')} (ID: {avatar.get('avatar_id')})")
        else:
            print(f"ERROR: {response.text}")
            
    except requests.exceptions.Timeout:
        print("ERROR: Connection timed out")
        print("Possible issues:")
        print("  - Firewall blocking api.heygen.com")
        print("  - Network connectivity issues")
        print("  - HeyGen servers down")
    except requests.exceptions.ConnectionError as e:
        print(f"ERROR: Connection failed - {e}")
        print("Possible issues:")
        print("  - No internet connection")
        print("  - DNS resolution failed")
        print("  - Proxy/firewall blocking")
    except Exception as e:
        print(f"ERROR: {e}")
    
    print()
    print("=" * 60)
    
    # Test 2: Check API documentation endpoint
    print("Test 2: Checking API health...")
    print("-" * 60)
    
    try:
        # Some APIs have a health/status endpoint
        response = requests.get(
            "https://api.heygen.com",
            timeout=10
        )
        print(f"Base API accessible: {response.status_code}")
    except Exception as e:
        print(f"Base API not accessible: {e}")
    
    print()
    print("=" * 60)

if __name__ == "__main__":
    test_heygen_connection()
