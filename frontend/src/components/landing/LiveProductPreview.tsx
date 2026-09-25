'use client';

import React, { useState } from 'react';
import { Activity, Shield, CheckCircle2, Lock, Key, Layers, ChevronRight, Terminal, Server, FileSearch, ArrowUpRight } from 'lucide-react';

export const LiveProductPreview: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState('042');
  const [activeTab, setActiveTab] = useState('TLS ANALYSIS');

  const sessions = [
    { id: '042', protocol: 'SMTP', tls: 'TLS 1.3', cipher: 'AES_256_GCM_SHA384', risk: '82/100', status: 'LOW RISK', clientIp: '192.168.1.104', serverIp: '10.0.4.22', frames: '1,842' },
    { id: '043', protocol: 'SMTP', tls: 'TLS 1.2', cipher: 'ECDHE_RSA_AES_128', risk: '74/100', status: 'MODERATE', clientIp: '192.168.1.118', serverIp: '10.0.4.22', frames: '942' },
    { id: '044', protocol: 'IMAP', tls: 'TLS 1.3', cipher: 'CHACHA20_POLY1305', risk: '88/100', status: 'LOW RISK', clientIp: '192.168.1.205', serverIp: '10.0.4.50', frames: '3,120' },
    { id: '045', protocol: 'POP3', tls: 'SSLv3', cipher: 'RC4_128_MD5', risk: '22/100', status: 'CRITICAL', clientIp: '192.168.1.240', serverIp: '10.0.4.99', frames: '412' },
  ];

  const tabs = ['PCAP INGEST', 'SESSION RECONSTRUCTION', 'TLS ANALYSIS', 'CERTIFICATE', 'FINDINGS'];

  const current = sessions.find(s => s.id === selectedSession) || sessions[0];

  return (
    <section id="platform" className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
          INTERACTIVE PRODUCT CONSOLE DEMO
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-grotesk text-slate-900 dark:text-slate-100">
          See the investigation, not just the result.
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-sans">
          PRAVAAH preserves the complete attribution path from captured raw network packets to prioritized cryptographic posture findings.
        </p>
      </div>

      {/* Browser-like Product Window */}
      <div className="card overflow-hidden shadow-2xl border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:border-blue-500/30">
        {/* Top Console Bar */}
        <div className="px-4 py-3 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-sm" />
            <div className="ml-2 flex items-center gap-2 font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>PRAVAAH // ENTERPRISE CONSOLE v2.4</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono text-slate-600 dark:text-slate-400 pb-1 lg:pb-0">
            {tabs.map((tb) => (
              <button
                key={tb}
                onClick={() => setActiveTab(tb)}
                className={`px-3 py-1 rounded-lg font-bold transition-all text-[11px] whitespace-nowrap ${
                  activeTab === tb
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {tb}
              </button>
            ))}
          </div>
        </div>

        {/* Console Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800 font-mono text-xs">
          {/* Left Column: Session List */}
          <div className="lg:col-span-3 p-4 space-y-3 bg-slate-50/60 dark:bg-slate-950/40">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>SESSIONS ({sessions.length})</span>
              <span className="text-blue-600 dark:text-blue-400">SELECT TO INSPECT</span>
            </div>

            <div className="space-y-2">
              {sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSession(s.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    selectedSession === s.id
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      SESSION #{s.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold">
                      {s.protocol}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span>{s.tls}</span>
                    <span className={s.status.includes('CRITICAL') ? 'text-red-500 font-bold' : 'text-emerald-600 font-bold'}>
                      {s.risk}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Center Column: Session Analysis Workspace */}
          <div className="lg:col-span-6 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">INSPECTION WORKSPACE</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>SESSION #{current.id}</span>
                  <span className="text-xs text-slate-400 font-normal">({current.clientIp} → {current.serverIp})</span>
                </h4>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 text-xs font-bold text-blue-600 dark:text-blue-400">
                {current.protocol} → STARTTLS → {current.tls}
              </span>
            </div>

            {/* Dynamic Tab View content */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">TLS VERSION</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">{current.tls}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">NEGOTIATED CIPHER</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 truncate block mt-0.5">{current.cipher}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">KEY EXCHANGE ALGORITHM</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 block mt-0.5">ECDHE (Elliptic Curve)</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">FORWARD SECRECY (PFS)</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">YES (ACTIVE)</span>
              </div>
            </div>

            {/* Simulated Live Packet Sequence Stream */}
            <div className="p-3.5 rounded-xl bg-slate-950 text-slate-100 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>PROTOCOL HANDSHAKE DECODE</span>
                </span>
                <span>FRAMES: {current.frames}</span>
              </div>
              <div className="space-y-1 text-[11px] font-mono text-slate-300">
                <p><span className="text-slate-500">14:23:18.102</span> <span className="text-blue-400">C→S</span> 220 mail.enterprise.gov ESMTP PRAVAAH</p>
                <p><span className="text-slate-500">14:23:18.140</span> <span className="text-emerald-400">S→C</span> EHLO client.sec.gov</p>
                <p><span className="text-slate-500">14:23:18.188</span> <span className="text-amber-400">C→S</span> 250-STARTTLS (Observed in-band upgrade)</p>
                <p><span className="text-slate-500">14:23:18.242</span> <span className="text-purple-400">TLS</span> ClientHello (TLS 1.3, Cipher Suites: 17)</p>
              </div>
            </div>
          </div>

          {/* Right Column: Security Posture Inspector */}
          <div className="lg:col-span-3 p-4 space-y-4 bg-slate-50/60 dark:bg-slate-950/40">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">POSTURE ASSESSMENT</span>
              <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                {current.risk}
              </div>
              <span className="badge badge-low mt-1.5">{current.status}</span>
            </div>

            <div className="space-y-2.5 text-[11px]">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                <span className="text-slate-500">CERTIFICATE:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">VALID (SHA-256)</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                <span className="text-slate-500">ANOMALY SCORE:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">LOW (12/100)</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                <span className="text-slate-500">CONFIDENCE:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">92% EXPLAINED</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                <span className="text-slate-500">RFC COMPLIANCE:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">RFC 8314 PASS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

