import React from 'react';
import { Key, ShieldCheck, Info, Lock, Award, Cpu, CheckCircle2 } from 'lucide-react';

export const CryptoIntelligence: React.FC = () => {
  const cryptoParams = [
    { label: 'TLS PROTOCOL VERSION', value: 'TLS 1.3', status: 'SECURE', icon: Lock },
    { label: 'NEGOTIATED CIPHER SUITE', value: 'TLS_AES_256_GCM_SHA384', status: 'HARDENED', icon: ShieldCheck },
    { label: 'KEY EXCHANGE ALGORITHM', value: 'ECDHE (Elliptic Curve)', status: 'ACTIVE', icon: Key },
    { label: 'PERFECT FORWARD SECRECY', value: 'YES (PFS Enabled)', status: 'ACTIVE', icon: Cpu },
    { label: 'X.509 CERTIFICATE STATUS', value: 'VALID TRUST CHAIN', status: 'VALID', icon: Award },
    { label: 'DIGITAL SIGNATURE SPEC', value: 'ECDSA / SHA-256', status: 'STRONG', icon: CheckCircle2 },
  ];

  return (
    <section id="crypto" className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
          CRYPTOGRAPHIC PARAMETER EXTRACTION
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-grotesk text-slate-900 dark:text-slate-100">
          See what the encrypted channel reveals.
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-mono max-w-xl mx-auto">
          Extract observable TLS handshake parameters without decrypting body payloads.
        </p>
      </div>

      <div className="card p-6 space-y-6 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-mono text-xs">
          {cryptoParams.map((cp) => {
            const Icon = cp.icon;
            return (
              <div key={cp.label} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-blue-500/40 transition-all group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold block">{cp.label}</span>
                  <Icon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{cp.value}</p>
                <span className="badge badge-low text-[9px] font-mono mt-1 inline-block">{cp.status}</span>
              </div>
            );
          })}
        </div>

        {/* Evidence Confidence Indicator */}
        <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
              92%
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100 block">OBSERVABILITY CONFIDENCE SCORE</span>
              <span className="text-[11px] text-slate-500">High statistical confidence over observed frame headers</span>
            </div>
          </div>

          <span className="badge badge-low text-xs px-3 py-1">HIGH CONFIDENCE</span>
        </div>

        {/* Technical Credibility Note */}
        <div className="flex items-start gap-2.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Technical Note:</strong> Evidence visibility depends on the captured handshake and protocol conditions (e.g. passive TLS 1.3 encrypted Extensions). When parameter evidence is unobservable, PRAVAAH displays a formal <em>NOT DETERMINABLE</em> status.
          </p>
        </div>
      </div>
    </section>
  );
};

