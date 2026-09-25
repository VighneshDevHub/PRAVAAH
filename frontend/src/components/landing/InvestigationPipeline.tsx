'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronRight, Cpu, Layers, Terminal, Activity } from 'lucide-react';

export const InvestigationPipeline: React.FC = () => {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      num: '01',
      title: 'INGEST',
      format: 'PCAP / PCAPNG',
      desc: 'Passive packet ingest & SHA-256 hash calculation.',
      input: 'Raw Wire Bytes / PCAP File',
      output: 'Validated Packet Buffer & Hash',
      latency: '1.2 ms',
      tech: 'dpdk / pcap-parser',
    },
    {
      num: '02',
      title: 'IDENTIFY',
      format: 'SMTP / IMAP / POP3',
      desc: 'Application protocol classification & port mapping.',
      input: 'Ethernet / IP / TCP Headers',
      output: 'Classified Protocol Streams (Port 25, 465, 587, 993, 110)',
      latency: '2.4 ms',
      tech: 'Deep Packet Inspection (DPI)',
    },
    {
      num: '03',
      title: 'RECONSTRUCT',
      format: 'TCP STREAMS',
      desc: 'Bi-directional session flow reassembly.',
      input: 'Out-of-Order TCP Segments',
      output: 'Unified Bi-Directional Stream Buffer',
      latency: '4.8 ms',
      tech: 'TCP State Machine Reassembly',
    },
    {
      num: '04',
      title: 'ANALYZE',
      format: 'STARTTLS / TLS / X.509',
      desc: 'Cryptographic parameter & cert chain extraction.',
      input: 'Handshake Frames & TLS Records',
      output: 'Extracted TLS 1.3 Ciphers, PFS & Cert Chain',
      latency: '6.1 ms',
      tech: 'ASN.1 Parser & X.509 Chain Verifier',
    },
    {
      num: '05',
      title: 'CORRELATE',
      format: 'SESSION DNA & GRAPH',
      desc: 'Structured Session DNA & posture graph mapping.',
      input: 'Extracted Cryptographic Parameters',
      output: '9-Dimensional Session DNA Fingerprint Vector',
      latency: '3.5 ms',
      tech: 'Graph Neural Correlation Engine',
    },
    {
      num: '06',
      title: 'ASSESS',
      format: 'RULES + ML ANOMALY',
      desc: 'RFC rule evaluation & ML anomaly scoring.',
      input: 'Session DNA & RFC Ruleset',
      output: 'Quantified Security Score & Anomaly Distance',
      latency: '5.2 ms',
      tech: 'Isolation Forest + RFC Evaluator',
    },
    {
      num: '07',
      title: 'REPORT',
      format: 'JSON / PDF / HTML',
      desc: 'Audit-ready findings & remediation output.',
      input: 'Evaluated Findings & Posture Vector',
      output: 'JSON API Payload, Forensic PDF & Interactive HTML',
      latency: '2.9 ms',
      tech: 'Report Template Generator',
    },
  ];

  const current = stages[activeStage];

  return (
    <section id="pipeline" className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
          PIPELINE ARCHITECTURE
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-grotesk text-slate-900 dark:text-slate-100">
          One investigation. Seven analytical stages.
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-mono">
          Click or hover over any stage card below to inspect operational inputs, outputs, and latencies.
        </p>
      </div>

      {/* 7 Stage Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
        {stages.map((st, idx) => {
          const isSelected = activeStage === idx;
          return (
            <div
              key={st.num}
              onClick={() => setActiveStage(idx)}
              onMouseEnter={() => setActiveStage(idx)}
              className={`card p-4 text-center cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 shadow-md ring-2 ring-blue-500/20 -translate-y-1'
                  : 'hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                <span className={`text-[10px] font-mono font-bold block mb-1 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                  STAGE {st.num}
                </span>
                <p className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100">
                  {st.title}
                </p>
                <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-semibold block mt-1">
                  {st.format}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-mono leading-tight">
                {st.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Active Stage Inspector Box */}
      <div className="card p-5 bg-slate-900 text-white border-slate-800 font-mono text-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-bold text-blue-400 text-sm">
              STAGE #{current.num} INSPECTION // {current.title}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>ENGINE: <strong className="text-slate-200">{current.tech}</strong></span>
            <span>LATENCY: <strong className="text-emerald-400">{current.latency}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-[11px]">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">STAGE INPUT DATA STRUCTURE</span>
            <p className="font-bold text-slate-200">{current.input}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">STAGE OUTPUT FORENSIC ARTIFACT</span>
            <p className="font-bold text-emerald-400">{current.output}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

