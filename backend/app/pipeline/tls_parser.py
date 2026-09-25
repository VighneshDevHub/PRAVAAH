import hashlib
import struct
from typing import Dict, Any, List, Optional

# Lookup maps for standard TLS versions and ciphers
TLS_VERSIONS = {
    0x0200: "SSLv2",
    0x0300: "SSLv3",
    0x0301: "TLS 1.0",
    0x0302: "TLS 1.1",
    0x0303: "TLS 1.2",
    0x0304: "TLS 1.3"
}

# Key cipher suite mappings with security properties
CIPHER_SUITES = {
    0x0004: {"name": "TLS_RSA_WITH_RC4_128_MD5", "pfs": False, "weak": True},
    0x0005: {"name": "TLS_RSA_WITH_RC4_128_SHA", "pfs": False, "weak": True},
    0x000A: {"name": "TLS_RSA_WITH_3DES_EDE_CBC_SHA", "pfs": False, "weak": True},
    0x002F: {"name": "TLS_RSA_WITH_AES_128_CBC_SHA", "pfs": False, "weak": False, "kex": "RSA"},
    0x0035: {"name": "TLS_RSA_WITH_AES_256_CBC_SHA", "pfs": False, "weak": False, "kex": "RSA"},
    0x009C: {"name": "TLS_RSA_WITH_AES_128_GCM_SHA256", "pfs": False, "weak": False, "kex": "RSA"},
    0xC013: {"name": "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA", "pfs": True, "weak": False, "kex": "ECDHE"},
    0xC014: {"name": "TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA", "pfs": True, "weak": False, "kex": "ECDHE"},
    0xC02F: {"name": "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256", "pfs": True, "weak": False, "kex": "ECDHE"},
    0xC030: {"name": "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384", "pfs": True, "weak": False, "kex": "ECDHE"},
    0x1301: {"name": "TLS_AES_128_GCM_SHA256", "pfs": True, "weak": False, "kex": "ECDHE"},
    0x1302: {"name": "TLS_AES_256_GCM_SHA384", "pfs": True, "weak": False, "kex": "ECDHE"},
    0x1303: {"name": "TLS_CHACHA20_POLY1305_SHA256", "pfs": True, "weak": False, "kex": "ECDHE"},
    0x0003: {"name": "TLS_RSA_EXPORT_WITH_RC4_40_MD5", "pfs": False, "weak": True},
    0x001B: {"name": "TLS_DH_anon_WITH_3DES_EDE_CBC_SHA", "pfs": False, "weak": True},
}

GREASE_TABLE = {0x0a0a, 0x1a1a, 0x2a2a, 0x3a3a, 0x4a4a, 0x5a5a, 0x6a6a, 0x7a7a, 0x8a8a, 0x9a9a, 0xaaaa, 0xbbbb, 0xcccc, 0xdddd, 0xeeee, 0xffff}

def parse_tls_handshakes(stream_payload: bytes) -> Dict[str, Any]:
    """
    Parses ClientHello, ServerHello, and Certificate records from binary stream.
    Computes JA3 and JA3S fingerprints and extracts negotiated cipher metadata.
    """
    result = {
        "client_hello": None,
        "server_hello": None,
        "certificates_raw": [],
        "ja3_hash": None,
        "ja3s_hash": None,
        "tls_version": "UNKNOWN",
        "cipher_suite": "UNKNOWN",
        "key_exchange": "UNKNOWN",
        "has_forward_secrecy": False
    }
    
    idx = 0
    payload_len = len(stream_payload)
    
    while idx + 5 <= payload_len:
        # Search for TLS Record Layer header (Content Type 0x16 = Handshake)
        content_type, major, minor, rec_len = struct.unpack(">BBBH", stream_payload[idx:idx+5])
        if content_type != 0x16 or major != 0x03:
            idx += 1
            continue
            
        rec_data = stream_payload[idx+5:idx+5+rec_len]
        idx += 5 + rec_len
        
        # Parse Handshake messages inside record
        h_idx = 0
        while h_idx + 4 <= len(rec_data):
            msg_type = rec_data[h_idx]
            msg_len = (rec_data[h_idx+1] << 16) | (rec_data[h_idx+2] << 8) | rec_data[h_idx+3]
            msg_body = rec_data[h_idx+4:h_idx+4+msg_len]
            h_idx += 4 + msg_len
            
            if msg_type == 1: # ClientHello
                ch = parse_client_hello(msg_body)
                if ch:
                    result["client_hello"] = ch
                    result["ja3_hash"] = compute_ja3(ch)
            elif msg_type == 2: # ServerHello
                sh = parse_server_hello(msg_body)
                if sh:
                    result["server_hello"] = sh
                    result["ja3s_hash"] = compute_ja3s(sh)
                    result["tls_version"] = sh["version_name"]
                    result["cipher_suite"] = sh["cipher_name"]
                    result["has_forward_secrecy"] = sh["has_pfs"]
                    result["key_exchange"] = sh["kex"]
            elif msg_type == 11: # Certificate
                certs = parse_certificate_msg(msg_body)
                result["certificates_raw"].extend(certs)
                
    return result

