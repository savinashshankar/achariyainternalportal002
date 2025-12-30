"""
ModuleProgress model - Tracks student progress through modules
"""
from sqlalchemy import Column, Integer, ForeignKey, Float, String, DateTime, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from db.base_class import Base


class ProgressStatus(enum.Enum):
    NOT_STARTED = "NotStarted"
    IN_PROGRESS = "InProgress"
    COMPLETED = "Completed"


class ModuleProgress(Base):
    id = Column(Integer, primary_key=True, index=True)
    enrollment_id = Column(Integer, ForeignKey("enrollment.id"), nullable=False)
    module_id = Column(Integer, ForeignKey("curriculummodule.id"), nullable=False)
    completion_percent = Column(Float, default=0.0)  # 0.0 to 100.0
    status = Column(SQLEnum(ProgressStatus), default=ProgressStatus.NOT_STARTED)
    last_access_time = Column(DateTime(timezone=True), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    enrollment = relationship("Enrollment", back_populates="module_progress")
    module = relationship("CurriculumModule", back_populates="module_progress")
