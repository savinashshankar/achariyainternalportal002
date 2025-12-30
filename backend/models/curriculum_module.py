"""
CurriculumModule model - Modules within a course
"""
from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from db.base_class import Base


class CurriculumModule(Base):
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("course.id"), nullable=False)
    module_order = Column(Integer, nullable=False)  # 1, 2, 3, etc.
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    estimated_duration_minutes = Column(Integer, nullable=True)
    
    # Relationships
    course = relationship("Course", back_populates="curriculum_modules")
    content_items = relationship("ContentItem", back_populates="module")
    module_progress = relationship("ModuleProgress", back_populates="module")
    quiz_config = relationship("QuizConfig", back_populates="module", uselist=False)
    quiz_attempts = relationship("QuizAttempt", back_populates="module")
    question_bank = relationship("QuestionBank", back_populates="module")
    evidence_items = relationship("EvidenceItem", back_populates="module")
