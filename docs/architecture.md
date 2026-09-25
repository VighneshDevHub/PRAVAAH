# SecureMailScope Technical Architecture Document

## System Architecture Diagram

```
                       [PCAP Upload / Ingestion]
                                  |
                                  v
                      [FastAPI Async REST API]
                                  |
                   [Pure-Python TCP Stream Reassembly]
                       (Scapy + dpkt Engine)
                                  |
            +---------------------+---------------------+
            |                     |                     |
   [Protocol Detector]    [STARTTLS Analyzer]    [TLS Handshake Parser]
    (Port & Banner ID)   (Downgrade/Stripping)    (JA3/JA3S & Ciphers)
            |                     |                     |
            +---------------------+---------------------+
                                  |
                      [X.509 Cert Validator]
                   (Expiration, Key Size, SIG)
                                  |
                     [Weakness Rule Engine]
                (NIST SP 800-52 / RFC Standards)
                                  |
                   [Feature Vector Extractor]
                                  |
            +---------------------+---------------------+
            |                                           |
   [XGBoost Risk Scorer]                   [Isolation Forest Anomaly Detector]
  (0-100 Posture Score)                    (Suspicious Fingerprint Detector)
            |                                           |
            +---------------------+---------------------+
                                  |
                     [Database (SQLite/PostgreSQL)]
                                  |
              +-------------------+-------------------+
              |                                       |
    [Forensic Report Generator]            [React / Next.js Dashboard]
       (JSON / HTML / PDF)                  (WebSocket Progress Stream)
```

## Pipeline Stages Detail

### 1. Packet Ingestion & Stream Reassembly (`tcp_reassembly.py`)
- Reads raw `.pcap` or `.pcapng` network packet captures.
- Identifies IP layer (`scapy.IP`) and TCP layer (`scapy.TCP`).
- Constructs canonical 5-tuples: `(src_ip, src_port, dst_ip, dst_port, protocol)`.
- Reconstructs client-to-server and server-to-client payload streams by TCP sequence numbers.

### 2. Protocol Identification (`protocol_id.py`)
- Inspects port numbers:
  - SMTP: 25, 587, 465, 2525
  - IMAP: 143, 993
  - POP3: 110, 995
- Performs payload banner inspection for custom/non-standard ports (`220 `, `* OK`, `+OK`, `EHLO`, `CAPABILITY`, `STLS`).

### 3. STARTTLS Negotiation & Downgrade Detection (`starttls_detect.py`)
- Distinguishes Implicit TLS (immediate ClientHello on ports 465, 993, 995) from Explicit STARTTLS/STLS commands.
- Flags STARTTLS stripping / downgrade attacks:
  - Server advertises STARTTLS, client sends cleartext credentials without upgrade.
  - Server rejects STARTTLS command.
  - Plaintext authentication (`AUTH PLAIN`, `AUTH LOGIN`, `PASS `) transmitted without TLS.

### 4. TLS Handshake & Fingerprint Parsing (`tls_parser.py`)
- Parses TLS Record layer (`0x16` Handshake).
- ClientHello: TLS Version, Cipher Suites list, Extensions list (SNI, Supported Groups, EC point formats).
- ServerHello: Chosen Version, Chosen Cipher Suite, Chosen Extensions.
- Computes JA3 Client Fingerprint MD5: `Version,Ciphers,Extensions,EllipticCurves,EllipticCurvePointFormats`.
- Computes JA3S Server Fingerprint MD5: `Version,Cipher,Extensions`.
- Checks Key Exchange mechanism (RSA, ECDHE, DHE) and Perfect Forward Secrecy (PFS) support.

### 5. Certificate Extraction & Validation (`cert_validator.py`)
- Parses raw DER X.509 certificates extracted from Certificate messages (`0x0b`).
- Extracts Subject, Issuer, Serial Number, Not Before, Not After dates.
- Calculates days remaining until expiration / checks expired status.
- Evaluates Public Key Algorithm (RSA, ECC, DSA) and Key Length (bits).
- Checks Digital Signature Algorithm (MD5, SHA-1, SHA-256).
- Validates Subject Alternative Names (SAN) against HELO/SNI hostname.

### 6. Cryptographic Rule Engine (`rule_engine.py`)
- Evaluates reassembled sessions against rules mapped to NIST SP 800-52 Rev 2, RFC 8314, RFC 8996, RFC 7507, and BSI TR-02102.
- Assigns severity ratings: `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `INFO`.

### 7. AI/ML Subsystem (`app/ml/`)
- **Risk Scorer**: XGBoost / Random Forest regression model trained on numerical feature vectors to compute Posture Score (0 - 100).
- **Anomaly Detector**: Isolation Forest model trained on baseline TLS feature vectors to flag anomalous TLS handshakes.
- **Recommendation Engine**: Generates prioritized remediation advice referencing specific NIST/RFC standard clauses.

### 8. Forensic Reports & Web Dashboard (`app/reports/`, `frontend/`)
- Generates JSON, styled HTML, and PDF reports.
- Real-time WebSocket job tracking (`useJobSocket.ts`) in Next.js frontend.
