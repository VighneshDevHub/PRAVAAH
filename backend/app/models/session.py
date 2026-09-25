import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class SessionModel(Base):
    __tablename__ = "sessions"
    
    id = Column(String(36), primary_key=True, index=True)
    job_id = Column(String(36), ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    
    src_ip = Column(String(45), nullable=False)
    src_port = Column(Integer, nullable=False)
    dst_ip = Column(String(45), nullable=False)
    dst_port = Column(Integer, nullable=False)
    protocol = Column(String(20), nullable=False) # SMTP, IMAP, POP3
    
    starttls_status = Column(String(50), default="NONE") # IMPLICIT_TLS, STARTTLS_OK, STRIPPED, NONE
    tls_version = Column(String(30), default="UNKNOWN") # SSLv3, TLS 1.0, TLS 1.1, TLS 1.2, TLS 1.3
    cipher_suite = Column(String(100), default="UNKNOWN")
    key_exchange = Column(String(50), default="UNKNOWN")
    has_forward_secrecy = Column(Boolean, default=False)
    
    ja3_hash = Column(String(32), nullable=True)
    ja3s_hash = Column(String(32), nullable=True)
    
    cert_subject = Column(String(255), nullable=True)
    cert_issuer = Column(String(255), nullable=True)
    cert_key_alg = Column(String(50), nullable=True)
    cert_key_length = Column(Integer, nullable=True)
    cert_sig_alg = Column(String(50), nullable=True)
    cert_days_remaining = Column(Integer, nullable=True)
    is_self_signed = Column(Boolean, default=False)
    
    is_anomalous = Column(Boolean, default=False)
    anomaly_score = Column(Float, default=0.0)
    risk_score = Column(Float, default=100.0)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    job = relationship("Job", back_populates="sessions")
    findings = relationship("FindingModel", back_populates="session", cascade="all, delete-orphan")
