import datetime
from typing import Dict, Any, List, Optional
from cryptography import x509
from cryptography.hazmat.primitives.asymmetric import rsa, ec, dsa

def analyze_certificate(cert_der: bytes, expected_hostname: Optional[str] = None) -> Dict[str, Any]:
    """
    Parses a DER-encoded X.509 certificate and checks for cryptographic posture weaknesses.
    """
    try:
        cert = x509.load_der_x509_certificate(cert_der)
    except Exception:
        return {"error": "Invalid DER X.509 certificate structure"}
        
    subject = cert.subject.rfc4514_string()
    issuer = cert.issuer.rfc4514_string()
    is_self_signed = (cert.subject == cert.issuer)
    
    not_before = cert.not_valid_before_utc
    not_after = cert.not_valid_after_utc
    now = datetime.datetime.now(datetime.timezone.utc)
    
    days_remaining = (not_after - now).days
    is_expired = now > not_after
    is_not_yet_valid = now < not_before
    
    # Key details
    pub_key = cert.public_key()
    key_alg = "UNKNOWN"
    key_size = 0
    
    if isinstance(pub_key, rsa.RSAPublicKey):
        key_alg = "RSA"
        key_size = pub_key.key_size
    elif isinstance(pub_key, ec.EllipticCurvePublicKey):
        key_alg = "ECC"
        key_size = pub_key.key_size
    elif isinstance(pub_key, dsa.DSAPublicKey):
        key_alg = "DSA"
        key_size = pub_key.key_size
        
    # Signature details
    sig_alg = cert.signature_algorithm_oid._name
    
    # SAN (Subject Alternative Names)
    san_list = []
    try:
        san_ext = cert.extensions.get_extension_for_oid(x509.ExtensionOID.SUBJECT_ALTERNATIVE_NAME)
        san_list = san_ext.value.get_values_for_type(x509.DNSName)
    except Exception:
        pass

    # Hostname mismatch check
    san_mismatch = False
    if expected_hostname and san_list:
        san_mismatch = not any(
            expected_hostname.lower() == name.lower() or 
            (name.startswith("*.") and expected_hostname.lower().endswith(name[2:].lower()))
            for name in san_list
        )

    # Weakness flags
    is_weak_key = (key_alg == "RSA" and key_size < 2048) or (key_alg == "ECC" and key_size < 256)
    is_weak_sig = "sha1" in sig_alg.lower() or "md5" in sig_alg.lower()
    
    return {
        "subject": subject,
        "issuer": issuer,
        "is_self_signed": is_self_signed,
        "not_before": not_before.isoformat(),
        "not_after": not_after.isoformat(),
        "days_remaining": days_remaining,
        "is_expired": is_expired,
        "is_not_yet_valid": is_not_yet_valid,
        "key_alg": key_alg,
        "key_size": key_size,
        "sig_alg": sig_alg,
        "san_list": san_list,
        "san_mismatch": san_mismatch,
        "is_weak_key": is_weak_key,
        "is_weak_sig": is_weak_sig
    }
