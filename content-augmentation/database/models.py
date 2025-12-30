"""
Database models for Content Augmentation Service
"""

from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, JSON, ARRAY
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import uuid

Base = declarative_base()


def generate_uuid():
    return str(uuid.uuid4())


class ContentGeneration(Base):
    """Tracks individual content generation tasks"""
    __tablename__ = "content_generations"
    
    # Primary key
    id = Column(String, primary_key=True, default=generate_uuid)
    
    # Course & Module reference
    course_id = Column(String, nullable=False, index=True)
    module_id = Column(String, nullable=False, index=True)
    
    # Source file
    source_file_id = Column(String, nullable=False)  # Google Drive ID
    source_file_name = Column(String)
    source_file_type = Column(String)  # 'pdf', 'docx', 'mp4', etc.
    
    # Output details
    output_type = Column(String, nullable=False)  # 'avatar-video', 'audio', etc.
    status = Column(String, default='pending')  # 'pending', 'processing', 'completed', 'failed', 'needs_review'
    
    # Generated content
    output_file_id = Column(String)  # Google Drive ID
    output_url = Column(String)  # Public URL for LMS
    
    # Quality metrics
    fidelity_score = Column(Float)
    generation_params = Column(JSON)  # Store prompts, settings used
    
    # External service tracking
    external_service = Column(String)  # 'heygen', 'gemini', 'canva', etc.
    external_id = Column(String)  # Their job/video ID
    
    # Error handling
    error_message = Column(String)
    retry_count = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    
    # Approval workflow
    approved_by = Column(String)
    approved_at = Column(DateTime(timezone=True))
    published_to_lms = Column(Boolean, default=False)
    published_at = Column(DateTime(timezone=True))
    
    def __repr__(self):
        return f"<ContentGeneration {self.id} - {self.output_type} - {self.status}>"


class GenerationTask(Base):
    """Tracks overall generation task for a module (orchestrates all 7 content types)"""
    __tablename__ = "generation_tasks"
    
    # Primary key
    id = Column(String, primary_key=True, default=generate_uuid)
    
    # Course & Module reference
    course_id = Column(String, nullable=False, index=True)
    module_id = Column(String, nullable=False, index=True)
    
    # Source file
    source_file_id = Column(String, nullable=False)
    source_file_name = Column(String)
    
    # Task tracking
    total_tasks = Column(Integer, default=7)  # Number of content types to generate
    completed_tasks = Column(Integer, default=0)
    failed_tasks = Column(Integer, default=0)
    
    # Status
    status = Column(String, default='in_progress')  # 'in_progress', 'completed', 'partial_failure', 'failed'
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))
    
    # Notification
    notification_sent = Column(Boolean, default=False)
    
    def __repr__(self):
        return f"<GenerationTask {self.id} - {self.course_id}/{self.module_id} - {self.status}>"


class SourceContent(Base):
    """Stores analyzed source content for reuse"""
    __tablename__ = "source_contents"
    
    # Primary key
    id = Column(String, primary_key=True, default=generate_uuid)
    
    # File reference
    file_id = Column(String, unique=True, nullable=False)  # Google Drive ID
    file_name = Column(String)
    file_type = Column(String)
    
    # Extracted content
    raw_text = Column(String)  # Full extracted text
    summary = Column(String)  # Gemini-generated summary
    key_concepts = Column(ARRAY(String))  # Extracted concepts
    estimated_duration = Column(Integer)  # In minutes
    complexity_level = Column(String)  # 'beginner', 'intermediate', 'advanced'
    
    # Metadata
    word_count = Column(Integer)
    page_count = Column(Integer)
    
    # Analysis results
    analysis_params = Column(JSON)  # Store Gemini analysis details
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<SourceContent {self.file_id} - {self.file_name}>"
