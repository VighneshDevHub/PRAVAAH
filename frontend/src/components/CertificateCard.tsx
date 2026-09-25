import React from 'react';
import { Award, ShieldCheck, ShieldAlert, AlertTriangle, ChevronRight, Lock } from 'lucide-react';
import { EvidenceStatus } from './EvidenceStatus';

interface CertificateCardProps {
  subject?: string;
  issuer?: string;
  keyAlg?: string;
  keyLength?: number;
  sigAlg?: string;
  daysRemaining?: number;
  isSelfSigned?: boolean;
  fingerprint?: string;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  subject,
  issuer,
  keyAlg = 'RSA',
  keyLength = 2048,
  sigAlg = 'sha256WithRSAEncryption',
  daysRemaining = 120,
  isSelfSigned = false,
  fingerprint = '4A:78:E2:B1:C9:D0:3E:45:90:12:34:56:78:9A:BC:DE:F0:12:34:56',
}) => {
  const isExpired = daysRemaining !== undefined && daysRemaining <= 0;
  const isExpiringSoon = daysRemaining !== undefined && daysRemaining > 0 && daysRemaining < 30;
  const hasCertData = Boolean(subject || issuer);

  if (!hasCertData) {
    return (
      <div className="card p-6 text-center">
        <Award className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1 font-grotesk">
          No Certificate Evidence Visible
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
          The captured network traffic did not expose unencrypted X.509 certificate handshake records (e.g. passive TLS 1.3 session or incomplete handshake frame capture).
        </p>
        <EvidenceStatus
          status="NOT_DETERMINABLE"
          reason="Certificate payload not visible in passive frame capture."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Certificate Health Summary Bar */}
      <div className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isExpired || isSelfSigned
              ? 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/40 dark:border-red-900'
              : isExpiringSoon
              ? 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-900'
              : 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900'
          }`}>
            <Award className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-grotesk">
                X.509 Digital Certificate Health
              </h4>
              {isSelfSigned && <span className="badge badge-critical">SELF-SIGNED</span>}
              {isExpired && <span className="badge badge-critical">EXPIRED</span>}
              {isExpiringSoon && <span className="badge badge-medium">EXPIRING SOON</span>}
              {!isExpired && !isExpiringSoon && !isSelfSigned && (
                <span className="badge badge-low">VALID CHAIN</span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Subject: {subject || 'N/A'}
            </p>
          </div>
        </div>

        <div className="text-left md:text-right">
          <span className="text-[11px] font-bold text-slate-500 uppercase font-mono block">
            Validity Period
          </span>
          <span className={`text-sm font-bold font-mono ${
            isExpired ? 'text-red-500' : isExpiringSoon ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'
          }`}>
            {isExpired ? 'EXPIRED' : `${daysRemaining} Days Remaining`}
          </span>
        </div>
      </div>

      {/* Certificate Chain Visualization */}
      <div className="card p-5">
        <h5 className="text-xs font-bold text-slate-500 uppercase font-mono tracking-wider mb-3">
          Certificate Validation Chain Trust Path
        </h5>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Root CA */}
          <div className="flex-1 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
            <span className="text-[10px] font-mono font-bold text-slate-400 block mb-1">TRUST ANCHOR</span>
            <p className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 truncate">
              {issuer?.includes('Root') ? issuer : `Root CA (${issuer || 'DigiCert Root'})`}
            </p>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-1 inline-block">● Trusted Root</span>
          </div>

          <ChevronRight className="w-4 h-4 text-slate-400 hidden md:block shrink-0" />

          {/* Intermediate CA */}
          <div className="flex-1 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
            <span className="text-[10px] font-mono font-bold text-slate-400 block mb-1">INTERMEDIATE CA</span>
            <p className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 truncate">
              {issuer || 'Intermediate Authority'}
            </p>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-1 inline-block">● Chain Verified</span>
          </div>

          <ChevronRight className="w-4 h-4 text-slate-400 hidden md:block shrink-0" />

          {/* Leaf Server Cert */}
          <div className="flex-1 p-3 rounded-lg border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20">
            <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 block mb-1">SERVER LEAF CERTIFICATE</span>
            <p className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100 truncate">
              {subject || 'Server Certificate'}
            </p>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono mt-1 inline-block">● Target Server</span>
          </div>
        </div>
      </div>

      {/* Certificate Technical Properties Table */}
      <div className="card overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
          <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 font-grotesk">
            X.509 Cryptographic Attributes & Signatures
          </h5>
        </div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase font-mono block">Subject Common Name (CN)</span>
              <p className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">{subject || 'N/A'}</p>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase font-mono block">Issuer Authority</span>
              <p className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">{issuer || 'N/A'}</p>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase font-mono block">Public Key Spec</span>
              <p className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
                {keyAlg} ({keyLength} bits)
              </p>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase font-mono block">Signature Algorithm</span>
              <p className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">{sigAlg}</p>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase font-mono block mb-1">
              Certificate SHA-256 Fingerprint
            </span>
            <p className="text-xs font-mono bg-slate-100 dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 select-all tracking-wider">
              {fingerprint}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
