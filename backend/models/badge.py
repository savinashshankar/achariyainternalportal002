"""
Badge model - Available badges for gamification
"""
from sqlalchemy import Column, Integer, String, Text, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum
from db.base_class import Base


class BadgeScope(enum.Enum):
    STUDENT = "Student"
    TEACHER = "Teacher"
    BOTH = "Both"


class Badge(Base):
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    role_scope = Column(SQLEnum(BadgeScope), nullable=False)
    criteria_json = Column(JSON, nullable=True)  # Stores criteria as JSON
    
    # Relationships
    user_badges = relationship("UserBadge", back_populates="badge")
