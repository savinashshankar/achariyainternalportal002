"""
WalletTransaction model - Immutable transaction log for wallet
"""
from sqlalchemy import Column, Integer, ForeignKey, Float, String, DateTime, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from db.base_class import Base


class TransactionType(enum.Enum):
    QUIZ = "Quiz"
    REWARD = "Reward"
    REDEMPTION = "Redemption"


class WalletTransaction(Base):
    id = Column(Integer, primary_key=True, index=True)
    wallet_id = Column(Integer, ForeignKey("walletaccount.id"), nullable=False)
    reference_type = Column(SQLEnum(TransactionType), nullable=False)
    reference_id = Column(Integer, nullable=True)  # Quiz attempt ID, module ID, etc.
    credits_delta = Column(Float, nullable=False)  # Positive for credit, negative for debit
    description = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    wallet = relationship("WalletAccount", back_populates="transactions")
