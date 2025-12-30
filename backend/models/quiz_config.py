"""
QuizConfig model - Configuration for module quizzes
"""
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from db.base_class import Base


class QuizConfig(Base):
    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(Integer, ForeignKey("curriculummodule.id"), nullable=False, unique=True)
    total_questions = Column(Integer, default=15)
    time_limit_seconds = Column(Integer, default=120)  # 2 minutes
    pass_score_percent = Column(Integer, default=100)  # 100% required to pass
    
    # Relationships
    module = relationship("CurriculumModule", back_populates="quiz_config")
