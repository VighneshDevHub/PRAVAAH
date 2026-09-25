from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_async_db
from app.models.job import Job
from app.models.session import SessionModel
from app.models.finding import FindingModel
from app.schemas.finding import FindingResponse
from app.schemas.session import SessionResponse
from app.reports.report_builder import generate_reports
from app.ml.recommendation import generate_posture_recommendations

router = APIRouter(prefix="/findings", tags=["Findings & Reports"])

@router.get("", response_model=List[FindingResponse])
async def list_findings(
    job_id: Optional[str] = None,
    severity: Optional[str] = None,
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_async_db)
):
    query = select(FindingModel)
    if job_id:
        query = query.filter(FindingModel.job_id == job_id)
    if severity:
        query = query.filter(FindingModel.severity == severity.upper())
    if category:
        query = query.filter(FindingModel.category == category.upper())
        
    query = query.order_by(FindingModel.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/recommendations/{job_id}")
async def get_recommendations(job_id: str, db: AsyncSession = Depends(get_async_db)):
    job_res = await db.execute(select(Job).filter(Job.id == job_id))
    job = job_res.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    find_res = await db.execute(select(FindingModel).filter(FindingModel.job_id == job_id))
    findings = [FindingResponse.model_validate(f).model_dump() for f in find_res.scalars().all()]
    
    recs = generate_posture_recommendations(findings, job.risk_score)
    return recs

@router.get("/reports/{job_id}/download")
async def download_report(
    job_id: str,
    format: str = Query("json"),
    db: AsyncSession = Depends(get_async_db)
):
    fmt = format.lower()
    if fmt not in ["json", "html", "pdf"]:
        fmt = "json"

    job_res = await db.execute(select(Job).filter(Job.id == job_id))
    job = job_res.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    sess_res = await db.execute(select(SessionModel).filter(SessionModel.job_id == job_id))
    sessions = [SessionResponse.model_validate(s).model_dump() for s in sess_res.scalars().all()]
    
    find_res = await db.execute(select(FindingModel).filter(FindingModel.job_id == job_id))
    findings = [FindingResponse.model_validate(f).model_dump() for f in find_res.scalars().all()]
    
    job_dict = {
        "id": job.id,
        "filename": job.filename,
        "total_sessions": job.total_sessions,
        "smtp_count": job.smtp_count,
        "imap_count": job.imap_count,
        "pop3_count": job.pop3_count,
        "risk_score": job.risk_score,
        "risk_category": job.risk_category
    }
    
    report_paths = generate_reports(job_dict, sessions, findings)
    file_path = report_paths[fmt]
    
    media_types = {
        "json": "application/json",
        "html": "text/html",
        "pdf": "application/pdf"
    }
    
    return FileResponse(
        path=file_path,
        media_type=media_types[fmt],
        filename=f"PRAVAAH_{job_id}.{fmt}"
    )
