import datetime
from typing import Optional, List
from pydantic import BaseModel

class SessionResponse(BaseModel):
    id: str
    job_id: str
    src_ip: str
    src_port: int
    dst_ip: str
    dst_port: int
    protocol: str
    starttls_status: str
    tls_version: str
    cipher_suite: str
    key_exchange: str
    has_forward_secrecy: bool
    ja3_hash: Optional[str] = None
    ja3s_hash: Optional[str] = None
    cert_subject: Optional[str] = None
    cert_issuer: Optional[str] = None
    cert_key_alg: Optional[str] = None
    cert_key_length: Optional[int] = None
    cert_sig_alg: Optional[str] = None
    cert_days_remaining: Optional[int] = None
    is_self_signed: bool = False
    is_anomalous: bool = False
    anomaly_score: float = 0.0
    risk_score: float = 100.0
    created_at: datetime.datetime

    class Config:
        from_attributes = True
