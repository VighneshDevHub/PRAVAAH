import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class FindingModel(Base):
    __tablename__ = "findings"
    
    id = Column(String(36), primary_key=True, index=True)
    job_id = Column(String(36), ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    session_id = Column(String(36), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=True, index=True)
    
    rule_id = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    severity = Column(String(20), nullable=False) # CRITICAL, HIGH, MEDIUM, LOW, INFO
    category = Column(String(50), nullable=False) # TLS_VERSION, CIPHER_SUITE, CERTIFICATE, STARTTLS, PROTOCOL
    
    description = Column(Text, nullable=False)
    standard_ref = Column(String(255), nullable=False) # e.g. NIST SP 800-52 Rev 2 Section 3.1
    recommendation = Column(Text, nullable=False)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    job = relationship("Job", back_populates="findings")
    session = relationship("SessionModel", back_populates="findings")
