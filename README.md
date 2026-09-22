# SecureMailScope (CryptoScope)
### AI-Assisted Cryptographic Security Posture Assessment for Secure Email Communications
**National Technical Research Organisation (NTRO) • Smart India Hackathon (SIH 2026) • Problem Statement ID 26159**

---

## Executive Summary
**SecureMailScope** is an AI-assisted passive network forensic framework designed to analyze captured network traffic (`.pcap` / `.pcapng` files) containing SMTP, IMAP, and POP3 communications. It automatically evaluates the overall cryptographic security posture of enterprise email infrastructures, reconstructs TCP communication streams, parses TLS handshakes (ClientHello/ServerHello, cipher suites, JA3/JA3S fingerprints), validates X.509 digital certificates, identifies cryptographic weaknesses against **NIST SP 800-52 Rev 2** and **RFC standards**, and leverages Machine Learning (XGBoost & Isolation Forest) to score security risks and flag anomalous TLS sessions.

---

## Core Capabilities & Features
- **Passive Traffic Analysis**: Processes PCAP captures without active port scanning or traffic injection.
- **Protocol Identification**: Automatic detection of SMTP (ports 25, 587, 465), IMAP (ports 143, 993), POP3 (ports 110, 995), and custom ports via banner inspection (`220 `, `* OK`, `+OK`).
- **STARTTLS Downgrade & Stripping Detection**: Identifies explicit STARTTLS negotiations vs. implicit TLS, detecting plaintext credential leaks, STARTTLS stripping attacks, and missing Perfect Forward Secrecy (PFS).
- **Pure-Python Stream & TLS Parser**: Reassembles bidirectional TCP payload streams and parses binary TLS records (`0x16`), extracting TLS versions (SSLv2, SSLv3, TLS 1.0-1.3), cipher suites, extensions, and computing JA3/JA3S MD5 fingerprints.
- **X.509 Certificate Audit Engine**: Extracts DER/PEM certificates and validates expiration, public key length (RSA < 2048, ECC < 256), signature algorithms (MD5, SHA-1), self-signed certificates, and SAN/HELO hostname mismatches.
- **AI/ML Security Posture Subsystem**:
  - **Risk Scorer**: XGBoost / Random Forest regressor predicting a 0-100 Cryptographic Posture Score.
  - **Anomaly Detector**: Isolation Forest model detecting anomalous TLS handshakes and baseline drift.
  - **Remediation Roadmap**: Maps vulnerabilities directly to NIST SP 800-52 Rev 2, RFC 8314, and RFC 8996 clauses.
- **Exportable Audit Reports**: Instant generation and download of forensic reports in **JSON**, **HTML**, and **PDF** formats.
- **Interactive SOC Dashboard & Landing Page**: Built with Next.js 14, React, TypeScript, Tailwind CSS, Recharts, and WebSockets for real-time progress streaming.

---

## Quick Start (Native Host Environment)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1   # On Windows PowerShell
# source venv/bin/activate    # On Linux/macOS

pip install -r requirements.txt
python -m app.ml.train_risk_model
python -m app.ml.train_anomaly_model
python -m scripts.generate_synthetic_pcaps
python -m pytest tests -v
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open your browser at `http://localhost:3000` to access the application.

---

## Project Structure
```
SecureMailScope/
├── backend/
│   ├── app/
│   │   ├── api/                     # REST & WebSocket API Endpoints
│   │   ├── core/                    # Application Configuration & Security
│   │   ├── db/                      # SQLAlchemy Engine & Database Sessions
│   │   ├── models/                  # Job, Session, Finding & User Models
│   │   ├── schemas/                 # Pydantic Input/Output Schemas
│   │   ├── pipeline/                # Cryptographic Analysis & Packet Engine
│   │   ├── ml/                      # XGBoost Risk Scorer & Isolation Forest
│   │   ├── reports/                 # JSON, HTML & PDF Report Builders
│   │   └── main.py                  # FastAPI Entrypoint
│   ├── scripts/
│   │   └── generate_synthetic_pcaps.py # Synthetic PCAP Test Set Generator
│   ├── tests/                       # Unit & End-to-End Integration Tests
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/                     # Next.js App Router Pages (Landing, Dashboard, Upload, Job, Findings, Reports)
│   │   ├── components/              # UI Components (Score Card, Timeline, Tables, Charts)
│   │   ├── hooks/                   # WebSocket & API Hooks
│   │   └── lib/                     # API Client & TypeScript Interfaces
│   └── package.json
├── docs/                            # Architecture, API Reference, Standards Mapping & Model Card
├── docker-compose.yml
└── README.md
```

---

## Standards Compliance
- **NIST SP 800-52 Rev 2**: Guidelines for the Selection, Configuration, and Use of Transport Layer Security (TLS) Implementations.
- **RFC 8314**: Cleartext Considered Obsolete for Email Access and Submission.
- **RFC 8996**: Deprecating TLS 1.0 and TLS 1.1.
- **RFC 7507**: TLS Fallback Signaling Cipher Suite Value (SCSV).

---

## License
Developed for Smart India Hackathon (SIH 2026) under National Technical Research Organisation (NTRO) problem statement ID 26159.
