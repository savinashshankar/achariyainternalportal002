"""
PrincipalProfile model - Extended principal information
"""
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from db.base_class import Base


class PrincipalProfile(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False, unique=True)
    school_id = Column(Integer, ForeignKey("school.id"), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="principal_profile")
    school = relationship("School", back_populates="principal_profiles")
