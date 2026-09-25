'use client';

import React from 'react';
import { Shield, Activity, Lock, CheckCircle2, Award, Zap, ChevronRight, Layers } from 'lucide-react';

export const HeroConsoleVisual: React.FC = () => {
  return (
    <div className="card overflow-hidden shadow-2xl border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:border-slate-400 dark:hover:border-slate-700">
      {/* Console Header Bar */}
      <div className="px-4 py-3 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          <span className="ml-2 font-bold text-slate-700 dark:text-slate-300">
            PRAVAAH // SECURITY ANALYSIS
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>ANALYSIS COMPLETE</span>
        </div>
      </div>

      {/* Main Console Body */}
      <div className="p-5 space-y-4 font-mono text-xs">
        {/* Top Parameter Stats */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">CAPTURE FILE</span>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate block">enterprise_mail_042.pcap</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">SESSIONS</span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 truncate block">128 Sessions</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">PROTOCOLS</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">SMTP 96% | IMAP 3%</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">POSTURE</span>
            <span className="text-xs font-bold text-amber-500 truncate block">74 / 100 MODERATE</span>
          </div>
        </div>

        {/* Compact Evidence Cards */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1 overflow-hidden">
            <span className="text-slate-500 shrink-0">TLS</span>
            <span className="font-bold text-blue-600 truncate">TLS 1.3</span>
          </div>

          <div className="p-2 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1 overflow-hidden">
            <span className="text-slate-500 shrink-0">CIPHER</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 truncate">AES-256-GCM</span>
          </div>

          <div className="p-2 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1 overflow-hidden">
            <span className="text-slate-500 shrink-0">KEY EXCH</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 truncate">ECDHE</span>
          </div>

          <div className="p-2 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1 overflow-hidden">
            <span className="text-slate-500 shrink-0">PFS</span>
            <span className="font-bold text-emerald-600 truncate">ACTIVE</span>
          </div>

          <div className="p-2 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1 overflow-hidden">
            <span className="text-slate-500 shrink-0">CERT</span>
            <span className="font-bold text-emerald-600 truncate">VALID (SHA-256)</span>
          </div>

          <div className="p-2 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1 overflow-hidden">
            <span className="text-slate-500 shrink-0">STARTTLS</span>
            <span className="font-bold text-blue-600 truncate">OBSERVED</span>
          </div>

          <div className="p-2 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1 overflow-hidden">
            <span className="text-slate-500 shrink-0">ANOMALY</span>
            <span className="font-bold text-emerald-600 truncate">LOW (12/100)</span>
          </div>

          <div className="p-2 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1 overflow-hidden">
            <span className="text-slate-500 shrink-0">EXPLAINED</span>
            <span className="font-bold text-blue-600 truncate">91%</span>
          </div>
        </div>

        {/* Small Timeline Bar */}
        <div className="p-3 rounded-lg bg-slate-950 text-slate-100 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">EVIDENCE CORRELATION PATHWAY</span>
          <div className="flex items-center justify-between text-[11px] text-blue-400 font-bold pt-1">
            <span>PCAP</span>
            <span>→</span>
            <span>SMTP</span>
            <span>→</span>
            <span>STARTTLS</span>
            <span>→</span>
            <span>TLS 1.3</span>
            <span>→</span>
            <span>X.509</span>
            <span>→</span>
            <span className="text-amber-400">POSTURE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
