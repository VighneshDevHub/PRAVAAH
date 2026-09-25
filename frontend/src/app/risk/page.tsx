'use client';

import React from 'react';
import { Cpu, ShieldCheck, AlertTriangle, Layers, Info } from 'lucide-react';

export default function RiskIntelligencePage() {
  const contributors = [
    { label: 'TLS Configuration & Handshake', weight: '92%', status: 'HARDENED' },
    { label: 'Certificate Behavior & Trust Chain', weight: '78%', status: 'VALID' },
    { label: 'Protocol Policy Adherence', weight: '64%', status: 'STARTTLS ACTIVE' },
    { label: 'Session Behavioral Baseline', weight: '41%', status: 'NORMAL' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl font-bold font-grotesk text-slate-900 dark:text-slate-100">
          Risk Intelligence & Anomaly Engine
        </h1>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          Deterministic RFC rules + Machine Learning isolation forest anomaly scoring.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5">
          <span className="text-[11px] font-bold text-slate-500 font-mono uppercase block">OVERALL RISK SCORE</span>
          <p className="text-2xl font-extrabold text-blue-600 font-mono mt-1">82 / 100</p>
          <span className="text-xs text-slate-500 font-mono">Good Cryptographic Posture</span>
        </div>

        <div className="card p-5">
          <span className="text-[11px] font-bold text-slate-500 font-mono uppercase block">ML ANOMALY SCORE</span>
          <p className="text-2xl font-extrabold text-purple-600 font-mono mt-1">12 / 100</p>
          <span className="text-xs text-slate-500 font-mono">Low Behavioral Anomaly</span>
        </div>

        <div className="card p-5">
          <span className="text-[11px] font-bold text-slate-500 font-mono uppercase block">EXPLAINABILITY CONFIDENCE</span>
          <p className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">91%</p>
          <span className="text-xs text-slate-500 font-mono">High Statistical Confidence</span>
        </div>
      </div>

      {/* Architecture Formula */}
      <div className="card p-4 bg-slate-900 text-white font-mono text-xs text-center border-slate-800">
        DETERMINISTIC RFC RULES + ML ANOMALY DETECTION + CORRELATION MATRIX = EXPLAINABLE RISK INTELLIGENCE
      </div>

      {/* Risk Contributors */}
      <div className="card p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-grotesk">
          Risk Feature Contributor Breakdown
        </h3>

        <div className="space-y-3 font-mono text-xs">
          {contributors.map((c) => (
            <div key={c.label} className="space-y-1">
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>{c.label}</span>
                <span className="font-bold text-blue-600">{c.weight}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: c.weight }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explainability Callout */}
      <div className="card p-5 space-y-2">
        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 font-grotesk flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600" />
          Why was this session evaluated with High Posture?
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
          Session #042 successfully completed STARTTLS in-band upgrade, negotiated TLS 1.3 with AES-256-GCM and ECDHE key exchange (PFS active). The presented server certificate matched the requested domain with a valid trust anchor and 120 days remaining. Machine learning feature correlation observed zero anomalous payload pattern deviations.
        </p>
      </div>
    </div>
  );
}
