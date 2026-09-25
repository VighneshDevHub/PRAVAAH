# SecureMailScope User Guide for SOC Analysts

## Overview
SecureMailScope allows Security Operations Center (SOC) analysts, Digital Forensics teams, and network administrators to passively evaluate the cryptographic security posture of email communications from PCAP network captures.

---

## Workflow Step-by-Step

### 1. Ingest PCAP File
1. Navigate to **Ingest PCAP** (`/upload`).
2. Drag and drop a network capture file (`.pcap`, `.pcapng`, or `.cap`).
3. Click **Upload & Analyze**. Real-time processing progress is displayed on screen via WebSockets.

### 2. View Executive Security Posture Score
1. Upon analysis completion, view the overall **Cryptographic Posture Score (0-100)** and **Risk Category** (`CRITICAL`, `HIGH`, `MODERATE`, `LOW`).
2. Review protocol breakdown (SMTP, IMAP, POP3 session counts).

### 3. Inspect Prioritized Findings & Mitigation Roadmap
1. Review categorized findings table.
2. Examine standard references (NIST SP 800-52 Rev 2, RFC 8314, RFC 8996).
3. Read prioritized remediation steps provided by the recommendation engine.

### 4. Review Reconstructed TCP & TLS Sessions
1. Scroll through the **Session Timeline** to inspect reconstructed flows.
2. Verify TLS versions, negotiated cipher suites, key exchange mechanisms, and JA3/JA3S fingerprints.
3. Check for flagged **Anomalous TLS Sessions** or **STARTTLS Stripping Attacks**.

### 5. Export Audit Reports
1. Navigate to **Export Hub** (`/reports`) or click export buttons on job view.
2. Select desired format:
   - **JSON**: Machine-readable full data dump.
   - **HTML**: Styled self-contained web report.
   - **PDF**: Audit-ready PDF document for executive briefings.
