# SecureMailScope API Reference Specification

Base URL: `http://localhost:8000/api/v1`

## Authentication

### `POST /auth/login`
Authenticates SOC analyst and returns JWT bearer token.
- **Request Body**:
  ```json
  {
    "username": "analyst",
    "password": "analyst123"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "mock_securemailscope_jwt_token_analyst",
    "token_type": "bearer",
    "user_info": {
      "username": "analyst",
      "role": "analyst",
      "email": "analyst@secmail.gov.in"
    }
  }
  ```

---

## Jobs Endpoint

### `POST /jobs/upload`
Uploads a PCAP network capture file and triggers async pipeline processing.
- **Content-Type**: `multipart/form-data`
- **Form Data**: `file` (`.pcap`, `.pcapng`, `.cap`)
- **Response**:
  ```json
  {
    "id": "c1f7b8a2-9b2c-4e89-9a1d-72e8f1b2c3d4",
    "filename": "smtp_weak_sslv3_rc4.pcap",
    "file_size": 2048,
    "status": "PENDING",
    "progress": 0.0,
    "risk_score": 100.0,
    "risk_category": "LOW",
    "created_at": "2026-09-22T12:00:00Z"
  }
  ```

### `GET /jobs`
Returns list of all ingested PCAP jobs.

### `GET /jobs/{id}`
Returns details and progress status of a specific job.

### `GET /jobs/{id}/sessions`
Returns list of all reassembled TCP/TLS communication sessions for a job.

---

## Findings & Reports Endpoint

### `GET /findings`
Query findings across jobs.
- **Query Parameters**:
  - `job_id`: Filter by job ID
  - `severity`: Filter by severity (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`)
  - `category`: Filter by category (`TLS_VERSION`, `CIPHER_SUITE`, `CERTIFICATE`, `STARTTLS`)

### `GET /findings/recommendations/{job_id}`
Returns prioritized NIST SP 800-52 / RFC remediation steps.

### `GET /findings/reports/{job_id}/download`
Downloads forensic audit report in requested format.
- **Query Parameter**: `format` (`json`, `html`, `pdf`)

---

## WebSockets Endpoint

### `WS /ws/jobs/{job_id}`
Real-time WebSocket connection emitting live job progress and status updates.
- **Message Payload**:
  ```json
  {
    "job_id": "c1f7b8a2-...",
    "status": "PROCESSING",
    "progress": 75.0,
    "risk_score": 58.5,
    "risk_category": "HIGH"
  }
  ```
