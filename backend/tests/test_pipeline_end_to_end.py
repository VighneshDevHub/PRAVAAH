import pytest
import uuid
from app.db.session import SyncSessionLocal
from app.models.job import Job
from app.models.session import SessionModel
from app.models.finding import FindingModel
from app.pipeline.pipeline_runner import run_pcap_pipeline
from app.reports.report_builder import generate_reports
from app.core.config import settings

def test_pipeline_weak_sslv3_pcap():
    db = SyncSessionLocal()
    pcap_path = settings.BASE_DIR / "tests" / "fixtures" / "pcaps" / "smtp_weak_sslv3_rc4.pcap"
    
    assert pcap_path.exists(), "Synthetic PCAP file must exist"
    
    job_id = str(uuid.uuid4())
    job = Job(id=job_id, filename="smtp_weak_sslv3_rc4.pcap", file_size=1024, status="PENDING")
    db.add(job)
    db.commit()
    
    # Run pipeline
    run_pcap_pipeline(job_id, str(pcap_path), db)
    
    db.refresh(job)
    assert job.status == "COMPLETED"
    assert job.total_sessions > 0
    assert job.smtp_count > 0
    assert job.risk_score < 75.0 # Weak SSLv3 + RC4 should result in lower score
    assert job.risk_category in ["CRITICAL", "HIGH", "MODERATE"]
    
    sessions = db.query(SessionModel).filter(SessionModel.job_id == job_id).all()
    assert len(sessions) == job.total_sessions
    assert sessions[0].protocol == "SMTP"
    assert sessions[0].starttls_status in ["STARTTLS_OK", "IMPLICIT_TLS"]
    assert sessions[0].tls_version == "SSLv3"
    assert "RC4" in sessions[0].cipher_suite
    
    findings = db.query(FindingModel).filter(FindingModel.job_id == job_id).all()
    assert len(findings) > 0
    rule_ids = [f.rule_id for f in findings]
    assert "RULE_DEPRECATED_TLS_SSLV3" in rule_ids or "Use of Obsolete SSLv3 Protocol" in rule_ids
    
    # Generate reports
    job_dict = {"id": job.id, "filename": job.filename, "total_sessions": job.total_sessions, "smtp_count": job.smtp_count, "imap_count": job.imap_count, "pop3_count": job.pop3_count, "risk_score": job.risk_score, "risk_category": job.risk_category}
    sess_dict = [{"id": s.id} for s in sessions]
    find_dict = [{"severity": f.severity, "title": f.title, "category": f.category, "standard_ref": f.standard_ref, "recommendation": f.recommendation} for f in findings]
    
    paths = generate_reports(job_dict, sess_dict, find_dict)
    for fmt, p in paths.items():
        assert open(p, "rb").read() != b""

def test_pipeline_hardened_tls13_pcap():
    db = SyncSessionLocal()
    pcap_path = settings.BASE_DIR / "tests" / "fixtures" / "pcaps" / "smtp_hardened_tls13.pcap"
    
    job_id = str(uuid.uuid4())
    job = Job(id=job_id, filename="smtp_hardened_tls13.pcap", file_size=1024, status="PENDING")
    db.add(job)
    db.commit()
    
    run_pcap_pipeline(job_id, str(pcap_path), db)
    
    db.refresh(job)
    assert job.status == "COMPLETED"
    assert job.risk_score >= 70.0 # Hardened TLS 1.3 score should be high/moderate
    
    sessions = db.query(SessionModel).filter(SessionModel.job_id == job_id).all()
    assert sessions[0].tls_version in ["TLS 1.2", "TLS 1.3"]
    assert sessions[0].has_forward_secrecy is True
