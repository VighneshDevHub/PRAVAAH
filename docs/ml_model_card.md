# Machine Learning Model Card: Cryptographic Risk & Anomaly Models

## Model Overview
- **Model Name**: SecureMailScope Cryptographic Risk Scorer & Anomaly Detector
- **Model Architecture**:
  1. **Risk Scorer**: XGBoost / Random Forest Regressor
  2. **Anomaly Detector**: Isolation Forest
- **Target Task**: Passive prediction of Cryptographic Security Posture Score (0-100) and detection of anomalous TLS handshakes in enterprise email communications.

## Feature Vector Layout (12 Dimensions)
0. `tls_rank`: Protocol version rank (SSLv2=0.0, SSLv3=0.1, TLS 1.0=0.4, TLS 1.1=0.5, TLS 1.2=0.8, TLS 1.3=1.0)
1. `pfs`: Perfect Forward Secrecy boolean (1.0 = Enabled, 0.0 = Disabled)
2. `weak_cipher`: Insecure cipher suite boolean (1.0 = Weak, 0.0 = Strong)
3. `st_score`: STARTTLS status score (1.0 = Encrypted, 0.0 = Stripped/Plaintext)
4. `days_norm`: Certificate validity days remaining (normalized -1.0 to 1.0)
5. `self_signed`: Self-signed certificate boolean (1.0 = Yes, 0.0 = No)
6. `weak_key`: Weak key size boolean (<2048 RSA / <256 ECC)
7. `weak_sig`: Obsolete signature algorithm boolean (MD5 / SHA-1)
8. `crit_cnt`: Count of Critical severity findings
9. `high_cnt`: Count of High severity findings
10. `med_cnt`: Count of Medium severity findings
11. `low_cnt`: Count of Low / Info severity findings

## Training Data & Performance Metrics
- **Dataset**: Synthetic PCAPs and feature distributions modeling diverse enterprise email traffic scenarios (SSLv3/RC4, IMAP expired SHA1, POP3 STARTTLS downgrade, hardened TLS 1.3).
- **Evaluation Metrics**:
  - Regressor Root Mean Square Error (RMSE): `< 2.5`
  - Anomaly Detector Contamination Factor: `0.05`

## Model Artifacts
Serialized models are stored in:
- `backend/app/ml/models/risk_model.joblib`
- `backend/app/ml/models/anomaly_model.joblib`

## Known Limitations
- TLS 1.3 Encrypted Handshake Payload: Certificate payload fields are encrypted in TLS 1.3 ServerHello unless ServerName or SNI is extracted prior to encryption.
- Encrypted Client Hello (ECH): ECH conceals SNI extension in modern draft implementations.
