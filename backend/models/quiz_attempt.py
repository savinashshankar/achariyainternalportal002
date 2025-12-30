"""
QuizAttempt model - Records of student quiz attempts
"""
from sqlalchemy import Column, Integer, ForeignKey, Float, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.base_class import Base


class QuizAttempt(Base):
    id = Column(Integer, primary_key=True, index=True)
    enrollment_id = Column(Integer, ForeignKey("enrollment.id"), nullable=False)
    module_id = Column(Integer, ForeignKey("curriculummodule.id"), nullable=False)
    attempt_number = Column(Integer, nullable=False)  # 1, 2, or 3
    score_percent = Column(Float, nullable=False)  # 0.0 to 100.0
    time_taken_seconds = Column(Integer, nullable=False)
    completed_in_time = Column(Boolean, default=True)  # Did they finish before time limit?
    attempt_datetime = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    enrollment = relationship("Enrollment", back_populates="quiz_attempts")
    module = relationship("CurriculumModule", back_populates="quiz_attempts")
