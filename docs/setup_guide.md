# SecureMailScope Setup & Installation Guide

## Prerequisites
- Python 3.11 or 3.12
- Node.js v18+ and npm 10+
- (Optional) Docker & Docker Compose

---

## Native Host Environment Setup (Windows / Linux / macOS)

### 1. Backend Setup
```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Linux/macOS:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Train ML models & generate synthetic PCAPs
python -m app.ml.train_risk_model
python -m app.ml.train_anomaly_model
python -m scripts.generate_synthetic_pcaps

# Run unit & integration tests
python -m pytest tests -v

# Start FastAPI backend server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend Setup
```bash
# Navigate to frontend folder in a new terminal
cd frontend

# Install node dependencies
npm install

# Start Next.js development server
npm run dev
```

Open browser at `http://localhost:3000` to access the SecureMailScope Dashboard.

---

## Docker Compose Setup

```bash
# Build and launch all services (FastAPI, Redis, Next.js dashboard)
docker-compose up --build -d
```
- Frontend Dashboard: `http://localhost:3000`
- Backend API Docs: `http://localhost:8000/docs`
