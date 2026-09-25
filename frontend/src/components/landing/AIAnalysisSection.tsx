import React from 'react';
import { Cpu, ArrowRight, ShieldCheck, Info, CheckCircle2, ChevronRight } from 'lucide-react';

export const AIAnalysisSection: React.FC = () => {
  return (
    <section className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
          EXPLAINABLE RISK MODEL
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-grotesk text-slate-900 dark:text-slate-100">
          AI-assisted analysis, grounded in cryptographic evidence.
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-mono max-w-xl mx-auto">
          Combining deterministic RFC compliance rules with statistical anomaly scoring.
        </p>
      </div>

      <div className="card p-6 space-y-6 font-mono text-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Step 1: Observed Features */}
          <div className="md:col-span-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 hover:border-blue-500/40 transition-all">
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider block">01 • OBSERVED FEATURES</span>
            <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 text-[11px]">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> TLS Version & Cipher Suite</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Key Exchange & PFS Status</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Certificate Trust Path</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Session Timing & Bytes</li>
            </ul>
          </div>

          {/* Step 2: Hybrid Engine */}
          <div className="md:col-span-4 p-5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 space-y-3 text-center shadow-sm">
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider block">02 • HYBRID ENGINE</span>
            <div className="space-y-1">
              <p className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">DETERMINISTIC RFC RULES</p>
              <span className="text-blue-500 font-bold text-xs block">+</span>
              <p className="font-extrabold text-purple-600 dark:text-purple-400 text-sm">ML ISOLATION FOREST</p>
            </div>
            <span className="badge badge-low text-[10px] inline-block mt-1">ZERO FALSE POSITIVES</span>
          </div>

          {/* Step 3: Explainable Output */}
          <div className="md:col-span-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 hover:border-amber-500/40 transition-all">
            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider block">03 • EXPLAINABLE RISK</span>
            <p className="text-[11px] font-bold text-slate-900 dark:text-slate-100 leading-snug">
              "Session behavior differs from established SMTP/TLS baseline."
            </p>
            <ul className="space-y-1 text-[10px] text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-800">
              <li>• STARTTLS transition delay (+140ms)</li>
              <li>• Cipher suite policy deviation</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

