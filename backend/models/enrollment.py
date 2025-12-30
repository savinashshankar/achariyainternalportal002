"""
Enrollment model - Student course enrollments
"""
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from db.base_class import Base


class EnrollmentStatus(enum.Enum):
    ACTIVE = "Active"
    COMPLETED = "Completed"
    DROPPED = "Dropped"


class Enrollment(Base):
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("studentprofile.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("course.id"), nullable=False)
    status = Column(SQLEnum(EnrollmentStatus), default=EnrollmentStatus.ACTIVE)
    enrolled_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    student_profile = relationship("StudentProfile", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
    module_progress = relationship("ModuleProgress", back_populates="enrollment")
    quiz_attempts = relationship("QuizAttempt", back_populates="enrollment")
