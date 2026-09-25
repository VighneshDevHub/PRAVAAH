'use client';

import React, { useState } from 'react';
import { Fingerprint, ArrowRight, ShieldCheck, Zap, Cpu, Activity } from 'lucide-react';

export const SessionDNASection: React.FC = () => {
  const [activeNode, setActiveNode] = useState(0);

  const nodes = [
    { name: 'SMTP PROTOCOL', status: 'OBSERVED', val: 'ESMTP (Port 587)', desc: 'Explicit STARTTLS transition observed in-band.' },
    { name: 'STARTTLS STATUS', status: 'SUCCESS', val: '250-STARTTLS', desc: 'Clean plaintext to TLS upgrade without downgrade.' },
    { name: 'TLS VERSION', status: 'SECURE', val: 'TLS 1.3', desc: 'Modern TLS protocol version enforcing PFS.' },
    { name: 'CIPHER SUITE', status: 'HARDENED', val: 'AES_256_GCM_SHA384', desc: 'Authenticated encryption with 256-bit key length.' },
    { name: 'KEY EXCHANGE', status: 'ACTIVE', val: 'ECDHE (secp256r1)', desc: 'Ephemeral Elliptic-Curve Diffie-Hellman key exchange.' },
    { name: 'CERT HEALTH', status: 'VALID', val: 'SHA-256 / RSA 2048', desc: 'Valid x509 chain with trusted CA root anchor.' },
    { name: 'JA3 FINGERPRINT', status: 'MATCH', val: '771,4865-4866...', desc: 'Client SSL/TLS fingerprint matched against whitelist.' },
    { name: 'PACKET TIMING', status: 'NORMAL', val: '14.2ms Handshake', desc: 'Statistical timing delta within baseline distribution.' },
    { name: 'ANOMALY SCORE', status: 'LOW', val: '12 / 100', desc: 'Isolation forest anomaly score within low-risk threshold.' },
    { name: 'MTA-STS POLICY', status: 'ENFORCED', val: 'mode: enforce', desc: 'Domain enforces strict MTA-STS transport security.' },
  ];

  const current = nodes[activeNode];

  return (
    <section className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
          SESSION FINGERPRINT DECOMPOSITION
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-grotesk text-slate-900 dark:text-slate-100">
          Every email session has a security fingerprint.
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-mono max-w-xl mx-auto">
          PRAVAAH converts protocol, cryptographic, and behavioral characteristics into a structured 10-dimensional Session DNA vector.
        </p>
      </div>

      <div className="card p-6 sm:p-8 bg-slate-900 text-white border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold font-mono">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">TARGET ANCHOR NODE</span>
              <h3 className="text-base font-bold text-blue-400 font-mono">SESSION #042 DNA DECOMPOSITION</h3>
            </div>
          </div>
          <span className="badge badge-low text-[10px] font-mono hidden sm:inline-block">10 FEATURES EXTRACTED</span>
        </div>

        {/* Connected Node Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 font-mono text-xs">
          {nodes.map((nd, i) => {
            const isSelected = activeNode === i;
            return (
              <div
                key={nd.name}
                onClick={() => setActiveNode(i)}
                onMouseEnter={() => setActiveNode(i)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-950/80 border-blue-500 text-white shadow-lg ring-2 ring-blue-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[9px] text-slate-500 mb-1">
                  <span>FEAT 0{i + 1}</span>
                  <span className={isSelected ? 'text-blue-400 font-bold' : 'text-emerald-400 font-bold'}>{nd.status}</span>
                </div>
                <span className="font-bold text-[11px] block truncate">{nd.name}</span>
                <span className="text-[10px] text-slate-400 block mt-1 truncate">{nd.val}</span>
              </div>
            );
          })}
        </div>

        {/* Active Node Detail Inspector Box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-blue-400 font-bold uppercase block">INSPECTED FEATURE: {current.name}</span>
            <p className="text-slate-200 text-xs font-bold mt-0.5">{current.val} — <span className="text-slate-400 font-normal">{current.desc}</span></p>
          </div>
          <span className="px-3 py-1 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold text-[11px] shrink-0">
            {current.status}
          </span>
        </div>

        {/* Bottom Pathway */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-center gap-3 font-mono text-xs text-slate-400">
          <span className="font-bold text-blue-400">STRUCTURED SESSION DNA</span>
          <ArrowRight className="w-4 h-4 text-slate-600" />
          <span className="font-bold text-purple-400">VECTOR MAPPING</span>
          <ArrowRight className="w-4 h-4 text-slate-600" />
          <span className="font-bold text-emerald-400">CRYPTOGRAPHIC POSTURE</span>
        </div>
      </div>
    </section>
  );
};