def parse_client_hello(body: bytes) -> Optional[Dict[str, Any]]:
    if len(body) < 34:
        return None
    version = struct.unpack(">H", body[:2])[0]
    session_id_len = body[34]
    idx = 35 + session_id_len
    if idx + 2 > len(body):
        return None
        
    ciphers_len = struct.unpack(">H", body[idx:idx+2])[0]
    idx += 2
    ciphers = []
    for i in range(0, ciphers_len, 2):
        if idx + i + 2 <= len(body):
            ciphers.append(struct.unpack(">H", body[idx+i:idx+i+2])[0])
    idx += ciphers_len
    
    if idx >= len(body):
        return {"version": version, "ciphers": ciphers, "extensions": [], "curves": [], "points": []}
        
    comp_len = body[idx]
    idx += 1 + comp_len
    
    extensions = []
    curves = []
    points = []
    sni = ""
    
    if idx + 2 <= len(body):
        ext_len = struct.unpack(">H", body[idx:idx+2])[0]
        idx += 2
        ext_end = idx + ext_len
        while idx + 4 <= min(ext_end, len(body)):
            ext_type, ext_body_len = struct.unpack(">HH", body[idx:idx+4])
            ext_data = body[idx+4:idx+4+ext_body_len]
            extensions.append(ext_type)
            
            if ext_type == 10: # Supported Groups (Elliptic Curves)
                if len(ext_data) >= 2:
                    g_len = struct.unpack(">H", ext_data[:2])[0]
                    for g in range(2, g_len+2, 2):
                        if g + 2 <= len(ext_data):
                            curves.append(struct.unpack(">H", ext_data[g:g+2])[0])
            elif ext_type == 11: # EC Point Formats
                if len(ext_data) >= 1:
                    p_len = ext_data[0]
                    for p in range(1, p_len+1):
                        if p < len(ext_data):
                            points.append(ext_data[p])
            elif ext_type == 43: # Supported Versions (TLS 1.3 extension)
                if len(ext_data) >= 1:
                    v_len = ext_data[0]
                    if v_len >= 2:
                        supp_v = struct.unpack(">H", ext_data[1:3])[0]
                        version = supp_v
                        
            idx += 4 + ext_body_len
            
    return {
        "version": version,
        "ciphers": [c for c in ciphers if c not in GREASE_TABLE],
        "extensions": [e for e in extensions if e not in GREASE_TABLE],
        "curves": [c for c in curves if c not in GREASE_TABLE],
        "points": points
    }

def parse_server_hello(body: bytes) -> Optional[Dict[str, Any]]:
    if len(body) < 38:
        return None
    version = struct.unpack(">H", body[:2])[0]
    session_id_len = body[34]
    idx = 35 + session_id_len
    if idx + 2 > len(body):
        return None
        
    cipher_id = struct.unpack(">H", body[idx:idx+2])[0]
    idx += 2 + 1 # cipher + compression
    
    extensions = []
    if idx + 2 <= len(body):
        ext_len = struct.unpack(">H", body[idx:idx+2])[0]
        idx += 2
        ext_end = idx + ext_len
        while idx + 4 <= min(ext_end, len(body)):
            ext_type, ext_body_len = struct.unpack(">HH", body[idx:idx+4])
            ext_data = body[idx+4:idx+4+ext_body_len]
            extensions.append(ext_type)
            if ext_type == 43: # Supported versions
                if len(ext_data) >= 2:
                    version = struct.unpack(">H", ext_data[:2])[0]
            idx += 4 + ext_body_len

    c_info = CIPHER_SUITES.get(cipher_id, {"name": f"0x{cipher_id:04X}", "pfs": "ECDH" in hex(cipher_id) or "DHE" in hex(cipher_id), "weak": False, "kex": "ECDHE" if "C0" in hex(cipher_id) else "RSA"})
    
    return {
        "version": version,
        "version_name": TLS_VERSIONS.get(version, f"0x{version:04X}"),
        "cipher_id": cipher_id,
        "cipher_name": c_info["name"],
        "has_pfs": c_info.get("pfs", False),
        "kex": c_info.get("kex", "ECDHE"),
        "extensions": [e for e in extensions if e not in GREASE_TABLE]
    }

def parse_certificate_msg(body: bytes) -> List[bytes]:
    certs = []
    if len(body) < 3:
        return certs
    certs_len = (body[0] << 16) | (body[1] << 8) | body[2]
    idx = 3
    while idx + 3 <= min(certs_len + 3, len(body)):
        c_len = (body[idx] << 16) | (body[idx+1] << 8) | body[idx+2]
        c_bytes = body[idx+3:idx+3+c_len]
        certs.append(c_bytes)
        idx += 3 + c_len
    return certs

def compute_ja3(ch: Dict[str, Any]) -> str:
    ciphers_str = "-".join(str(c) for c in ch["ciphers"])
    exts_str = "-".join(str(e) for e in ch["extensions"])
    curves_str = "-".join(str(c) for c in ch["curves"])
    points_str = "-".join(str(p) for p in ch["points"])
    ja3_str = f"{ch['version']},{ciphers_str},{exts_str},{curves_str},{points_str}"
    return hashlib.md5(ja3_str.encode('utf-8')).hexdigest()

def compute_ja3s(sh: Dict[str, Any]) -> str:
    exts_str = "-".join(str(e) for e in sh["extensions"])
    ja3s_str = f"{sh['version']},{sh['cipher_id']},{exts_str}"
    return hashlib.md5(ja3s_str.encode('utf-8')).hexdigest()
