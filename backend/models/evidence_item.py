"""
EvidenceItem model - Teacher-submitted evidence files
"""
from sqlalchemy import Column, Integer, ForeignKey, String, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.base_class import Base


class EvidenceItem(Base):
    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey("teacherprofile.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("course.id"), nullable=False)
    module_id = Column(Integer, ForeignKey("curriculummodule.id"), nullable=True)
    file_type = Column(String, nullable=True)  # PDF, Image, Doc, etc.
    description = Column(Text, nullable=True)
    file_url = Column(String, nullable=False)
    submitted_on = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    teacher = relationship("TeacherProfile", back_populates="evidence_items")
    course = relationship("Course", back_populates="evidence_items")
    module = relationship("CurriculumModule", back_populates="evidence_items")
