import datetime
from typing import List, Optional
from pydantic import BaseModel

class JobBase(BaseModel):
    filename: str

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: str
    file_size: int
    status: str
    progress: float
    error_message: Optional[str] = None
    total_sessions: int = 0
    smtp_count: int = 0
    imap_count: int = 0
    pop3_count: int = 0
    risk_score: float = 100.0
    risk_category: str = "LOW"
    created_at: datetime.datetime
    completed_at: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True
