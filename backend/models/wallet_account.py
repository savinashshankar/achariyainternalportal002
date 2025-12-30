"""
WalletAccount model - User wallet for credits
"""
from sqlalchemy import Column, Integer, ForeignKey, Float, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum
from db.base_class import Base


class WalletRole(enum.Enum):
    STUDENT = "Student"
    TEACHER = "Teacher"


class WalletAccount(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False, unique=True)
    role = Column(SQLEnum(WalletRole), nullable=False)
    balance_credits = Column(Float, default=0.0)
    
    # Relationships
    user = relationship("User", back_populates="wallet_account")
    transactions = relationship("WalletTransaction", back_populates="wallet")
