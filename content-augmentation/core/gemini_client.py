"""
Gemini AI client for content analysis and generation
"""

import google.generativeai as genai
from typing import Optional, Dict, List
import json

from config.settings import settings


class GeminiClient:
    """Client for interacting with Gemini AI"""
    
    def __init__(self):
        """Initialize Gemini client"""
        genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel(settings.gemini_model)
    
    def generate_content(self, prompt: str) -> str:
        """Simple content generation wrapper"""
        response = self.model.generate_content(prompt)
        return response.text
    
    def analyze_content(self, text: str) -> Dict:
        """
        Analyze source content and extract metadata
        Returns: summary, key_concepts, complexity_level, estimated_duration
        """
        prompt = f"""
Analyze this educational content and provide:
1. A concise summary (2-3 sentences)
2. Key concepts (list of 5-10 main topics)
3. Complexity level (beginner/intermediate/advanced)
4. Estimated duration for video/audio (in minutes)

Content:
{text[:5000]}  # Limit to avoid token limits

Return as JSON with keys: summary, key_concepts, complexity_level, estimated_duration
"""
        
        response = self.model.generate_content(prompt)
        
        try:
            # Parse JSON response
            result = json.loads(response.text)
            return result
        except json.JSONDecodeError:
            # Fallback if not valid JSON
            return {
                'summary': response.text[:500],
                'key_concepts': [],
                'complexity_level': 'intermediate',
                'estimated_duration': 10
            }
    
    def generate_script(
        self,
        content: str,
        output_type: str,
        duration_minutes: Optional[int] = None
    ) -> str:
        """
        Generate script for various content types
        output_type: 'avatar-video', 'audio', 'explainer-video', 'whiteboard'
        """
        
        prompts = {
            'avatar-video': f"""
Create an engaging educational video script from this content.

Requirements:
- Natural conversational tone
- Duration: {duration_minutes or 10-15} minutes
- Maintain all key concepts and accuracy
- Include pauses for emphasis with [PAUSE]
- Structure: Hook → Main Content → Summary

Content: {content}

Output the complete script only, no additional formatting.
""",
            'audio': f"""
Create an audio narration script from this content.

Requirements:
- Clear, professional tone
- Duration: {duration_minutes or 10-15} minutes
- Maintain all key concepts
- Include natural pauses
- Suitable for audio-only learning

Content: {content}

Output the complete script only.
""",
            'explainer-video': f"""
Create an explainer video script with scene descriptions.

Requirements:
- Duration: {duration_minutes or 8-10} minutes
- For each scene, provide: [SCENE X] description, then narration
- Visual suggestions for each scene
- Engaging and clear

Content: {content}

Output format:
[SCENE 1] Visual: ...
Narration: ...
""",
            'whiteboard': f"""
Create a whiteboard storytelling script.

Requirements:
- Duration: {duration_minutes or 6-8} minutes
- Narrative flow with drawing cues
- Format: [DRAW: description] followed by narration
- Engaging story-based approach

Content: {content}

Output format:
[DRAW: ...] 
Narration: ...
"""
        }
        
        prompt = prompts.get(output_type, prompts['avatar-video'])
        response = self.model.generate_content(prompt)
        
        return response.text
    
    def generate_slide_content(self, content: str) -> List[Dict]:
        """
        Generate slide deck structure
        Returns list of slides with title, bullets, speaker_notes
        """
        prompt = f"""
Create a slide deck outline from this content.

For each slide provide:
- Title (concise, engaging)
- 3-5 bullet points (key takeaways)
- Speaker notes (what to say)

Aim for 15-25 slides total.

Content: {content}

Return as JSON array:
[
  {{
    "title": "...",
    "bullets": ["...", "..."],
    "speaker_notes": "..."
  }}
]
"""
        
        response = self.model.generate_content(prompt)
        
        try:
            slides = json.loads(response.text)
            return slides
        except json.JSONDecodeError:
            # Fallback
            return [{
                'title': 'Content Overview',
                'bullets': ['Key concept 1', 'Key concept 2', 'Key concept 3'],
                'speaker_notes': 'Introduction to the topic'
            }]
    
    def generate_infographic_data(self, content: str) -> Dict:
        """
        Generate structured data for infographic creation
        Returns: title, statistics, facts, visual_suggestions
        """
        prompt = f"""
Extract key data points for an educational infographic.

Provide:
- Title (catchy, informative)
- 3-5 key statistics or numbers
- 5-7 important facts
- Visual suggestions (icons, charts, diagrams)

Content: {content}

Return as JSON with keys: title, statistics, facts, visual_suggestions
"""
        
        response = self.model.generate_content(prompt)
        
        try:
            data = json.loads(response.text)
            return data
        except json.JSONDecodeError:
            return {
                'title': 'Key Concepts',
                'statistics': [],
                'facts': [],
                'visual_suggestions': []
            }
    
    def calculate_semantic_similarity(self, text1: str, text2: str) -> float:
        """
        Calculate semantic similarity between two texts (fidelity score)
        Returns score between 0 and 1
        """
        prompt = f"""
Compare these two texts and rate their semantic similarity on a scale of 0 to 1.
Consider: key concepts, accuracy, completeness.

Original: {text1[:2000]}

Generated: {text2[:2000]}

Return only a number between 0 and 1.
"""
        
        response = self.model.generate_content(prompt)
        
        try:
            score = float(response.text.strip())
            return max(0.0, min(1.0, score))  # Clamp between 0 and 1
        except ValueError:
            return 0.75  # Default moderate score


# Global instance
gemini_client = GeminiClient()
