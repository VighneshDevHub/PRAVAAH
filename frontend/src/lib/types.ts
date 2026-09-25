export interface Job {
  id: string;
  filename: string;
  file_size: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
  error_message?: string;
  total_sessions: number;
  smtp_count: number;
  imap_count: number;
  pop3_count: number;
  risk_score: number;
  risk_category: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  created_at: string;
  completed_at?: string;
}

export interface Session {
  id: string;
  job_id: string;
  src_ip: string;
  src_port: number;
  dst_ip: string;
  dst_port: number;
  protocol: string;
  starttls_status: string;
  tls_version: string;
  cipher_suite: string;
  key_exchange: string;
  has_forward_secrecy: boolean;
  ja3_hash?: string;
  ja3s_hash?: string;
  cert_subject?: string;
  cert_issuer?: string;
  cert_key_alg?: string;
  cert_key_length?: number;
  cert_sig_alg?: string;
  cert_days_remaining?: number;
  is_self_signed: boolean;
  is_anomalous: boolean;
  anomaly_score: number;
  risk_score: number;
  created_at: string;
}

export interface Finding {
  id: string;
  job_id: string;
  session_id?: string;
  rule_id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  category: string;
  description: string;
  standard_ref: string;
  recommendation: string;
  created_at: string;
}

export interface Recommendation {
  priority: string;
  title: string;
  severity: string;
  standard_ref: string;
  recommendation: string;
}
