"""
ContentItem model - Individual content pieces (video, PDF, text, etc.)
"""
from sqlalchemy import Column, Integer, String, ForeignKey, Text, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum
from db.base_class import Base


class ContentType(enum.Enum):
    TEXT = "TEXT"
    PDF = "PDF"
    PPT = "PPT"
    VIDEO = "VIDEO"
    AUDIO = "AUDIO"


class ContentItem(Base):
    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(Integer, ForeignKey("curriculummodule.id"), nullable=False)
    type = Column(SQLEnum(ContentType), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    url_or_path = Column(String, nullable=False)  # URL or file path
    duration_seconds = Column(Integer, nullable=True)  # For VIDEO/AUDIO
    active_flag = Column(Boolean, default=True)
    
    # Relationships
    module = relationship("CurriculumModule", back_populates="content_items")
