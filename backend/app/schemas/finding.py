import datetime
from typing import Optional
from pydantic import BaseModel

class FindingResponse(BaseModel):
    id: str
    job_id: str
    session_id: Optional[str] = None
    rule_id: str
    title: str
    severity: str
    category: str
    description: str
    standard_ref: str
    recommendation: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True
