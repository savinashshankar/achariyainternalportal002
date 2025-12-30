"""
LMS API client for publishing content
"""

import requests
from typing import Dict, Optional

from config.settings import settings


class LMSClient:
    """Client for interacting with existing LMS API"""
    
    def __init__(self):
        """Initialize LMS client"""
        self.base_url = settings.lms_api_url
        self.api_key = settings.lms_service_api_key
        self.headers = {
            "X-API-Key": self.api_key,
            "Content-Type": "application/json"
        }
    
    def publish_content(
        self,
        course_id: str,
        module_id: str,
        content_type: str,
        content_url: str
    ) -> Dict:
        """
        Publish generated content to LMS
        
        Args:
            course_id: Course identifier
            module_id: Module identifier
            content_type: Type of content ('avatar-video', 'audio', 'slides', etc.)
            content_url: Public URL to the content
        
        Returns:
            Response from LMS API
        """
        
        payload = {
            "course_id": course_id,
            "module_id": module_id,
            "content_type": content_type,
            "content_url": content_url
        }
        
        response = requests.post(
            f"{self.base_url}/content/publish",
            json=payload,
            headers=self.headers
        )
        
        response.raise_for_status()
        return response.json()
    
    def get_module_info(self, course_id: str, module_id: str) -> Dict:
        """
        Get module details from LMS
        
        Returns:
            Module metadata including title, description, etc.
        """
        
        response = requests.get(
            f"{self.base_url}/modules/{course_id}/{module_id}",
            headers=self.headers
        )
        
        response.raise_for_status()
        return response.json()
    
    def update_generation_status(
        self,
        course_id: str,
        module_id: str,
        status: str
    ) -> Dict:
        """
        Update content generation status in LMS
        
        Args:
            status: 'pending', 'processing', 'ready', 'failed'
        """
        
        payload = {
            "course_id": course_id,
            "module_id": module_id,
            "status": status
        }
        
        response = requests.post(
            f"{self.base_url}/content/status",
            json=payload,
            headers=self.headers
        )
        
        response.raise_for_status()
        return response.json()


# Global instance
lms_client = LMSClient()
