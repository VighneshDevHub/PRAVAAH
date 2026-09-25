import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.future import select
from app.db.session import AsyncSessionLocal
from app.models.job import Job

router = APIRouter(tags=["WebSockets"])

@router.websocket("/ws/jobs/{job_id}")
async def websocket_job_status(websocket: WebSocket, job_id: str):
    await websocket.accept()
    try:
        while True:
            async with AsyncSessionLocal() as db:
                result = await db.execute(select(Job).filter(Job.id == job_id))
                job = result.scalars().first()
                if job:
                    data = {
                        "job_id": job.id,
                        "status": job.status,
                        "progress": job.progress,
                        "risk_score": job.risk_score,
                        "risk_category": job.risk_category,
                        "total_sessions": job.total_sessions,
                        "error_message": job.error_message
                    }
                    await websocket.send_json(data)
                    if job.status in ["COMPLETED", "FAILED"]:
                        break
            await asyncio.sleep(1.0)
    except WebSocketDisconnect:
        pass
    except Exception:
        pass
