import React from 'react';
import { AlertTriangle, ArrowRight, Layers, Lock, Cpu, Search, FileX, ShieldAlert } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      num: '01',
      title: 'Fragmented Evidence',
      desc: 'Packet captures contain raw network events, not investigation-ready sessions.',
      icon: FileX,
    },
    {
      num: '02',
      title: 'STARTTLS Complexity',
      desc: 'The transition from plaintext protocol communication to TLS needs contextual analysis.',
      icon: Lock,
    },
    {
      num: '03',
      title: 'Cryptographic Blind Spots',
      desc: 'Weak protocols, cipher configurations and certificate issues can be difficult to identify consistently.',
      icon: ShieldAlert,
    },
    {
      num: '04',
      title: 'Manual Investigation',
      desc: 'Thousands of packets can make forensic analysis slow and inconsistent.',
      icon: Search,
    },
  ];

  return (
    <section className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
          THE CRYPTOGRAPHIC FORENSIC CHALLENGE
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-grotesk text-slate-900 dark:text-slate-100">
          Encrypted does not always mean secure.
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-mono max-w-xl mx-auto">
          Raw packet captures leave security analysts blind to session-level cryptographic misconfigurations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column Statement */}
        <div className="lg:col-span-5 card p-8 bg-slate-900 text-white border-slate-800 space-y-6 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold font-grotesk leading-snug text-slate-100">
            Modern email traffic can hide important cryptographic weaknesses inside encrypted sessions.
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Without automated session reassembly and protocol parsing, security analysts are forced to manually inspect thousands of individual packets or rely on surface-level logs.
          </p>

          {/* Small Visual */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs flex items-center justify-between text-blue-400 font-bold">
            <span>RAW PACKETS</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            <span>BLIND SPOTS</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-amber-400">RISK</span>
          </div>
        </div>

        {/* Right Column — 4 Problems Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {problems.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.num} className="card p-5 space-y-3 hover:border-blue-500/40 hover:-translate-y-1 transition-all group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                    PROBLEM {p.num}
                  </span>
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-grotesk">
                  {p.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

