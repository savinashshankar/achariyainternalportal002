"""
ClassSection model - Represents class/section organization within schools
"""
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from db.base_class import Base


class ClassSection(Base):
    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("school.id"), nullable=False)
    name = Column(String, nullable=False)  # e.g., "Class 10-A", "Grade 12 Science"
    grade_level = Column(String, nullable=False)  # e.g., "10", "12"
    
    # Relationships
    school = relationship("School", back_populates="class_sections")
    student_profiles = relationship("StudentProfile", back_populates="class_section")
