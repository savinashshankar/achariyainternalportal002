"""
Avatar Video Generator - Creates educational videos using HeyGen
"""

from typing import Dict
import time
from core.gemini_client import gemini_client
from core.heygen_client import heygen_client
from core.drive_client import drive_client
from database.firestore_client import firestore_client
from datetime import datetime


class AvatarVideoGenerator:
    """Generate avatar videos using HeyGen"""
    
    def generate(
        self,
        source_text: str,
        course_id: str,
        module_id: str,
        source_file_id: str,
        output_folder_id: str
    ) -> str:
        """
        Generate avatar video and save to Drive
        
        Returns:
            content_generation_id (Firestore document ID)
        """
        
        # Create generation record
        generation_data = {
            'course_id': course_id,
            'module_id': module_id,
            'source_file_id': source_file_id,
            'output_type': 'avatar-video',
            'status': 'processing',
            'external_service': 'heygen',
            'started_at': datetime.now()
        }
        
        generation_id = firestore_client.create_content_generation(generation_data)
        
        try:
            # Step 1: Generate script with Gemini
            print(f"[Avatar Video] Generating script...")
            script = gemini_client.generate_script(
                source_text,
                output_type='avatar-video',
                duration_minutes=12
            )
            
            # Step 2: Create video with HeyGen
            print(f"[Avatar Video] Creating video with HeyGen...")
            heygen_response = heygen_client.generate_video(script)
            video_id = heygen_response['video_id']
            
            # Update with external ID
            firestore_client.update_content_generation(generation_id, {
                'external_id': video_id,
                'generation_params': {'script_length': len(script)}
            })
            
            # Step 3: Wait for HeyGen to complete
            print(f"[Avatar Video] Waiting for video generation...")
            result = heygen_client.wait_for_completion(video_id)
            
            # Step 4: Download video
            print(f"[Avatar Video] Downloading video...")
            video_content = heygen_client.download_video(result['video_url'])
            
            # Step 5: Upload to Drive
            print(f"[Avatar Video] Uploading to Google Drive...")
            filename = f"{module_id}_avatar_video.mp4"
            drive_file_id = drive_client.upload_file(
                video_content,
                filename,
                output_folder_id,
                mime_type='video/mp4'
            )
            
            # Step 6: Make publicly accessible
            public_url = drive_client.make_file_public(drive_file_id)
            
            # Step 7: Calculate fidelity
            fidelity_score = gemini_client.calculate_semantic_similarity(
                source_text[:2000],
                script[:2000]
            )
            
            # Step 8: Update Firestore
            firestore_client.update_content_generation(generation_id, {
                'output_file_id': drive_file_id,
                'output_url': public_url,
                'fidelity_score': fidelity_score,
                'status': 'completed',
                'completed_at': datetime.now()
            })
            
            print(f"[Avatar Video] ✅ Complete! URL: {public_url}")
            return generation_id
            
        except Exception as e:
            # Update status to failed
            firestore_client.update_content_generation(generation_id, {
                'status': 'failed',
                'error_message': str(e),
                'completed_at': datetime.now()
            })
            print(f"[Avatar Video] ❌ Failed: {e}")
            raise


# Global instance
avatar_video_generator = AvatarVideoGenerator()
