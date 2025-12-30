"""
User model - Unified user table for all roles
"""
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from db.base_class import Base


class UserRole(enum.Enum):
    STUDENT = "Student"
    TEACHER = "Teacher"
    PRINCIPAL = "Principal"
    ADMIN = "Admin"


class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=True)  # Nullable for POC demo
    name = Column(String, index=True, nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False)
    school_id = Column(Integer, ForeignKey("school.id"), nullable=True)
    status = Column(String, default="Active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)
    
    # Relationships
    school = relationship("School", back_populates="users")
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False)
    teacher_profile = relationship("TeacherProfile", back_populates="user", uselist=False)
    principal_profile = relationship("PrincipalProfile", back_populates="user", uselist=False)
    wallet_account = relationship("WalletAccount", back_populates="user", uselist=False)
    user_badges = relationship("UserBadge", back_populates="user")
    activity_logs = relationship("ActivityLog", back_populates="user")

