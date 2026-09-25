import os
import joblib
import numpy as np
from typing import Dict, Any, Tuple
from app.core.config import settings

class RiskScorer:
    """
    Predicts session and job Cryptographic Risk Posture Scores (0 to 100).
    Uses a serialized XGBoost / Random Forest model if available,
    with a deterministic mathematical scoring formula fallback.
    """
    def __init__(self):
        self.model_path = settings.MODEL_DIR / "risk_model.joblib"
        self.model = None
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
            except Exception:
                self.model = None

    def predict_score(self, feature_vector: np.ndarray) -> Tuple[float, str]:
        """
        Returns (score, category). Score range: 0.0 (Worst) to 100.0 (Best).
        """
        if self.model is not None:
            try:
                pred = float(self.model.predict(feature_vector.reshape(1, -1))[0])
                score = max(0.0, min(100.0, pred))
            except Exception:
                score = self._fallback_score(feature_vector)
        else:
            score = self._fallback_score(feature_vector)

        if score < 50.0:
            category = "CRITICAL"
        elif score < 70.0:
            category = "HIGH"
        elif score < 85.0:
            category = "MODERATE"
        else:
            category = "LOW"
            
        return round(score, 1), category

    def _fallback_score(self, vec: np.ndarray) -> float:
        # Base score 100
        score = 100.0
        
        tls_rank, pfs, is_weak_cipher, st_score, days_norm, self_signed, weak_key, weak_sig, crit_cnt, high_cnt, med_cnt, low_cnt = vec
        
        # Deductions
        score -= crit_cnt * 35.0
        score -= high_cnt * 18.0
        score -= med_cnt * 8.0
        score -= low_cnt * 2.0
        
        if st_score == 0.0:
            score -= 25.0
        if is_weak_cipher == 1.0:
            score -= 30.0
        if tls_rank < 0.5:
            score -= 20.0
        if pfs == 0.0:
            score -= 10.0
            
        return max(0.0, min(100.0, score))

risk_scorer = RiskScorer()
