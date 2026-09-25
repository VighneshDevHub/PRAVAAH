from typing import List, Dict, Any, Optional

RULE_DEFINITIONS = {
    "RULE_DEPRECATED_TLS_SSLV3": {
        "title": "Use of Obsolete SSLv3 Protocol",
        "severity": "CRITICAL",
        "category": "TLS_VERSION",
        "standard_ref": "RFC 7568 / NIST SP 800-52 Rev 2 Section 3.1",
        "description": "SSLv3 is fundamentally insecure and vulnerable to POODLE attacks. Must be completely disabled.",
        "recommendation": "Disable SSLv3 across all SMTP/IMAP/POP3 services. Enforce TLS 1.2 or TLS 1.3 minimum."
    },
    "RULE_DEPRECATED_TLS_10_11": {
        "title": "Use of Deprecated TLS 1.0 / TLS 1.1 Protocol",
        "severity": "HIGH",
        "category": "TLS_VERSION",
        "standard_ref": "RFC 8996 / NIST SP 800-52 Rev 2 Section 3.1",
        "description": "TLS 1.0 and 1.1 lack support for modern AEAD ciphers and are deprecated by IETF/NIST.",
        "recommendation": "Configure email servers to reject TLS 1.0/1.1 connections and enforce TLS 1.2+."
    },
    "RULE_WEAK_CIPHER_SUITE": {
        "title": "Negotiation of Insecure Cipher Suite",
        "severity": "CRITICAL",
        "category": "CIPHER_SUITE",
        "standard_ref": "NIST SP 800-52 Rev 2 Section 3.3.1 / RFC 7507",
        "description": "Session negotiated an obsolete or vulnerable cipher suite (e.g. RC4, 3DES, EXPORT, NULL, or ADH).",
        "recommendation": "Reconfigure TLS cipher suite priority list to remove weak ciphers and prioritize AES-GCM and ChaCha20-Poly1305."
    },
    "RULE_NO_FORWARD_SECRECY": {
        "title": "Lack of Perfect Forward Secrecy (PFS)",
        "severity": "MEDIUM",
        "category": "CIPHER_SUITE",
        "standard_ref": "NIST SP 800-52 Rev 2 Section 3.3.1 / RFC 8314",
        "description": "Negotiated cipher suite relies on static RSA key exchange instead of ECDHE/DHE. Passive traffic capture allows retroactive decryption if private key is compromised.",
        "recommendation": "Enable ECDHE key exchange (e.g., X25519, Secp256r1) for all TLS email listeners."
    },
    "RULE_STARTTLS_STRIPPED": {
        "title": "STARTTLS Downgrade / Stripping Attack Detected",
        "severity": "CRITICAL",
        "category": "STARTTLS",
        "standard_ref": "RFC 8314 Section 3.3 / RFC 8689 (MTA-STS)",
        "description": "STARTTLS capability was stripped or bypassed, exposing session payload to cleartext interception.",
        "recommendation": "Deploy MTA-STS (SMTP MTA Strict Transport Security) and enforce DANE/TLSA or Implicit TLS (ports 465, 993, 995)."
    },
    "RULE_PLAINTEXT_AUTH": {
        "title": "Cleartext Authentication Credentials Transmitted",
        "severity": "CRITICAL",
        "category": "PROTOCOL",
        "standard_ref": "RFC 8314 Section 3.1 / NIST SP 800-52 Rev 2",
        "description": "User authentication credentials (AUTH PLAIN, LOGIN, PASS) were transmitted over an unencrypted TCP connection.",
        "recommendation": "Prohibit cleartext authentication commands until TLS encryption is successfully established."
    },
    "RULE_EXPIRED_CERT": {
        "title": "Expired or Invalid X.509 Certificate",
        "severity": "HIGH",
        "category": "CERTIFICATE",
        "standard_ref": "NIST SP 800-52 Rev 2 Section 3.2 / RFC 5280",
        "description": "The server X.509 certificate has expired or is not yet valid.",
        "recommendation": "Renew and re-install a valid X.509 digital certificate from a trusted PKI CA."
    },
    "RULE_WEAK_CERT_KEY": {
        "title": "Weak Public Key Length (<2048-bit RSA / <256-bit ECC)",
        "severity": "HIGH",
        "category": "CERTIFICATE",
        "standard_ref": "NIST SP 800-57 Part 1 / NIST SP 800-52 Rev 2",
        "description": "Certificate public key length is insufficient to meet modern cryptographic security standards.",
        "recommendation": "Replace certificate keypair with RSA >= 2048 bits or ECC >= 256 bits (ECDSA P-256/P-384)."
    },
    "RULE_WEAK_CERT_SIG": {
        "title": "Obsolete Certificate Signature Algorithm (MD5 / SHA-1)",
        "severity": "HIGH",
        "category": "CERTIFICATE",
        "standard_ref": "NIST SP 800-52 Rev 2 Section 3.2.1",
        "description": "Certificate was signed using MD5 or SHA-1, which are vulnerable to collision attacks.",
        "recommendation": "Re-issue certificate using SHA-256, SHA-384, or SHA-512 signature algorithms."
    },
    "RULE_SELF_SIGNED_CERT": {
        "title": "Self-Signed Certificate in Enterprise Traffic",
        "severity": "MEDIUM",
        "category": "CERTIFICATE",
        "standard_ref": "RFC 8314 / NIST SP 800-52 Rev 2 Section 3.2",
        "description": "Server certificate is self-signed and not issued by a recognized CA or enterprise PKI authority.",
        "recommendation": "Replace self-signed certificate with one issued by a trusted internal CA or public CA."
    },
    "RULE_SAN_MISMATCH": {
        "title": "Certificate Subject Alternative Name (SAN) Mismatch",
        "severity": "MEDIUM",
        "category": "CERTIFICATE",
        "standard_ref": "RFC 6125 / RFC 8314",
        "description": "The domain name presented in HELO/SNI does not match any entry in the certificate SAN list.",
        "recommendation": "Update certificate SAN fields to include all mail domain hostnames (FQDNs)."
    }
}

