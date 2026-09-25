from typing import Optional

SMTP_PORTS = {25, 587, 465, 2525}
IMAP_PORTS = {143, 993}
POP3_PORTS = {110, 995}

def identify_protocol_by_port(port: int) -> Optional[str]:
    """Identify email application protocol by standard port numbers."""
    if port in SMTP_PORTS:
        return "SMTP"
    elif port in IMAP_PORTS:
        return "IMAP"
    elif port in POP3_PORTS:
        return "POP3"
    return None

def identify_protocol_by_banner(payload: bytes) -> Optional[str]:
    """Inspect plaintext payload banners to detect protocol on non-standard ports."""
    try:
        text = payload[:100].decode("ascii", errors="ignore").upper()
        if text.startswith("220 ") or "EHLO" in text or "HELO" in text:
            return "SMTP"
        if text.startswith("* OK") or "CAPABILITY" in text:
            return "IMAP"
        if text.startswith("+OK") or "STLS" in text:
            return "POP3"
    except Exception:
        pass
    return None

def detect_protocol(src_port: int, dst_port: int, raw_payload: bytes = b"") -> str:
    """Comprehensive protocol identifier for stream processing."""
    proto = identify_protocol_by_port(dst_port) or identify_protocol_by_port(src_port)
    if proto:
        return proto
    
    if raw_payload:
        proto = identify_protocol_by_banner(raw_payload)
        if proto:
            return proto
            
    return "UNKNOWN"
