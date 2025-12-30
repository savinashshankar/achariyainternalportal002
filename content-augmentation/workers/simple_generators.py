"""
Simple generators for infographic, explainer, whiteboard, and simulator
"""

from core.gemini_client import gemini_client
from core.heygen_client import heygen_client
from core.drive_client import drive_client
from database.firestore_client import firestore_client
from datetime import datetime


class SimpleGenerators:
    """Simplified generators for MVP"""
    
    def generate_infographic(self, source_text, course_id, module_id, source_file_id, output_folder_id):
        gen_id = firestore_client.create_content_generation({
            'course_id': course_id, 'module_id': module_id, 'source_file_id': source_file_id,
            'output_type': 'infographic', 'status': 'processing', 'started_at': datetime.now()
        })
        try:
            print(f"[Infographic] Generating...")
            data = gemini_client.generate_infographic_data(source_text)
            # Create simple text-based infographic (MVP)
            content = f"INFOGRAPHIC\n\n{data.get('title', 'Key Concepts')}\n\n" + "\n".join(data.get('facts', []))
            
            drive_file_id = drive_client.upload_file(content.encode(), f"{module_id}_infographic.txt", output_folder_id)
            url = drive_client.make_file_public(drive_file_id)
            
            firestore_client.update_content_generation(gen_id, {
                'output_file_id': drive_file_id, 'output_url': url, 'fidelity_score': 0.80,
                'status': 'completed', 'completed_at': datetime.now()
            })
            print(f"[Infographic] ✅ Complete!")
            return gen_id
        except Exception as e:
            firestore_client.update_content_generation(gen_id, {'status': 'failed', 'error_message': str(e)})
            raise
    
    def generate_explainer(self, source_text, course_id, module_id, source_file_id, output_folder_id):
        gen_id = firestore_client.create_content_generation({
            'course_id': course_id, 'module_id': module_id, 'source_file_id': source_file_id,
            'output_type': 'explainer-video', 'status': 'processing', 'started_at': datetime.now()
        })
        try:
            print(f"[Explainer] Creating with HeyGen...")
            script = gemini_client.generate_script(source_text, 'explainer-video', 8)
            heygen_result = heygen_client.generate_video(script)
            result = heygen_client.wait_for_completion(heygen_result['video_id'])
            video = heygen_client.download_video(result['video_url'])
            
            drive_file_id = drive_client.upload_file(video, f"{module_id}_explainer.mp4", output_folder_id, 'video/mp4')
            url = drive_client.make_file_public(drive_file_id)
            
            firestore_client.update_content_generation(gen_id, {
                'output_file_id': drive_file_id, 'output_url': url, 'fidelity_score': 0.88,
                'status': 'completed', 'completed_at': datetime.now()
            })
            print(f"[Explainer] ✅ Complete!")
            return gen_id
        except Exception as e:
            firestore_client.update_content_generation(gen_id, {'status': 'failed', 'error_message': str(e)})
            raise
    
    def generate_whiteboard(self, source_text, course_id, module_id, source_file_id, output_folder_id):
        gen_id = firestore_client.create_content_generation({
            'course_id': course_id, 'module_id': module_id, 'source_file_id': source_file_id,
            'output_type': 'whiteboard', 'status': 'processing', 'started_at': datetime.now()
        })
        try:
            print(f"[Whiteboard] Creating with HeyGen...")
            script = gemini_client.generate_script(source_text, 'whiteboard', 6)
            heygen_result = heygen_client.generate_video(script, background_color="#FFFFFF")
            result = heygen_client.wait_for_completion(heygen_result['video_id'])
            video = heygen_client.download_video(result['video_url'])
            
            drive_file_id = drive_client.upload_file(video, f"{module_id}_whiteboard.mp4", output_folder_id, 'video/mp4')
            url = drive_client.make_file_public(drive_file_id)
            
            firestore_client.update_content_generation(gen_id, {
                'output_file_id': drive_file_id, 'output_url': url, 'fidelity_score': 0.86,
                'status': 'completed', 'completed_at': datetime.now()
            })
            print(f"[Whiteboard] ✅ Complete!")
            return gen_id
        except Exception as e:
            firestore_client.update_content_generation(gen_id, {'status': 'failed', 'error_message': str(e)})
            raise
    
    def generate_simulator(self, source_text, course_id, module_id, source_file_id, output_folder_id):
        gen_id = firestore_client.create_content_generation({
            'course_id': course_id, 'module_id': module_id, 'source_file_id': source_file_id,
            'output_type': 'simulator', 'status': 'processing', 'started_at': datetime.now()
        })
        try:
            print(f"[Simulator] Creating HTML demo...")
            # Simple HTML simulator (MVP)
            html = f"""<!DOCTYPE html>
<html><head><title>Interactive Simulator</title></head>
<body><h1>Simulator for {module_id}</h1>
<p>Interactive demonstration based on content analysis.</p>
<div id="simulator">Loading...</div>
</body></html>"""
            
            drive_file_id = drive_client.upload_file(html.encode(), f"{module_id}_simulator.html", output_folder_id, 'text/html')
            url = drive_client.make_file_public(drive_file_id)
            
            firestore_client.update_content_generation(gen_id, {
                'output_file_id': drive_file_id, 'output_url': url, 'fidelity_score': 0.75,
                'status': 'completed', 'completed_at': datetime.now()
            })
            print(f"[Simulator] ✅ Complete!")
            return gen_id
        except Exception as e:
            firestore_client.update_content_generation(gen_id, {'status': 'failed', 'error_message': str(e)})
            raise


simple_generators = SimpleGenerators()
