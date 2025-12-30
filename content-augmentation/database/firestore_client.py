"""
Firestore database connection and client
"""

from google.cloud import firestore
from google.oauth2 import service_account
from typing import Optional, Dict, List
from datetime import datetime
import uuid

from config.settings import settings


class FirestoreClient:
    """Client for interacting with Firestore database"""
    
    def __init__(self):
        """Initialize Firestore client"""
        credentials = service_account.Credentials.from_service_account_file(
            settings.google_application_credentials
        )
        self.db = firestore.Client(
            project=settings.google_cloud_project,
            credentials=credentials
        )
        
        # Collection references
        self.content_generations = self.db.collection('content_generations')
        self.generation_tasks = self.db.collection('generation_tasks')
        self.source_contents = self.db.collection('source_contents')
    
    # Content Generations
    def create_content_generation(self, data: Dict) -> str:
        """Create a new content generation record"""
        doc_id = str(uuid.uuid4())
        data['id'] = doc_id
        data['created_at'] = datetime.now()
        self.content_generations.document(doc_id).set(data)
        return doc_id
    
    def get_content_generation(self, generation_id: str) -> Optional[Dict]:
        """Get content generation by ID"""
        doc = self.content_generations.document(generation_id).get()
        return doc.to_dict() if doc.exists else None
    
    def update_content_generation(self, generation_id: str, data: Dict):
        """Update content generation"""
        self.content_generations.document(generation_id).update(data)
    
    def get_generations_by_module(self, course_id: str, module_id: str) -> List[Dict]:
        """Get all content generations for a module"""
        docs = self.content_generations.where('course_id', '==', course_id)\
            .where('module_id', '==', module_id).stream()
        return [doc.to_dict() for doc in docs]
    
    # Generation Tasks
    def create_generation_task(self, data: Dict) -> str:
        """Create a new generation task"""
        doc_id = str(uuid.uuid4())
        data['id'] = doc_id
        data['created_at'] = datetime.now()
        self.generation_tasks.document(doc_id).set(data)
        return doc_id
    
    def get_generation_task(self, task_id: str) -> Optional[Dict]:
        """Get generation task by ID"""
        doc = self.generation_tasks.document(task_id).get()
        return doc.to_dict() if doc.exists else None
    
    def update_generation_task(self, task_id: str, data: Dict):
        """Update generation task"""
        self.generation_tasks.document(task_id).update(data)
    
    # Source Contents
    def create_source_content(self, data: Dict) -> str:
        """Create a new source content record"""
        doc_id = str(uuid.uuid4())
        data['id'] = doc_id
        data['created_at'] = datetime.now()
        self.source_contents.document(doc_id).set(data)
        return doc_id
    
    def get_source_content_by_file_id(self, file_id: str) -> Optional[Dict]:
        """Get source content by Google Drive file ID"""
        docs = self.source_contents.where('file_id', '==', file_id).limit(1).stream()
        for doc in docs:
            return doc.to_dict()
        return None
    
    def update_source_content(self, content_id: str, data: Dict):
        """Update source content"""
        self.source_contents.document(content_id).update(data)


# Global instance
firestore_client = FirestoreClient()
