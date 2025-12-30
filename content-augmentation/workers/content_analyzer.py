"""
Content Analyzer - Analyze extracted content using Gemini
"""

from typing import Dict
from core.gemini_client import gemini_client
from database.firestore_client import firestore_client


class ContentAnalyzer:
    """Analyze content and extract metadata"""
    
    def analyze_content(self, text: str, source_file_id: str) -> str:
        """
        Analyze content and store in Firestore
        
        Returns:
            source_content_id (Firestore document ID)
        """
        
        # Use Gemini to analyze
        analysis = gemini_client.analyze_content(text)
        
        # Store in Firestore
        source_data = {
            'file_id': source_file_id,
            'raw_text': text[:10000],  # Store first 10k chars
            'summary': analysis.get('summary', ''),
            'key_concepts': analysis.get('key_concepts', []),
            'estimated_duration': analysis.get('estimated_duration', 10),
            'complexity_level': analysis.get('complexity_level', 'intermediate'),
            'word_count': len(text.split()),
            'analysis_params': analysis
        }
        
        source_content_id = firestore_client.create_source_content(source_data)
        
        return source_content_id


# Global instance
content_analyzer = ContentAnalyzer()
