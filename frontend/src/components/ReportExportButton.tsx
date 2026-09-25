'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileJson, FileCode, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface Props { jobId: string; compact?: boolean; }

const FORMATS = [
  {
    fmt: 'json',
    label: 'JSON',
    icon: FileJson,
    color: '#4f8ef7',
    bg: 'rgba(79,142,247,0.1)',
    border: 'rgba(79,142,247,0.25)',
    desc: 'Machine-readable',
  },
  {
    fmt: 'html',
    label: 'HTML',
    icon: FileCode,
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.1)',
    border: 'rgba(167,139,250,0.25)',
    desc: 'Browser report',
  },
  {
    fmt: 'pdf',
    label: 'PDF',
    icon: FileText,
    color: '#34d399',
    bg: 'rgba(52,211,153,0.1)',
    border: 'rgba(52,211,153,0.25)',
    desc: 'Audit-ready',
  },
] as const;

type FmtKey = 'json' | 'html' | 'pdf';

export const ReportExportButton: React.FC<Props> = ({ jobId, compact = false }) => {
  const [downloading, setDownloading] = useState<FmtKey | null>(null);
  const [success, setSuccess]         = useState<FmtKey | null>(null);
  const [error, setError]             = useState<string | null>(null);

  const download = async (fmt: FmtKey) => {
    setDownloading(fmt);
    setSuccess(null);
    setError(null);
    try {
      const urls = [
        `/api/v1/findings/reports/${jobId}/download?format=${fmt}`,
        `http://localhost:8000/api/v1/findings/reports/${jobId}/download?format=${fmt}`,
      ];
      let blob: Blob | null = null;
      for (const url of urls) {
        try {
          const res = await fetch(url);
          if (res.ok) { blob = await res.blob(); break; }
        } catch { /* try next */ }
      }
      if (!blob) throw new Error('Report generation failed');

      const href = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = href;
      a.download = `report_${jobId.slice(0, 8)}.${fmt}`;
      a.click();
      URL.revokeObjectURL(href);
      setSuccess(fmt);
      setTimeout(() => setSuccess(null), 2500);
    } catch (err: any) {
      setError(err.message || 'Download failed');
      setTimeout(() => setError(null), 3000);
    } finally {
      setDownloading(null);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        {FORMATS.map(({ fmt, label, color }) => (
          <motion.button
            key={fmt}
            onClick={() => download(fmt as FmtKey)}
            disabled={!!downloading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg border transition-all disabled:opacity-50"
            style={{ color, background: `${color}12`, borderColor: `${color}30` }}
          >
            {downloading === fmt ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : success === fmt ? (
              <CheckCircle className="w-3 h-3" />
            ) : (
              label
            )}
          </motion.button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Download className="w-3.5 h-3.5" style={{ color: 'var(--text-faint)' }} />
        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
          Export Report
        </span>
      </div>

      <div className="flex items-center gap-2">
        {FORMATS.map(({ fmt, label, icon: Icon, color, bg, border, desc }) => {
          const isLoading = downloading === fmt;
          const isSuccess = success === fmt;
          return (
            <motion.button
              key={fmt}
              onClick={() => download(fmt as FmtKey)}
              disabled={!!downloading}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-bold border transition-all disabled:opacity-60 disabled:cursor-not-allowed group"
              style={{ color, background: bg, borderColor: border }}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  </motion.span>
                ) : isSuccess ? (
                  <motion.span key="success"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                  </motion.span>
                ) : (
                  <motion.span key="icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Icon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  </motion.span>
                )}
              </AnimatePresence>
              <span>{isSuccess ? 'Saved!' : label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Error state */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-[11px] text-red-400"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
