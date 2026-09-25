import React from 'react';
import { FileText, Download, FileCode, CheckCircle2, Code2, Globe, FileSpreadsheet } from 'lucide-react';

export const ReportOutputsSection: React.FC = () => {
  const reports = [
    {
      format: 'JSON',
      title: 'Machine-Readable Export',
      desc: 'Structured JSON data schema designed for direct API integration, automated ingestion, and SIEM pipeline correlation.',
      bullets: ['Complete session JSON dump', 'REST API payload compatible', 'SIEM & SOAR export ready'],
      icon: Code2,
      badge: 'API READY',
    },
    {
      format: 'PDF',
      title: 'Forensic Audit Report',
      desc: 'Formally formatted executive and technical PDF report complete with evidence summaries, findings, and remediation steps.',
      bullets: ['Executive posture summary', 'RFC compliance audit tables', 'Prioritized remediation steps'],
      icon: FileText,
      badge: 'AUDIT READY',
    },
    {
      format: 'HTML',
      title: 'Interactive Investigation',
      desc: 'Self-contained HTML report with dynamic session filtering, interactive evidence navigation, and chart views.',
      bullets: ['Browser-native interactive UI', 'Session & packet evidence viewer', 'Zero external runtime dependencies'],
      icon: Globe,
      badge: 'STANDALONE',
    },
  ];

  return (
    <section id="reports" className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
          AUDIT OUTPUT FORMATS
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-grotesk text-slate-900 dark:text-slate-100">
          Investigation-ready outputs.
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-mono max-w-xl mx-auto">
          Export comprehensive cryptographic evidence in machine, document, and interactive web formats.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reports.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.format} className="card p-6 space-y-4 hover:border-blue-500/40 hover:shadow-lg transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center font-mono font-extrabold text-blue-600 text-sm shadow-sm group-hover:scale-105 transition-transform">
                      {r.format}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <span className="badge badge-low font-mono text-[10px]">{r.badge}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-grotesk">
                    {r.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed font-sans">
                    {r.desc}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 font-mono text-xs">
                {r.bullets.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

