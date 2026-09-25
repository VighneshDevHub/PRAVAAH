import React from 'react';
import { UploadCloud, Activity, Lock, Key, Award, Cpu, Layers, FileText } from 'lucide-react';

export const CapabilityStrip: React.FC = () => {
  const capabilities = [
    { label: 'PASSIVE PCAP ANALYSIS', icon: UploadCloud },
    { label: 'SMTP / IMAP / POP3', icon: Activity },
    { label: 'STARTTLS INSPECTION', icon: Lock },
    { label: 'TLS FORENSICS', icon: Key },
    { label: 'X.509 ANALYSIS', icon: Award },
    { label: 'AI-ASSISTED RISK', icon: Cpu },
    { label: 'EVIDENCE CORRELATION', icon: Layers },
    { label: 'JSON / PDF / HTML', icon: FileText },
  ];

  return (
    <section id="capabilities" className="border-y border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 py-4">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-slate-600 dark:text-slate-400">
          {capabilities.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.label} className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="font-bold tracking-tight text-[11px]">{c.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
