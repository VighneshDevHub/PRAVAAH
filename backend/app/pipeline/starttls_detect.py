from typing import Tuple, Dict, Any

def analyze_starttls_flow(client_payload: bytes, server_payload: bytes, dst_port: int, protocol: str) -> Dict[str, Any]:
    """
    Analyzes application layer payload to determine STARTTLS status, negotiation flow,
    and potential downgrade or stripping attacks.
    
    Status values: IMPLICIT_TLS, STARTTLS_OK, STRIPPED, NO_ENCRYPTION, PLAINTEXT_AUTH
    """
    implicit_ports = {465, 993, 995}
    
    # Check if stream begins immediately with TLS Handshake (0x16 = 22)
    if (len(client_payload) >= 3 and client_payload[0] == 0x16 and client_payload[1] == 0x03) or dst_port in implicit_ports:
        return {
            "status": "IMPLICIT_TLS",
            "starttls_command_found": False,
            "starttls_response_ok": False,
            "downgrade_detected": False,
            "plaintext_auth_observed": False,
            "details": "Implicit TLS connection established on port."
        }
        
    client_text = client_payload.decode("ascii", errors="ignore").upper()
    server_text = server_payload.decode("ascii", errors="ignore").upper()
    
    starttls_cmd = False
    starttls_ok = False
    
    if protocol == "SMTP":
        if "STARTTLS" in client_text:
            starttls_cmd = True
        if "220 2.0.0 READY TO START TLS" in server_text or "220 READY TO START TLS" in server_text or "220 2.0.0 STARTTLS" in server_text:
            starttls_ok = True
    elif protocol == "IMAP":
        if "STARTTLS" in client_text:
            starttls_cmd = True
        if "OK BEGIN TLS" in server_text or "OK STARTTLS" in server_text:
            starttls_ok = True
    elif protocol == "POP3":
        if "STLS" in client_text:
            starttls_cmd = True
        if "+OK BEGIN TLS" in server_text or "+OK STLS" in server_text:
            starttls_ok = True

    # Check for plaintext credentials transmission
    plaintext_auth = False
    auth_keywords = ["AUTH PLAIN", "AUTH LOGIN", "PASS ", "LOGIN "]
    for kw in auth_keywords:
        if kw in client_text:
            plaintext_auth = True
            break

    # TLS ClientHello header pattern after STARTTLS negotiation
    has_tls_handshake = b"\x16\x03" in client_payload
    
    if starttls_cmd and starttls_ok and has_tls_handshake:
        status = "STARTTLS_OK"
        details = "Explicit STARTTLS successfully negotiated and upgraded to TLS."
        downgrade = False
    elif ("STARTTLS" in server_text or "STLS" in server_text) and not starttls_cmd and plaintext_auth:
        status = "STRIPPED"
        details = "STARTTLS advertised by server but omitted by client. Plaintext credentials observed."
        downgrade = True
    elif plaintext_auth:
        status = "PLAINTEXT_AUTH"
        details = "Unencrypted session transmitting authentication credentials in cleartext."
        downgrade = True
    elif has_tls_handshake:
        status = "STARTTLS_OK"
        details = "TLS handshake observed in payload stream."
        downgrade = False
    else:
        status = "NO_ENCRYPTION"
        details = "Plaintext session with no encryption upgrade attempted."
        downgrade = False
        
    return {
        "status": status,
        "starttls_command_found": starttls_cmd,
        "starttls_response_ok": starttls_ok,
        "downgrade_detected": downgrade,
        "plaintext_auth_observed": plaintext_auth,
        "details": details
    }
