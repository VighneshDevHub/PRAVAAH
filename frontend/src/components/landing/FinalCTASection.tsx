import React from 'react';
import Link from 'next/link';
import { UploadCloud, ArrowRight, Activity, ChevronRight, Shield } from 'lucide-react';

export const FinalCTASection: React.FC = () => {
  return (
    <section className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="card p-8 sm:p-12 bg-slate-900 text-white border-slate-800 text-center space-y-6 relative overflow-hidden rounded-3xl shadow-2xl">
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none -z-0 flex items-center justify-center">
          <div className="w-[500px] h-[300px] bg-blue-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>PRAVAAH FORENSIC ENGINE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-grotesk text-white tracking-tight">
            Start with the evidence.
          </h2>
          <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-xl mx-auto">
            Upload a PCAP. Reconstruct the communication. Understand the cryptographic posture.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/dashboard" className="btn-primary text-xs px-6 py-3.5 rounded-xl gap-2 font-bold shadow-lg hover:shadow-blue-500/20">
            <span>Open Security Console</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/ingest" className="btn-ghost text-xs px-6 py-3.5 rounded-xl gap-2 bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 font-bold">
            <UploadCloud className="w-4 h-4 text-blue-400" />
            <span>Analyze a PCAP</span>
          </Link>
        </div>

        {/* Pipeline Breadcrumb Flow */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-3 font-mono text-xs text-slate-400 font-bold relative z-10">
          <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800">RAW PCAP</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
          <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800">STREAM RECONSTRUCTION</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
          <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800">TLS DECODE</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
          <span className="px-2.5 py-1 rounded bg-blue-950 border border-blue-900 text-blue-400">EXPLAINABLE RISK</span>
        </div>
      </div>
    </section>
  );
};

