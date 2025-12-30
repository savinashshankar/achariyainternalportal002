"""
Orchestrator - Coordinates all content generation
"""

from workers.content_extractor import content_extractor
from workers.content_analyzer import content_analyzer
from workers.avatar_video_generator import avatar_video_generator
from workers.audio_generator import audio_generator
from workers.slide_generator import slide_generator
from workers.simple_generators import simple_generators
from core.drive_client import drive_client
from database.firestore_client import firestore_client
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from config.settings import settings


class Orchestrator:
    """Orchestrate content generation"""
    
    def process_file(self, file_id: str, course_id: str = "Course-001", module_id: str = "Module-001"):
        """Process uploaded file and generate all content"""
        
        print(f"\n{'='*60}")
        print(f">> STARTING CONTENT GENERATION")
        print(f"File ID: {file_id}")
        print(f"Course: {course_id} | Module: {module_id}")
        print(f"{'='*60}\n")
        
        #  Create task
        task_id = firestore_client.create_generation_task({
            'course_id': course_id,
            'module_id': module_id,
            'source_file_id': file_id,
            'total_tasks': 7,
            'status': 'in_progress'
        })
        
        try:
            # Get file metadata
            file_meta = drive_client.get_file_metadata(file_id)
            mime_type = file_meta['mimeType']
            
            # Use hardcoded generated folder ID (from user's Drive setup)
            output_folder_id = "1K6RD6gXS5s__uxDmtK7CKxZpDP4KGDs7"
            
            # Extract content
            print("\n>> Extracting content...")
            extracted = content_extractor.extract_from_file(file_id, mime_type)
            source_text = extracted['text']
            
            # Analyze
            print(">> Analyzing with Gemini...")
            content_analyzer.analyze_content(source_text, file_id)
            
            #Generate all 7 formats with working generators
            print("\n>> Generating content (7 formats)...\n")
            
            from workers.working_generators import working_generators
            completed = working_generators.generate_all(source_text, course_id, module_id, file_id, output_folder_id)
            
            # Update task
            firestore_client.update_generation_task(task_id, {
                'completed_tasks': completed,
                'status': 'completed',
                'completed_at': datetime.now()
            })
            
            # Send email
            self._send_notification(course_id, module_id, completed)
            
            print(f"\n{'='*60}")
            print(f">> GENERATION COMPLETE!")
            print(f"Generated: {completed}/7 formats")
            print(f"Check Google Drive /generated/ folder")
            print(f"{'='*60}\n")
            
        except Exception as e:
            firestore_client.update_generation_task(task_id, {'status': 'failed'})
            print(f"\n>> ERROR: {e}\n")
            raise
    
    def _send_notification(self, course_id, module_id, count):
        """Send email notification"""
        try:
            msg = MIMEText(f"Content generation complete for {course_id}/{module_id}. Generated {count}/7 formats.")
            msg['Subject'] = "LMS POC Content - AutoPilot - Processed"
            msg['From'] = settings.notification_from_email or "noreply@achariya.org"
            msg['To'] = "technicalhead@achariya.org"
            
            if settings.smtp_user:
                with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
                    server.starttls()
                    server.login(settings.smtp_user, settings.smtp_password)
                    server.send_message(msg)
                print(">> Email notification sent!")
        except Exception as e:
            print(f">> WARNING: Email failed: {e}")


orchestrator = Orchestrator()
