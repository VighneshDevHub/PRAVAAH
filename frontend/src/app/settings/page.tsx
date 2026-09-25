'use client';

import React from 'react';
import { Settings, Shield, User, SlidersHorizontal, Database, FileText, Info } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold font-grotesk text-slate-900 dark:text-slate-100">
          System & Analyst Settings
        </h1>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          PRAVAAH engine parameters, risk threshold baselines, and analyst configuration.
        </p>
      </div>

      <div className="space-y-4 font-mono text-xs">
        {/* Profile */}
        <div className="card p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-grotesk flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" /> Analyst Profile
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div><span className="text-slate-400 block text-[10px]">ANALYST ID</span>admin</div>
            <div><span className="text-slate-400 block text-[10px]">ORGANIZATION</span>National Technical Research Organisation (NTRO)</div>
            <div><span className="text-slate-400 block text-[10px]">ROLE</span>NTRO Forensic Analyst (Level 3)</div>
            <div><span className="text-slate-400 block text-[10px]">AUTH DOMAIN</span>pravaah.ntro.gov.in</div>
          </div>
        </div>

        {/* Risk Thresholds */}
        <div className="card p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-grotesk flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" /> Cryptographic Risk Thresholds
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 rounded bg-slate-50 dark:bg-slate-900">
              <span>High Risk Cutoff Threshold:</span>
              <span className="font-bold text-red-500">Score &lt; 60 / 100</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-slate-50 dark:bg-slate-900">
              <span>Medium Risk Cutoff Threshold:</span>
              <span className="font-bold text-amber-500">Score &lt; 75 / 100</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-slate-50 dark:bg-slate-900">
              <span>Good Posture Threshold:</span>
              <span className="font-bold text-emerald-500">Score ≥ 75 / 100</span>
            </div>
          </div>
        </div>

        {/* System Status & Version */}
        <div className="card p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-grotesk flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" /> About PRAVAAH
          </h3>
          <div className="space-y-1.5 text-slate-600 dark:text-slate-400 text-xs">
            <p><strong>Platform:</strong> PRAVAAH (AI-Assisted Email Cryptographic Forensics & Security Posture)</p>
            <p><strong>Problem Statement:</strong> SIH 26159</p>
            <p><strong>Organization:</strong> National Technical Research Organisation (NTRO)</p>
            <p><strong>Engine Version:</strong> v1.0.0 (Passive Sniffer & ML Isolation Forest Active)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
