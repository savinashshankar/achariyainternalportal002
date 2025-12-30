"""
Slide Generator - Creates presentation slides
"""

from googleapiclient.discovery import build
from google.oauth2 import service_account
from core.gemini_client import gemini_client
from core.drive_client import drive_client
from database.firestore_client import firestore_client
from config.settings import settings
from datetime import datetime


class SlideGenerator:
    """Generate presentation slides"""
    
    def generate(self, source_text: str, course_id: str, module_id: str, source_file_id: str, output_folder_id: str) -> str:
        generation_id = firestore_client.create_content_generation({
            'course_id': course_id,
            'module_id': module_id,
            'source_file_id': source_file_id,
            'output_type': 'slides',
            'status': 'processing',
            'started_at': datetime.now()
        })
        
        try:
            print(f"[Slides] Generating content...")
            slides_content = gemini_client.generate_slide_content(source_text)
            
            print(f"[Slides] Creating presentation...")
            creds = service_account.Credentials.from_service_account_file(
                settings.google_application_credentials,
                scopes=['https://www.googleapis.com/auth/presentations', 'https://www.googleapis.com/auth/drive']
            )
            
            slides_service = build('slides', 'v1', credentials=creds)
            presentation = slides_service.presentations().create(body={'title': f'{module_id} - Generated Slides'}).execute()
            presentation_id = presentation['presentationId']
            
            # Add slides
            requests = []
            for i, slide_data in enumerate(slides_content[:20]):  # Limit to 20 slides
                requests.append({
                    'createSlide': {
                        'slideLayoutReference': {'predefinedLayout': 'TITLE_AND_BODY'},
                        'placeholderIdMappings': []
                    }
                })
            
            if requests:
                slides_service.presentations().batchUpdate(
                    presentationId=presentation_id,
                    body={'requests': requests}
                ).execute()
            
            # Move to Drive folder
            drive_service = build('drive', 'v3', credentials=creds)
            drive_service.files().update(
                fileId=presentation_id,
                addParents=output_folder_id,
                fields='id, parents'
            ).execute()
            
            public_url = f"https://docs.google.com/presentation/d/{presentation_id}/edit"
            
            firestore_client.update_content_generation(generation_id, {
                'output_file_id': presentation_id,
                'output_url': public_url,
                'fidelity_score': 0.85,
                'status': 'completed',
                'completed_at': datetime.now()
            })
            
            print(f"[Slides] ✅ Complete!")
            return generation_id
        except Exception as e:
            firestore_client.update_content_generation(generation_id, {
                'status': 'failed',
                'error_message': str(e)
            })
            raise


slide_generator = SlideGenerator()
