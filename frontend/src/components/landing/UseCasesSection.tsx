import React from 'react';
import { Shield, Search, Zap, Building2, CheckCircle2 } from 'lucide-react';

export const UseCasesSection: React.FC = () => {
  const useCases = [
    {
      role: 'SOC ANALYST',
      desc: 'Investigate suspicious encrypted email traffic and prioritize security findings across protocol streams.',
      icon: Shield,
      tag: 'Triage View',
    },
    {
      role: 'DIGITAL FORENSICS',
      desc: 'Reconstruct application-layer communication sessions and TLS parameters from captured PCAP evidence.',
      icon: Search,
      tag: 'Evidence Audit',
    },
    {
      role: 'INCIDENT RESPONSE',
      desc: 'Identify unusual TLS behavior, plaintext fallback attempts, and cryptographic policy deviations.',
      icon: Zap,
      tag: 'Rapid Response',
    },
    {
      role: 'GOVERNMENT / ENTERPRISE',
      desc: 'Assess email cryptographic posture and verify RFC compliance across organizational network captures.',
      icon: Building2,
      tag: 'Compliance Assurance',
    },
  ];

  return (
    <section className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
          INVESTIGATION WORKFLOW TARGETS
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-grotesk text-slate-900 dark:text-slate-100">
          Built for security investigations.
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-mono max-w-xl mx-auto">
          Tailored user workflows for SOC operators, forensic investigators, and security auditors.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {useCases.map((uc) => {
          const Icon = uc.icon;
          return (
            <div key={uc.role} className="card p-5 space-y-3 hover:border-blue-500/40 hover:-translate-y-1 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100 tracking-wide">
                    {uc.role}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans mt-1.5">
                    {uc.desc}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>{uc.tag}</span>
                </div>
                <span className="text-slate-400 text-[9px]">ENTERPRISE</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

