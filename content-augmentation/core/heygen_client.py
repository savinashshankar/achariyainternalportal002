"""
HeyGen API client for avatar video generation
"""

import requests
from typing import Dict, Optional
import time

from config.settings import settings


class HeyGenClient:
    """Client for interacting with HeyGen API"""
    
    def __init__(self):
        """Initialize HeyGen client"""
        self.api_key = settings.heygen_api_key
        self.api_url = settings.heygen_api_url
        self.default_avatar_id = settings.heygen_default_avatar_id
        self.default_voice_id = settings.heygen_default_voice_id
        self.headers = {
            "X-Api-Key": self.api_key,
            "Content-Type": "application/json"
        }
    
    def generate_video(
        self,
        script: str,
        avatar_id: Optional[str] = None,
        voice_id: Optional[str] = None,
        background_color: str = "#0078D4",
        enable_captions: bool = True
    ) -> Dict:
        """
        Generate avatar video from script
        Returns: {'video_id': '...', 'status': 'processing'}
        """
        
        payload = {
            "video_inputs": [{
                "character": {
                    "type": "avatar",
                    "avatar_id": avatar_id or self.default_avatar_id,
                    "avatar_style": "normal"
                },
                "voice": {
                    "type": "text",
                    "input_text": script,
                    "voice_id": voice_id or self.default_voice_id,
                    "speed": 1.0
                },
                "background": {
                    "type": "color",
                    "value": background_color
                }
            }],
            "dimension": {
                "width": 1920,
                "height": 1080
            },
            "aspect_ratio": "16:9",
            "test": False,
            "caption": enable_captions
        }
        
        response = requests.post(
            f"{self.api_url}/video/generate",
            json=payload,
            headers=self.headers
        )
        
        response.raise_for_status()
        data = response.json()
        
        return {
            'video_id': data['data']['video_id'],
            'status': 'processing'
        }
    
    def get_video_status(self, video_id: str) -> Dict:
        """
        Check video generation status
        Returns: {'status': 'processing'|'completed'|'failed', 'video_url': '...'}
        """
        
        response = requests.get(
            f"{self.api_url}/video/status/{video_id}",
            headers=self.headers
        )
        
        response.raise_for_status()
        data = response.json()
        
        status_data = data['data']
        
        return {
            'status': status_data['status'],
            'video_url': status_data.get('video_url'),
            'error': status_data.get('error')
        }
    
    def download_video(self, video_url: str) -> bytes:
        """Download generated video"""
        response = requests.get(video_url)
        response.raise_for_status()
        return response.content
    
    def wait_for_completion(
        self,
        video_id: str,
        max_wait_seconds: int = 1800,  # 30 minutes
        poll_interval: int = 30
    ) -> Dict:
        """
        Wait for video generation to complete
        Returns final status dict
        """
        
        elapsed = 0
        while elapsed < max_wait_seconds:
            status = self.get_video_status(video_id)
            
            if status['status'] == 'completed':
                return status
            elif status['status'] == 'failed':
                raise Exception(f"Video generation failed: {status.get('error')}")
            
            time.sleep(poll_interval)
            elapsed += poll_interval
        
        raise TimeoutError(f"Video generation timed out after {max_wait_seconds} seconds")


# Global instance
heygen_client = HeyGenClient()
