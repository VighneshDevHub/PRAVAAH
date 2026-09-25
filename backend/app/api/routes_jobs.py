import uuid
import shutil
import asyncio
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.config import settings
from app.db.session import get_async_db, SyncSessionLocal
from app.models.job import Job
from app.models.session import SessionModel
from app.schemas.job import JobResponse
from app.schemas.session import SessionResponse
from app.pipeline.pipeline_runner import run_pcap_pipeline

router = APIRouter(prefix="/jobs", tags=["Jobs"])

def process_job_background(job_id: str, pcap_path: str):
    """Sync background worker function executing PCAP pipeline."""
    db = SyncSessionLocal()
    try:
        run_pcap_pipeline(job_id, pcap_path, db)
    finally:
        db.close()

@router.post("/upload", response_model=JobResponse)
async def upload_pcap(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_async_db)
):
    if not (file.filename.endswith(".pcap") or file.filename.endswith(".pcapng") or file.filename.endswith(".cap")):
        raise HTTPException(status_code=400, detail="Invalid file extension. Expected .pcap, .pcapng, or .cap")
        
    job_id = str(uuid.uuid4())
    saved_path = settings.UPLOAD_DIR / f"{job_id}_{file.filename}"
    
    with open(saved_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    file_size = saved_path.stat().st_size
    
    job = Job(
        id=job_id,
        filename=file.filename,
        file_size=file_size,
        status="PENDING",
        progress=0.0
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)
    
    background_tasks.add_task(process_job_background, job_id, str(saved_path))
    return job

@router.post("/sample/{sample_name}", response_model=JobResponse)
async def trigger_sample_pcap(
    sample_name: str,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_async_db)
):
    """Triggers analysis on pre-generated synthetic PCAP test scenario."""
    sample_dir = settings.BASE_DIR / "tests" / "fixtures" / "pcaps"
    valid_samples = {
        "weak_sslv3": "smtp_weak_sslv3_rc4.pcap",
        "expired_imaps": "imaps_expired_sha1.pcap",
        "starttls_downgrade": "pop3_starttls_downgrade.pcap",
        "hardened_tls13": "smtp_hardened_tls13.pcap"
    }

    if sample_name not in valid_samples:
        raise HTTPException(status_code=400, detail=f"Sample '{sample_name}' not found. Valid options: {list(valid_samples.keys())}")

    pcap_filename = valid_samples[sample_name]
    source_pcap = sample_dir / pcap_filename

    if not source_pcap.exists():
        # Auto-generate if missing
        from scripts.generate_synthetic_pcaps import generate_all_synthetic_pcaps
        generate_all_synthetic_pcaps()

    job_id = str(uuid.uuid4())
    saved_path = settings.UPLOAD_DIR / f"{job_id}_{pcap_filename}"
    shutil.copyfile(source_pcap, saved_path)
    file_size = saved_path.stat().st_size

    job = Job(
        id=job_id,
        filename=pcap_filename,
        file_size=file_size,
        status="PENDING",
        progress=0.0
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)

    background_tasks.add_task(process_job_background, job_id, str(saved_path))
    return job

@router.get("", response_model=List[JobResponse])
async def list_jobs(db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Job).order_by(Job.created_at.desc()))
    return result.scalars().all()

@router.get("/{job_id}", response_model=JobResponse)
async def get_job(job_id: str, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Job).filter(Job.id == job_id))
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.get("/{job_id}/sessions", response_model=List[SessionResponse])
async def get_job_sessions(job_id: str, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(SessionModel).filter(SessionModel.job_id == job_id))
    return result.scalars().all()
