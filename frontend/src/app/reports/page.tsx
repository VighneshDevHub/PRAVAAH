'use client';

import React, { useEffect, useState } from 'react';
import { getJobs } from '../../lib/api';
import { Job } from '../../lib/types';
import { FileText, Download, FileCode, CheckCircle2, Eye, Shield } from 'lucide-react';

export default function ReportsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const j = await getJobs();
        setJobs(j.filter(x => x.status === 'COMPLETED'));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDownload = (jobId: string, format: 'json' | 'html' | 'pdf') => {
    window.open(`/api/v1/findings/reports/${jobId}/download?format=${format}`, '_blank');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl font-bold font-grotesk text-slate-900 dark:text-slate-100">
          Forensic Report Export Hub
        </h1>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          Generate audit-ready cryptographic security reports mapped to NTRO & RFC standards.
        </p>
      </div>

      <div className="card p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-grotesk">
          Report Structure & Included Audit Sections
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-xs">
          {['1. Executive Summary', '2. PCAP Traffic Profile', '3. Protocol Distribution', '4. Session Reassembly', '5. TLS 1.3 Analysis', '6. Certificate Trust Chain', '7. Risk Intelligence', '8. RFC Recommendations'].map((sec) => (
            <div key={sec} className="p-2.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              {sec}
            </div>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 font-grotesk">
            Generated Forensic Reports
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs font-mono text-slate-500">Loading reports...</div>
        ) : jobs.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-slate-500">No completed jobs available for report export. Upload a PCAP first.</div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {jobs.map((j) => (
              <div key={j.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100">
                      PRAVAAH_REPORT_{j.filename}.pdf
                    </h4>
                  </div>
                  <p className="text-[11px] font-mono text-slate-500 mt-1">
                    Job ID: {j.id.slice(0, 8)} • Sessions: {j.total_sessions} • Posture Score: {j.risk_score}/100 ({j.risk_category})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(j.id, 'json')}
                    className="btn-ghost text-xs px-3 py-1.5 font-mono gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> JSON
                  </button>
                  <button
                    onClick={() => handleDownload(j.id, 'html')}
                    className="btn-ghost text-xs px-3 py-1.5 font-mono gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> HTML
                  </button>
                  <button
                    onClick={() => handleDownload(j.id, 'pdf')}
                    className="btn-primary text-xs px-3 py-1.5 font-mono gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
