"""
StudentProfile model - Extended student information
"""
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from db.base_class import Base


class StudentProfile(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False, unique=True)
    class_section_id = Column(Integer, ForeignKey("classsection.id"), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="student_profile")
    class_section = relationship("ClassSection", back_populates="student_profiles")
    enrollments = relationship("Enrollment", back_populates="student_profile")
