import React from 'react';
import { Layers, ArrowRight, FileCode, CheckCircle2, ShieldCheck, Database, Link2 } from 'lucide-react';

export const EvidenceChainSection: React.FC = () => {
  return (
    <section className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
          FORENSIC CHAIN OF CUSTODY
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-grotesk text-slate-900 dark:text-slate-100">
          Every finding should lead back to evidence.
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-mono max-w-xl mx-auto">
          PRAVAAH preserves the complete attribution path from security finding to raw packet frame.
        </p>
      </div>

      <div className="card p-6 space-y-6 font-mono text-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
        {/* Evidence Chain Flow Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 p-4 rounded-2xl bg-slate-950 text-slate-100 shadow-md">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-bold">
            <Link2 className="w-3.5 h-3.5" />
            <span>FINDING #F-0042</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-600 hidden md:block" />
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">SESSION #042</span>
          <ArrowRight className="w-4 h-4 text-slate-600 hidden md:block" />
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">TLS HANDSHAKE</span>
          <ArrowRight className="w-4 h-4 text-slate-600 hidden md:block" />
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">X.509 CERT</span>
          <ArrowRight className="w-4 h-4 text-slate-600 hidden md:block" />
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 font-bold">FRAME 1842</span>
          <ArrowRight className="w-4 h-4 text-slate-600 hidden md:block" />
          <span className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold">14:23:18.482</span>
        </div>

        {/* Technical Evidence Panel Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-slate-700 dark:text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 hover:border-blue-500/40 transition-all">
            <span className="text-[10px] text-slate-400 block font-bold">FINDING ID</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">F-0042</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 hover:border-blue-500/40 transition-all">
            <span className="text-[10px] text-slate-400 block font-bold">OBSERVED IN</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">SESSION #042</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 hover:border-blue-500/40 transition-all">
            <span className="text-[10px] text-slate-400 block font-bold">PROTOCOL</span>
            <span className="font-bold text-blue-600 dark:text-blue-400 text-xs">SMTP</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 hover:border-blue-500/40 transition-all">
            <span className="text-[10px] text-slate-400 block font-bold">RAW EVIDENCE</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">FRAME 1842</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 hover:border-blue-500/40 transition-all">
            <span className="text-[10px] text-slate-400 block font-bold">TIMESTAMP</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">14:23:18.482</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 hover:border-blue-500/40 transition-all">
            <span className="text-[10px] text-slate-400 block font-bold">MAPPED RULE</span>
            <span className="font-bold text-purple-600 dark:text-purple-400 text-xs">TLS-LEGACY-001</span>
          </div>
        </div>
      </div>
    </section>
  );
};

