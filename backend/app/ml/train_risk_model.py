import os
import joblib
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from app.core.config import settings

def train_risk_model():
    """Generates synthetic dataset and trains Random Forest Regressor risk scoring model."""
    np.random.seed(42)
    n_samples = 1000
    
    # Feature vector layout:
    # 0: tls_rank (0 to 1)
    # 1: pfs (0 or 1)
    # 2: weak_cipher (0 or 1)
    # 3: st_score (0 or 1)
    # 4: days_norm (-1 to 1)
    # 5: self_signed (0 or 1)
    # 6: weak_key (0 or 1)
    # 7: weak_sig (0 or 1)
    # 8: crit_cnt (0 to 5)
    # 9: high_cnt (0 to 5)
    # 10: med_cnt (0 to 5)
    # 11: low_cnt (0 to 5)
    
    X = []
    y = []
    
    for _ in range(n_samples):
        tls_rank = np.random.choice([0.0, 0.1, 0.4, 0.5, 0.8, 1.0])
        pfs = np.random.choice([0.0, 1.0])
        weak_cipher = np.random.choice([0.0, 1.0])
        st_score = np.random.choice([0.0, 1.0])
        days_norm = np.random.uniform(-1.0, 1.0)
        self_signed = np.random.choice([0.0, 1.0])
        weak_key = np.random.choice([0.0, 1.0])
        weak_sig = np.random.choice([0.0, 1.0])
        crit_cnt = np.random.randint(0, 4)
        high_cnt = np.random.randint(0, 4)
        med_cnt = np.random.randint(0, 4)
        low_cnt = np.random.randint(0, 4)
        
        # Calculate target score (0 to 100)
        score = 100.0
        score -= crit_cnt * 30.0 + high_cnt * 15.0 + med_cnt * 7.0 + low_cnt * 2.0
        if st_score == 0.0:
            score -= 20.0
        if weak_cipher == 1.0:
            score -= 25.0
        if tls_rank < 0.5:
            score -= 20.0
        if pfs == 0.0:
            score -= 10.0
            
        score = float(np.clip(score + np.random.normal(0, 2), 0.0, 100.0))
        
        X.append([tls_rank, pfs, weak_cipher, st_score, days_norm, self_signed, weak_key, weak_sig, crit_cnt, high_cnt, med_cnt, low_cnt])
        y.append(score)
        
    X = np.array(X)
    y = np.array(y)
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    os.makedirs(settings.MODEL_DIR, exist_ok=True)
    joblib.dump(model, settings.MODEL_DIR / "risk_model.joblib")
    print("Risk scoring model successfully trained and saved.")

if __name__ == "__main__":
    train_risk_model()