def evaluate_session_rules(session_data: Dict[str, Any], cert_analysis: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    """
    Evaluates a reassembled session and returns a list of rule findings.
    """
    findings = []
    
    tls_ver = session_data.get("tls_version", "")
    cipher = session_data.get("cipher_suite", "")
    starttls_status = session_data.get("starttls_status", "")
    has_pfs = session_data.get("has_forward_secrecy", False)
    
    # 1. TLS Version Checks
    if tls_ver in ["SSLv2", "SSLv3"]:
        findings.append(RULE_DEFINITIONS["RULE_DEPRECATED_TLS_SSLV3"])
    elif tls_ver in ["TLS 1.0", "TLS 1.1"]:
        findings.append(RULE_DEFINITIONS["RULE_DEPRECATED_TLS_10_11"])
        
    # 2. Cipher Suite Checks
    weak_cipher_keywords = ["RC4", "3DES", "DES", "EXPORT", "NULL", "ADH", "AECDH"]
    if any(kw in cipher.upper() for kw in weak_cipher_keywords):
        findings.append(RULE_DEFINITIONS["RULE_WEAK_CIPHER_SUITE"])
        
    if tls_ver in ["TLS 1.0", "TLS 1.1", "TLS 1.2"] and not has_pfs and cipher != "UNKNOWN":
        findings.append(RULE_DEFINITIONS["RULE_NO_FORWARD_SECRECY"])
        
    # 3. STARTTLS / Plaintext Checks
    if starttls_status == "STRIPPED":
        findings.append(RULE_DEFINITIONS["RULE_STARTTLS_STRIPPED"])
    elif starttls_status == "PLAINTEXT_AUTH":
        findings.append(RULE_DEFINITIONS["RULE_PLAINTEXT_AUTH"])
        
    # 4. Certificate Validation Checks
    if cert_analysis and "error" not in cert_analysis:
        if cert_analysis.get("is_expired") or cert_analysis.get("is_not_yet_valid"):
            findings.append(RULE_DEFINITIONS["RULE_EXPIRED_CERT"])
        if cert_analysis.get("is_weak_key"):
            findings.append(RULE_DEFINITIONS["RULE_WEAK_CERT_KEY"])
        if cert_analysis.get("is_weak_sig"):
            findings.append(RULE_DEFINITIONS["RULE_WEAK_CERT_SIG"])
        if cert_analysis.get("is_self_signed"):
            findings.append(RULE_DEFINITIONS["RULE_SELF_SIGNED_CERT"])
        if cert_analysis.get("san_mismatch"):
            findings.append(RULE_DEFINITIONS["RULE_SAN_MISMATCH"])

    return findings
