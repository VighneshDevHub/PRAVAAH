import os
import joblib
import numpy as np
from sklearn.ensemble import IsolationForest
from app.core.config import settings

def train_anomaly_model():
    """Generates synthetic baseline features and trains Isolation Forest anomaly detection model."""
    np.random.seed(42)
    n_samples = 800
    
    # Generate benign/normal TLS session feature vectors
    X = []
    for _ in range(n_samples):
        tls_rank = np.random.choice([0.8, 1.0]) # TLS 1.2 or 1.3
        pfs = 1.0 # PFS enabled
        weak_cipher = 0.0 # No weak cipher
        st_score = 1.0 # Encrypted
        days_norm = np.random.uniform(0.1, 1.0)
        self_signed = 0.0
        weak_key = 0.0
        weak_sig = 0.0
        crit_cnt = 0
        high_cnt = 0
        med_cnt = np.random.choice([0, 1])
        low_cnt = np.random.choice([0, 1, 2])
        
        X.append([tls_rank, pfs, weak_cipher, st_score, days_norm, self_signed, weak_key, weak_sig, crit_cnt, high_cnt, med_cnt, low_cnt])
        
    X = np.array(X)
    model = IsolationForest(contamination=0.05, random_state=42)
    model.fit(X)
    
    os.makedirs(settings.MODEL_DIR, exist_ok=True)
    joblib.dump(model, settings.MODEL_DIR / "anomaly_model.joblib")
    print("Anomaly detection model successfully trained and saved.")

if __name__ == "__main__":
    train_anomaly_model()
