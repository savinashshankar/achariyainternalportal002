"""
Course model - Course catalog for the learning portal
"""
from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from db.base_class import Base


class Course(Base):
    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("school.id"), nullable=False)
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    subject = Column(String, nullable=False)  # Maths, Science, English, CS, etc.
    level = Column(String, nullable=True)  # Beginner, Intermediate, Advanced
    status = Column(String, default="Active")  # Active, Archived
    
    # Relationships
    school = relationship("School", back_populates="courses")
    curriculum_modules = relationship("CurriculumModule", back_populates="course", order_by="CurriculumModule.module_order")
    enrollments = relationship("Enrollment", back_populates="course")
    evidence_items = relationship("EvidenceItem", back_populates="course")

