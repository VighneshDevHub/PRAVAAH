import React from 'react';
import { Shield, ShieldAlert, CheckCircle2, Award, Activity } from 'lucide-react';

export const SecurityPostureSection: React.FC = () => {
  const metrics = [
    { label: 'TLS Configuration & Handshake', val: '92%', pct: 92, color: 'bg-blue-600', text: 'text-blue-600 dark:text-blue-400' },
    { label: 'Certificate Health & Validation', val: '100%', pct: 100, color: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Perfect Forward Secrecy (PFS)', val: '100%', pct: 100, color: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Protocol In-Band Upgrade (STARTTLS)', val: '78%', pct: 78, color: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
  ];

  return (
    <section className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
          QUANTITATIVE SECURITY SCORE
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-grotesk text-slate-900 dark:text-slate-100">
          Cryptographic Security Posture Rating
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-mono max-w-xl mx-auto">
          Deterministic scoring derived from RFC compliance checks and cryptographic parameter strength.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Posture Bar Breakdown */}
        <div className="lg:col-span-8 card p-6 space-y-5 font-mono text-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">SCORE DECOMPOSITION</span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 font-grotesk flex items-center gap-2 mt-0.5">
                <span>POSTURE SCORE: 82 / 100</span>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-mono font-bold">(GOOD)</span>
              </h3>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>PASSED RFC 8314</span>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            {metrics.map((m) => (
              <div key={m.label} className="space-y-1.5">
                <div className="flex justify-between text-slate-700 dark:text-slate-300 font-bold text-xs">
                  <span>{m.label}</span>
                  <span className={m.text}>{m.val}</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className={`h-full ${m.color} rounded-full transition-all duration-500`} style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Observations Summary Card */}
        <div className="lg:col-span-4 card p-6 space-y-4 font-mono text-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div>
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">OBSERVED FINDINGS SUMMARY</span>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100 font-grotesk">
                3 Total Observations
              </h4>
            </div>

            <div className="space-y-2 mt-4">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-red-500 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  CRITICAL SEVERITY
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100 px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800">0</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-orange-500 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  HIGH SEVERITY
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100 px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800">0</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-amber-500 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  MEDIUM SEVERITY
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100 px-2.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-600">1</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-emerald-500 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  LOW SEVERITY
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100 px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600">2</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 pt-3 border-t border-slate-200 dark:border-slate-800">
            Analytical evidence output — zero subjective or inflated score metrics.
          </p>
        </div>
      </div>
    </section>
  );
};

