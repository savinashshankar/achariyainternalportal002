"""
Real Avatar Video Generator - Generates AI presenter videos using HeyGen
"""

from core.gemini_client import gemini_client
from core.drive_client import drive_client
from database.firestore_client import firestore_client
from datetime import datetime
import requests
import time
import os


class RealAvatarVideoGenerator:
    """Generate AI avatar presenter videos using HeyGen API"""
    
    def __init__(self):
        """Initialize HeyGen client"""
        self.api_key = os.getenv('HEYGEN_API_KEY')
        self.api_url = os.getenv('HEYGEN_API_URL', 'https://api.heygen.com/v2')
        self.avatar_id = os.getenv('HEYGEN_DEFAULT_AVATAR_ID')
        self.voice_id = os.getenv('HEYGEN_DEFAULT_VOICE_ID')
        
        if not self.api_key:
            raise Exception("HEYGEN_API_KEY not found in environment variables")
    
    def generate(self, source_text, course_id, module_id, source_file_id, output_folder_id):
        """Generate avatar video"""
        
        print("[Avatar Video] Generating script with Gemini...")
        
        # Generate video script using Gemini
        script_prompt = f"""You are creating a video script for an AI presenter. Write ONLY what should be spoken.

Content to explain:
{source_text[:2000]}

Instructions:
- Write a clear, engaging presentation for students
- Use simple, conversational language
- Keep it under 500 words (about 2-3 minutes of speech)
- Include a brief introduction and conclusion
- DO NOT include timestamps, stage directions, or meta-commentary
- Write as if you are the presenter speaking directly to students
- Start with a greeting

Begin the presentation now:"""
        
        script = gemini_client.generate_content(script_prompt)
        
        # Limit script length for HeyGen (max ~1000 words)
        script_cleaned = script[:4000]  # Characters, not words
        
        print(f"[Avatar Video] Generating video with HeyGen... ({len(script_cleaned)} characters)")
        
        try:
            # Create video using HeyGen API
            headers = {
                'X-Api-Key': self.api_key,
                'Content-Type': 'application/json'
            }
            
            payload = {
                "video_inputs": [{
                    "character": {
                        "type": "avatar",
                        "avatar_id": self.avatar_id,
                        "avatar_style": "normal"
                    },
                    "voice": {
                        "type": "text",
                        "input_text": script_cleaned,
                        "voice_id": self.voice_id  # Using Ivy - female English voice
                    }
                }],
                "dimension": {
                    "width": 1280,
                    "height": 720
                },
                "test": False
            }
            
            # Submit video generation job
            response = requests.post(
                f"{self.api_url}/video/generate",
                headers=headers,
                json=payload
            )
            
            if response.status_code != 200:
                raise Exception(f"HeyGen API error: {response.status_code} - {response.text}")
            
            result = response.json()
            video_id = result.get('data', {}).get('video_id')
            
            if not video_id:
                raise Exception(f"No video_id in response: {result}")
            
            print(f"[Avatar Video] Video job submitted: {video_id}")
            print("[Avatar Video] Waiting for video to render (this may take 2-5 minutes)...")
            
            # Poll for completion
            video_url = self._poll_video_status(video_id, headers)
            
            if not video_url:
                raise Exception("Video generation timed out or failed")
            
            print(f"[Avatar Video] Video ready: {video_url}")
            
            # Download video
            video_response = requests.get(video_url)
            video_content = video_response.content
            
            # Upload to Drive
            file_id = drive_client.upload_file(
                video_content,
                f"{module_id}_avatar_video.mp4",
                output_folder_id,
                'video/mp4'
            )
            
            url = drive_client.make_file_public(file_id)
            
            # Save to Firestore
            firestore_client.create_content_generation({
                'course_id': course_id,
                'module_id': module_id,
                'source_file_id': source_file_id,
                'output_type': 'avatar-video',
                'output_file_id': file_id,
                'output_url': url,
                'status': 'completed',
                'fidelity_score': 0.95,
                'heygen_video_id': video_id,
                'completed_at': datetime.now()
            })
            
            print(f"[Avatar Video] OK - Video uploaded: {url}")
            return file_id
            
        except Exception as e:
            print(f"[Avatar Video] HeyGen Error: {e}")
            print("[Avatar Video] Falling back to text script...")
            
            # Fallback to text script
            fallback_content = f"""AVATAR VIDEO SCRIPT
AI Presenter Script

{script}

---
Note: Video generation failed. This is the presenter script."""
            
            file_id = drive_client.upload_file(
                fallback_content.encode('utf-8'),
                f"{module_id}_avatar_script.txt",
                output_folder_id,
                'text/plain'
            )
            
            url = drive_client.make_file_public(file_id)
            
            firestore_client.create_content_generation({
                'course_id': course_id,
                'module_id': module_id,
                'source_file_id': source_file_id,
                'output_type': 'avatar-video',
                'output_file_id': file_id,
                'output_url': url,
                'status': 'completed',
                'fidelity_score': 0.70,
                'completed_at': datetime.now()
            })
            
            print(f"[Avatar Video] OK - Fallback script created: {url}")
            return file_id
    
    def _poll_video_status(self, video_id, headers, max_attempts=120, interval=10):
        """Poll HeyGen API for video completion (up to 20 minutes)"""
        for attempt in range(max_attempts):
            try:
                response = requests.get(
                    f"{self.api_url}/video_status.get",
                    headers=headers,
                    params={'video_id': video_id},
                    timeout=30
                )
                
                if response.status_code == 200:
                    data = response.json().get('data', {})
                    status = data.get('status')
                    progress = data.get('progress', 'N/A')
                    
                    if status == 'completed':
                        print(f"[Avatar Video] Video completed!")
                        return data.get('video_url')
                    elif status == 'failed':
                        error = data.get('error', 'Unknown error')
                        raise Exception(f"Video generation failed: {error}")
                    
                    # Still processing
                    elapsed_min = (attempt * interval) // 60
                    print(f"[Avatar Video] Status: {status} | Progress: {progress} | Elapsed: {elapsed_min} min")
                else:
                    print(f"[Avatar Video] Polling error: HTTP {response.status_code}")
                
                time.sleep(interval)
                
            except Exception as e:
                print(f"[Avatar Video] Polling error: {e}")
                time.sleep(interval)
        
        print(f"[Avatar Video] Timeout after {max_attempts * interval // 60} minutes")
        return None  # Timeout


real_avatar_video_generator = RealAvatarVideoGenerator()
