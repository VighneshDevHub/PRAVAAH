# NIST SP 800-52 & RFC Standards Mapping Table

This table maps SecureMailScope rule engine findings to authoritative cybersecurity standards and clauses.

| Rule ID | Finding Title | Severity | Standard Reference | NIST SP 800-52 / RFC Clause |
| :--- | :--- | :--- | :--- | :--- |
| `RULE_DEPRECATED_TLS_SSLV3` | Use of Obsolete SSLv3 Protocol | CRITICAL | NIST SP 800-52 Rev 2 Section 3.1 / RFC 7568 | Section 3.1: "SSL v2.0 and SSL v3.0 SHALL NOT be used." |
| `RULE_DEPRECATED_TLS_10_11` | Use of Deprecated TLS 1.0 / TLS 1.1 | HIGH | NIST SP 800-52 Rev 2 Section 3.1 / RFC 8996 | RFC 8996: "TLS 1.0 and TLS 1.1 are formally deprecated." |
| `RULE_WEAK_CIPHER_SUITE` | Negotiation of Insecure Cipher Suite | CRITICAL | NIST SP 800-52 Rev 2 Section 3.3.1 | Section 3.3.1: "Agencies SHALL NOT configure weak or export ciphers (RC4, 3DES, DES, NULL, ADH)." |
| `RULE_NO_FORWARD_SECRECY` | Lack of Perfect Forward Secrecy (PFS) | MEDIUM | NIST SP 800-52 Rev 2 Section 3.3.1 / RFC 8314 | Section 3.3.1: "Ephemeral Diffie-Hellman key exchanges (ECDHE or DHE) SHALL be preferred." |
| `RULE_STARTTLS_STRIPPED` | STARTTLS Downgrade / Stripping Attack | CRITICAL | RFC 8314 Section 3.3 / RFC 8689 (MTA-STS) | RFC 8314 Section 3.3: "Explicit STARTTLS MUST NOT be susceptible to cleartext fallback." |
| `RULE_PLAINTEXT_AUTH` | Cleartext Credentials Transmitted | CRITICAL | RFC 8314 Section 3.1 | RFC 8314 Section 3.1: "Cleartext authentication over unencrypted channels is prohibited." |
| `RULE_EXPIRED_CERT` | Expired or Invalid X.509 Certificate | HIGH | NIST SP 800-52 Rev 2 Section 3.2 / RFC 5280 | Section 3.2: "Certificates SHALL be valid and unexpired." |
| `RULE_WEAK_CERT_KEY` | Weak Public Key Length (<2048 RSA / <256 ECC) | HIGH | NIST SP 800-57 Part 1 / NIST SP 800-52 Rev 2 | NIST SP 800-57: "Minimum 2048-bit RSA or 256-bit ECC public keys required." |
| `RULE_WEAK_CERT_SIG` | Obsolete Certificate Signature Hash (MD5/SHA1) | HIGH | NIST SP 800-52 Rev 2 Section 3.2.1 | Section 3.2.1: "Certificates SHALL use SHA-256 or stronger digest algorithms." |
| `RULE_SELF_SIGNED_CERT` | Self-Signed Certificate in Enterprise | MEDIUM | RFC 8314 / NIST SP 800-52 Rev 2 | Section 3.2: "Certificates SHALL chain to a trusted root CA or PKI anchor." |
| `RULE_SAN_MISMATCH` | Certificate Subject Alternative Name Mismatch | MEDIUM | RFC 6125 / RFC 8314 | RFC 6125: "Server identity verification requires matching HELO/SNI against SAN." |
