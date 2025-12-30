"""
Audio Generator - Creates audio narration using Gemini
"""

from typing import Dict
from core.gemini_client import gemini_client
from core.drive_client import drive_client
from database.firestore_client import firestore_client
from datetime import datetime
import google.generativeai as genai


class AudioGenerator:
    """Generate audio narration"""
    
    def generate(
        self,
        source_text: str,
        course_id: str,
        module_id: str,
        source_file_id: str,
        output_folder_id: str
    ) -> str:
        generation_data = {
            'course_id': course_id,
            'module_id': module_id,
            'source_file_id': source_file_id,
            'output_type': 'audio',
            'status': 'processing',
            'external_service': 'gemini',
            'started_at': datetime.now()
        }
        
        generation_id = firestore_client.create_content_generation(generation_data)
        
        try:
            print(f"[Audio] Generating script...")
            script = gemini_client.generate_script(source_text, 'audio', 12)
            
            print(f"[Audio] Creating audio with Gemini...")
            # Use Gemini for audio (simplified for MVP)
            model = genai.GenerativeModel('gemini-2.0-flash-exp')
            response = model.generate_content(
                script,
                generation_config={'response_modalities': ['AUDIO']}
            )
            
            # Save audio
            audio_content = response.candidates[0].content.parts[0].inline_data.data
            
            print(f"[Audio] Uploading to Drive...")
            filename = f"{module_id}_audio.mp3"
            drive_file_id = drive_client.upload_file(
                audio_content,
                filename,
                output_folder_id,
                'audio/mpeg'
            )
            
            public_url = drive_client.make_file_public(drive_file_id)
            fidelity = gemini_client.calculate_semantic_similarity(source_text[:2000], script[:2000])
            
            firestore_client.update_content_generation(generation_id, {
                'output_file_id': drive_file_id,
                'output_url': public_url,
                'fidelity_score': fidelity,
                'status': 'completed',
                'completed_at': datetime.now()
            })
            
            print(f"[Audio] ✅ Complete!")
            return generation_id
            
        except Exception as e:
            firestore_client.update_content_generation(generation_id, {
                'status': 'failed',
                'error_message': str(e),
                'completed_at': datetime.now()
            })
            print(f"[Audio] ❌ Failed: {e}")
            raise


audio_generator = AudioGenerator()
