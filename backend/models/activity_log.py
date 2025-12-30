"""
ActivityLog model - Comprehensive activity tracking
"""
from sqlalchemy import Column, Integer, ForeignKey, String, JSON, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.base_class import Base


class ActivityLog(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    action_type = Column(String, nullable=False)  # login, quiz_submit, module_complete, etc.
    entity_type = Column(String, nullable=True)  # course, module, quiz, etc.
    entity_id = Column(Integer, nullable=True)
    meta_json = Column(JSON, nullable=True)  # Additional metadata as JSON
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    # Relationships
    user = relationship("User", back_populates="activity_logs")
