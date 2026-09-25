import React from 'react';
import { Fingerprint, Shield, ArrowRight, Zap, CheckCircle2, AlertTriangle, Layers, Cpu } from 'lucide-react';
import { Session } from '../lib/types';

interface SessionDNAProps {
  session?: Session;
}

export const SessionDNA: React.FC<SessionDNAProps> = ({ session }) => {
  const s = session || {
    id: 'SESS-042',
    src_ip: '10.0.1.24',
    src_port: 54122,
    dst_ip: '192.168.1.100',
    dst_port: 587,
    protocol: 'SMTP',
    starttls_status: 'STARTTLS_SUCCESS',
    tls_version: 'TLS 1.3',
    cipher_suite: 'TLS_AES_256_GCM_SHA384',
    key_exchange: 'ECDHE',
    has_forward_secrecy: true,
    ja3_hash: '771,4865-4866-4867,0-23-65281-10-11,29-23-24,0',
    cert_subject: 'mail.enterprise.gov',
    cert_issuer: 'Gov Root CA',
    is_anomalous: false,
    anomaly_score: 12,
    risk_score: 82,
    created_at: new Date().toISOString(),
  };

  const dnaNodes = [
    { title: 'SESSION', val: `#${s.id.slice(0, 8)}`, sub: `${s.src_ip}:${s.src_port}` },
    { title: 'PROTOCOL', val: s.protocol, sub: `PORT ${s.dst_port}` },
    { title: 'STARTTLS', val: s.starttls_status.includes('SUCCESS') ? 'DETECTED' : 'DEVIATION', sub: 'In-Band Upgrade' },
    { title: 'TLS', val: s.tls_version, sub: s.cipher_suite.slice(0, 16) },
    { title: 'CERTIFICATE', val: s.cert_subject ? 'VALID' : 'UNOBSERVED', sub: s.cert_issuer || 'Unknown CA' },
    { title: 'BEHAVIOR', val: s.is_anomalous ? 'ANOMALOUS' : 'BASELINE', sub: `Score: ${s.anomaly_score}/100` },
    { title: 'RISK SCORE', val: `${s.risk_score} / 100`, sub: s.risk_score > 70 ? 'HIGH POSTURE' : 'WEAK POSTURE' },
  ];

  return (
    <div className="card p-6 space-y-6 bg-slate-900 text-white border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Fingerprint className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold font-mono text-white tracking-wide">
              EMAIL SESSION DNA FINGERPRINT
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Unique forensic cryptographic signature ID: {s.ja3_hash || `DNA-${s.id.slice(0, 12)}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
            PASSED VERIFICATION
          </span>
        </div>
      </div>

      {/* Central Visual Network Node Flow */}
      <div className="py-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block text-center mb-4">
          CRYPTOGRAPHIC EVIDENCE DECOMPOSITION PATHWAY
        </span>

        <div className="flex flex-col md:flex-row items-center justify-between gap-2 overflow-x-auto pb-2">
          {dnaNodes.map((node, i) => (
            <React.Fragment key={node.title}>
              <div className="flex-1 min-w-[110px] p-3 rounded-lg border border-slate-800 bg-slate-950/80 text-center hover:border-blue-500/50 transition-colors group">
                <span className="text-[9px] font-mono font-bold text-slate-400 block mb-1">
                  0{i + 1} • {node.title}
                </span>
                <p className="text-xs font-bold font-mono text-blue-400 truncate group-hover:text-blue-300">
                  {node.val}
                </p>
                <p className="text-[10px] font-mono text-slate-400 truncate mt-1">
                  {node.sub}
                </p>
              </div>

              {i < dnaNodes.length - 1 && (
                <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 hidden md:block" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* DNA Attribute Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-800 text-xs font-mono">
        <div className="p-3 bg-slate-950/60 rounded border border-slate-800">
          <span className="text-[10px] text-slate-400 block">SOURCE ADDRESS</span>
          <span className="text-slate-200 font-bold">{s.src_ip}:{s.src_port}</span>
        </div>

        <div className="p-3 bg-slate-950/60 rounded border border-slate-800">
          <span className="text-[10px] text-slate-400 block">DESTINATION TARGET</span>
          <span className="text-slate-200 font-bold">{s.dst_ip}:{s.dst_port}</span>
        </div>

        <div className="p-3 bg-slate-950/60 rounded border border-slate-800">
          <span className="text-[10px] text-slate-400 block">KEY EXCHANGE</span>
          <span className="text-slate-200 font-bold">{s.key_exchange || 'ECDHE'}</span>
        </div>

        <div className="p-3 bg-slate-950/60 rounded border border-slate-800">
          <span className="text-[10px] text-slate-400 block">FORWARD SECRECY</span>
          <span className={s.has_forward_secrecy ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
            {s.has_forward_secrecy ? 'ACTIVE (PFS)' : 'DISABLED'}
          </span>
        </div>
      </div>
    </div>
  );
};
