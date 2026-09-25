import os
import joblib
import numpy as np
from typing import Tuple
from app.core.config import settings

class AnomalyDetector:
    """
    Isolation Forest based anomaly detector for TLS handshakes and session flows.
    """
    def __init__(self):
        self.model_path = settings.MODEL_DIR / "anomaly_model.joblib"
        self.model = None
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
            except Exception:
                self.model = None

    def predict_anomaly(self, feature_vector: np.ndarray) -> Tuple[bool, float]:
        """
        Returns (is_anomalous, anomaly_score).
        """
        if self.model is not None:
            try:
                preds = self.model.predict(feature_vector.reshape(1, -1))
                scores = self.model.decision_function(feature_vector.reshape(1, -1))
                is_anomaly = bool(preds[0] == -1)
                anomaly_score = float(-scores[0])
                return is_anomaly, round(anomaly_score, 3)
            except Exception:
                pass
                
        # Heuristic fallback if model not loaded
        crit_cnt = feature_vector[8]
        weak_cipher = feature_vector[2]
        is_anomaly = bool(crit_cnt > 0 or weak_cipher == 1.0)
        score = 0.85 if is_anomaly else 0.15
        return is_anomaly, score

anomaly_detector = AnomalyDetector()
