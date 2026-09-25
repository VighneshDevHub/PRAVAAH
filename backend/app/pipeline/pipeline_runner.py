import uuid
import datetime
from typing import Dict, Any, Callable, Optional
from sqlalchemy.orm import Session
from app.models.job import Job
from app.models.session import SessionModel
from app.models.finding import FindingModel
from app.pipeline.tcp_reassembly import reassemble_pcap
from app.pipeline.starttls_detect import analyze_starttls_flow
from app.pipeline.tls_parser import parse_tls_handshakes
from app.pipeline.cert_validator import analyze_certificate
from app.pipeline.rule_engine import evaluate_session_rules
from app.pipeline.feature_extractor import extract_session_features
from app.ml.risk_scorer import risk_scorer
from app.ml.anomaly_detector import anomaly_detector

def run_pcap_pipeline(job_id: str, pcap_path: str, db: Session, progress_callback: Optional[Callable[[float], None]] = None):
    """
    Executes end-to-end passive forensic analysis on a PCAP file and updates job database state.
    """
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        return
        
    try:
        job.status = "PROCESSING"
        job.progress = 10.0
        db.commit()
        if progress_callback:
            progress_callback(10.0)
            
        streams = reassemble_pcap(pcap_path)
        job.progress = 40.0
        db.commit()
        if progress_callback:
            progress_callback(40.0)

        total_streams = len(streams)
        job.total_sessions = total_streams
        
        if total_streams == 0:
            job.status = "COMPLETED"
            job.progress = 100.0
            job.risk_score = 100.0
            job.risk_category = "LOW"
            job.completed_at = datetime.datetime.utcnow()
            db.commit()
            if progress_callback:
                progress_callback(100.0)
            return

        session_models = []
        all_findings_models = []
        session_scores = []
        
        smtp_cnt = 0
        imap_cnt = 0
        pop3_cnt = 0

        for i, st in enumerate(streams):
            if st.protocol == "SMTP":
                smtp_cnt += 1
            elif st.protocol == "IMAP":
                imap_cnt += 1
            elif st.protocol == "POP3":
                pop3_cnt += 1

            # 1. STARTTLS Flow Analysis
            st_info = analyze_starttls_flow(st.client_payload, st.server_payload, st.dst_port, st.protocol)
            
            # 2. TLS Parsing
            full_bytes = st.client_payload + st.server_payload
            tls_info = parse_tls_handshakes(full_bytes)
            
            # 3. Certificate Analysis
            cert_analysis = {}
            if tls_info["certificates_raw"]:
                cert_analysis = analyze_certificate(tls_info["certificates_raw"][0])
                
            # Combine session metadata
            sess_dict = {
                "tls_version": tls_info["tls_version"],
                "cipher_suite": tls_info["cipher_suite"],
                "starttls_status": st_info["status"],
                "has_forward_secrecy": tls_info["has_forward_secrecy"],
                "key_exchange": tls_info["key_exchange"]
            }
            
            # 4. Rule Engine Evaluation
            findings = evaluate_session_rules(sess_dict, cert_analysis)
            
            # 5. ML Feature Extraction & Inference
            feat_vec = extract_session_features(sess_dict, findings, cert_analysis)
            sess_score, sess_cat = risk_scorer.predict_score(feat_vec)
            is_anom, anom_score = anomaly_detector.predict_anomaly(feat_vec)
            
            session_scores.append(sess_score)
            
            # Create Session ORM Object
            sess_id = str(uuid.uuid4())
            sess_model = SessionModel(
                id=sess_id,
                job_id=job_id,
                src_ip=st.src_ip,
                src_port=st.src_port,
                dst_ip=st.dst_ip,
                dst_port=st.dst_port,
                protocol=st.protocol,
                starttls_status=st_info["status"],
                tls_version=tls_info["tls_version"],
                cipher_suite=tls_info["cipher_suite"],
                key_exchange=tls_info["key_exchange"],
                has_forward_secrecy=tls_info["has_forward_secrecy"],
                ja3_hash=tls_info.get("ja3_hash"),
                ja3s_hash=tls_info.get("ja3s_hash"),
                cert_subject=cert_analysis.get("subject"),
                cert_issuer=cert_analysis.get("issuer"),
                cert_key_alg=cert_analysis.get("key_alg"),
                cert_key_length=cert_analysis.get("key_size"),
                cert_sig_alg=cert_analysis.get("sig_alg"),
                cert_days_remaining=cert_analysis.get("days_remaining"),
                is_self_signed=cert_analysis.get("is_self_signed", False),
                is_anomalous=is_anom,
                anomaly_score=anom_score,
                risk_score=sess_score
            )
            session_models.append(sess_model)
            
            # Create Finding ORM Objects
            for f in findings:
                f_model = FindingModel(
                    id=str(uuid.uuid4()),
                    job_id=job_id,
                    session_id=sess_id,
                    rule_id=f.get("rule_id", f.get("title")),
                    title=f.get("title"),
                    severity=f.get("severity"),
                    category=f.get("category"),
                    description=f.get("description"),
                    standard_ref=f.get("standard_ref"),
                    recommendation=f.get("recommendation")
                )
                all_findings_models.append(f_model)
                
            prog = 40.0 + (50.0 * (i + 1) / total_streams)
            job.progress = round(prog, 1)
            db.commit()
            if progress_callback:
                progress_callback(job.progress)

        # Bulk save
        db.add_all(session_models)
        db.add_all(all_findings_models)
        
        # Calculate overall job posture score
        avg_score = float(sum(session_scores) / len(session_scores)) if session_scores else 100.0
        job.risk_score = round(avg_score, 1)
        if avg_score < 50.0:
            job.risk_category = "CRITICAL"
        elif avg_score < 70.0:
            job.risk_category = "HIGH"
        elif avg_score < 85.0:
            job.risk_category = "MODERATE"
        else:
            job.risk_category = "LOW"

        job.smtp_count = smtp_cnt
        job.imap_count = imap_cnt
        job.pop3_count = pop3_cnt
        job.status = "COMPLETED"
        job.progress = 100.0
        job.completed_at = datetime.datetime.utcnow()
        db.commit()
        if progress_callback:
            progress_callback(100.0)

    except Exception as e:
        db.rollback()
        job.status = "FAILED"
        job.error_message = str(e)
        db.commit()
        if progress_callback:
            progress_callback(100.0)
