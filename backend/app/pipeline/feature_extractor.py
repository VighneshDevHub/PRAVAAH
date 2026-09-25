import numpy as np
from typing import Dict, Any, List

TLS_VERSION_RANK = {
    "SSLv2": 0.0,
    "SSLv3": 0.1,
    "TLS 1.0": 0.4,
    "TLS 1.1": 0.5,
    "TLS 1.2": 0.8,
    "TLS 1.3": 1.0,
    "UNKNOWN": 0.0
}

def extract_session_features(session_data: Dict[str, Any], findings: List[Dict[str, Any]], cert_analysis: Dict[str, Any]) -> np.ndarray:
    """
    Constructs a 12-dimensional numerical feature vector for ML risk scoring & anomaly detection.
    
    Features:
    0: TLS version rank (0.0 to 1.0)
    1: Has Perfect Forward Secrecy (0 or 1)
    2: Is weak cipher (0 or 1)
    3: STARTTLS status score (1.0 = IMPLICIT/OK, 0.0 = STRIPPED/PLAINTEXT)
    4: Cert validity days remaining (normalized)
    5: Is cert self-signed (0 or 1)
    6: Is cert key weak (0 or 1)
    7: Is cert signature weak (0 or 1)
    8: Critical findings count
    9: High findings count
    10: Medium findings count
    11: Low/Info findings count
    """
    tls_ver = session_data.get("tls_version", "UNKNOWN")
    tls_rank = TLS_VERSION_RANK.get(tls_ver, 0.0)
    pfs = 1.0 if session_data.get("has_forward_secrecy") else 0.0
    
    cipher = session_data.get("cipher_suite", "")
    is_weak_cipher = 1.0 if any(kw in cipher.upper() for kw in ["RC4", "3DES", "DES", "EXPORT", "NULL", "ADH"]) else 0.0
    
    st_status = session_data.get("starttls_status", "NONE")
    st_score = 1.0 if st_status in ["IMPLICIT_TLS", "STARTTLS_OK"] else 0.0
    
    days_left = cert_analysis.get("days_remaining", 365) if cert_analysis else 365
    days_norm = max(-1.0, min(1.0, days_left / 365.0))
    
    self_signed = 1.0 if cert_analysis.get("is_self_signed") else 0.0
    weak_key = 1.0 if cert_analysis.get("is_weak_key") else 0.0
    weak_sig = 1.0 if cert_analysis.get("is_weak_sig") else 0.0
    
    crit_cnt = sum(1 for f in findings if f.get("severity") == "CRITICAL")
    high_cnt = sum(1 for f in findings if f.get("severity") == "HIGH")
    med_cnt = sum(1 for f in findings if f.get("severity") == "MEDIUM")
    low_cnt = sum(1 for f in findings if f.get("severity") in ["LOW", "INFO"])
    
    vector = np.array([
        tls_rank, pfs, is_weak_cipher, st_score,
        days_norm, self_signed, weak_key, weak_sig,
        crit_cnt, high_cnt, med_cnt, low_cnt
    ], dtype=np.float32)
    
    return vector
