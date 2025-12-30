"""
QuestionBank model - Quiz questions for modules
"""
from sqlalchemy import Column, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from db.base_class import Base


class QuestionBank(Base):
    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(Integer, ForeignKey("curriculummodule.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    explanation_text = Column(Text, nullable=True)
    
    # Relationships
    module = relationship("CurriculumModule", back_populates="question_bank")
    options = relationship("QuestionOption", back_populates="question", cascade="all, delete-orphan")
