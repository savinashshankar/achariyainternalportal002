"""
TeacherProfile model - Extended teacher information
"""
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from db.base_class import Base


class TeacherProfile(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False, unique=True)
    department = Column(String, nullable=True)
    designation = Column(String, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="teacher_profile")
    evidence_items = relationship("EvidenceItem", back_populates="teacher")
