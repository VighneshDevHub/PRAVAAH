'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert, CheckCircle2, ChevronDown, ChevronUp,
  ArrowUpDown, BookOpen, Info,
} from 'lucide-react';
import { Finding } from '../lib/types';

interface Props { findings: Finding[]; }

const SEV_ORDER: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3, INFO: 4 };

const SEV_CFG: Record<string, { color: string; bg: string; border: string; dot: string }> = {
  CRITICAL: { color: '#f87171', bg: 'rgba(248,113,113,0.09)', border: 'rgba(248,113,113,0.25)', dot: 'bg-red-400' },
  HIGH:     { color: '#fb923c', bg: 'rgba(251,146,60,0.09)',  border: 'rgba(251,146,60,0.25)',  dot: 'bg-orange-400' },
  MEDIUM:   { color: '#fbbf24', bg: 'rgba(251,191,36,0.09)', border: 'rgba(251,191,36,0.25)',  dot: 'bg-amber-400' },
  LOW:      { color: '#4ade80', bg: 'rgba(74,222,128,0.09)', border: 'rgba(74,222,128,0.25)',  dot: 'bg-green-400' },
  INFO:     { color: '#60a5fa', bg: 'rgba(96,165,250,0.09)', border: 'rgba(96,165,250,0.25)',  dot: 'bg-blue-400' },
};

const CAT_EMOJI: Record<string, string> = {
  TLS_VERSION:  '🔒',
  CIPHER_SUITE: '🔑',
  CERTIFICATE:  '📜',
  STARTTLS:     '⚡',
  PROTOCOL:     '📡',
};

function SeverityBadge({ severity }: { severity: string }) {
  const c = SEV_CFG[severity] || SEV_CFG.INFO;
  return (
    <span
      className="badge"
      style={{ color: c.color, background: c.bg, borderColor: c.border }}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1 ${c.dot}`} />
      {severity}
    </span>
  );
}

type SortKey = 'severity' | 'category' | 'title';

export const FindingsTable: React.FC<Props> = ({ findings }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('severity');
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = useMemo(() => {
    return [...findings].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'severity') cmp = (SEV_ORDER[a.severity] ?? 9) - (SEV_ORDER[b.severity] ?? 9);
      else if (sortKey === 'category') cmp = a.category.localeCompare(b.category);
      else cmp = a.title.localeCompare(b.title);
      return sortAsc ? cmp : -cmp;
    });
  }, [findings, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(v => !v);
    else { setSortKey(key); setSortAsc(true); }
  };

  /* Severity summary counts */
  const counts = findings.reduce((acc, f) => {
    acc[f.severity] = (acc[f.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (findings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-14 text-center"
        style={{ background: 'var(--card)', borderColor: 'rgba(52,211,153,0.25)' }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)' }}
        >
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <p className="text-[15px] font-bold font-grotesk text-emerald-400">No findings detected</p>
        <p className="text-[13px] mt-1" style={{ color: 'var(--text-faint)' }}>
          Cryptographic posture meets all NIST SP 800-52 requirements
        </p>
      </motion.div>
    );
  }

  return (
    <div className="card overflow-hidden" style={{ background: 'var(--card)' }}>
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)' }}
          >
            <ShieldAlert className="w-4.5 h-4.5 text-red-400" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold font-grotesk" style={{ color: 'var(--text-primary)' }}>
              Security Findings
            </h3>
            <p className="text-[11px]" style={{ color: 'var(--text-faint)' }}>
              {findings.length} vulnerabilities · NIST SP 800-52 mapped
            </p>
          </div>
        </div>

        {/* Severity chips */}
        <div className="flex flex-wrap gap-1.5">
          {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'].map(sev => {
            if (!counts[sev]) return null;
            const c = SEV_CFG[sev];
            return (
              <span
                key={sev}
                className="badge"
                style={{ color: c.color, background: c.bg, borderColor: c.border }}
              >
                {counts[sev]} {sev}
              </span>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <button
                  onClick={() => toggleSort('severity')}
                  className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                >
                  Severity <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th>
                <button
                  onClick={() => toggleSort('category')}
                  className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                >
                  Category <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th>
                <button
                  onClick={() => toggleSort('title')}
                  className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                >
                  Rule / Title <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th>Standard</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sorted.map((f, i) => {
              const c = SEV_CFG[f.severity] || SEV_CFG.INFO;
              const expanded = expandedId === f.id;
              return (
                <React.Fragment key={f.id}>
                  <motion.tr
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setExpandedId(expanded ? null : f.id)}
                    className="cursor-pointer transition-colors"
                    style={{ borderLeft: `3px solid ${c.color}` }}
                  >
                    <td>
                      <SeverityBadge severity={f.severity} />
                    </td>
                    <td>
                      <span className="flex items-center gap-1.5 text-[12px] font-semibold font-mono"
                        style={{ color: 'var(--text-secondary)' }}>
                        {CAT_EMOJI[f.category] || '🔐'}
                        {f.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className="text-[13px] font-semibold font-grotesk" style={{ color: 'var(--text-primary)' }}>
                        {f.title}
                      </span>
                    </td>
                    <td>
                      <span
                        className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-lg"
                        style={{
                          color: 'var(--primary)',
                          background: 'var(--primary-dim)',
                          border: '1px solid var(--primary-border)',
                        }}
                      >
                        {f.standard_ref}
                      </span>
                    </td>
                    <td>
                      <motion.div
                        animate={{ rotate: expanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-faint)' }} />
                      </motion.div>
                    </td>
                  </motion.tr>

                  {/* Expanded row */}
                  <AnimatePresence>
                    {expanded && (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td colSpan={5} style={{ padding: 0, borderLeft: `3px solid ${c.color}40` }}>
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div
                              className="px-5 py-4 space-y-3"
                              style={{ background: `${c.color}05` }}
                            >
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider mb-1"
                                  style={{ color: 'var(--text-faint)' }}>Description</p>
                                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                  {f.description}
                                </p>
                              </div>
                              <div
                                className="p-3 rounded-xl"
                                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                              >
                                <p className="text-[10px] font-bold uppercase tracking-wider mb-1"
                                  style={{ color: 'var(--text-faint)' }}>Recommendation</p>
                                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                                  {f.recommendation}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
