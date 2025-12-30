"""
School model - Represents schools and colleges in the system
"""
from sqlalchemy import Column, Integer, String, Enum as SQLEnum, DateTime, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from db.base_class import Base


class LocationType(enum.Enum):
    SCHOOL = "School"
    COLLEGE = "College"


class School(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    location_type = Column(SQLEnum(LocationType), nullable=False)
    status = Column(String, default="Active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    users = relationship("User", back_populates="school")
    class_sections = relationship("ClassSection", back_populates="school")
    courses = relationship("Course", back_populates="school")
    principal_profiles = relationship("PrincipalProfile", back_populates="school")
