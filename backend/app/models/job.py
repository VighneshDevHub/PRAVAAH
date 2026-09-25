import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, Text
from sqlalchemy.orm import relationship
from app.db.session import Base

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(String(36), primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_size = Column(Integer, nullable=False) # bytes
    status = Column(String(50), default="PENDING") # PENDING, PROCESSING, COMPLETED, FAILED
    progress = Column(Float, default=0.0) # 0.0 to 100.0
    error_message = Column(Text, nullable=True)
    
    total_sessions = Column(Integer, default=0)
    smtp_count = Column(Integer, default=0)
    imap_count = Column(Integer, default=0)
    pop3_count = Column(Integer, default=0)
    
    risk_score = Column(Float, default=100.0) # Posture Score 0-100
    risk_category = Column(String(50), default="LOW") # CRITICAL, HIGH, MODERATE, LOW
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    sessions = relationship("SessionModel", back_populates="job", cascade="all, delete-orphan")
    findings = relationship("FindingModel", back_populates="job", cascade="all, delete-orphan")
