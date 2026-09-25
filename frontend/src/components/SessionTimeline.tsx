'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ChevronDown, ChevronLeft, ChevronRight, AlertTriangle, Shield, Wifi } from 'lucide-react';
import { Session } from '../lib/types';

interface Props { sessions: Session[]; }

const TLS_COLORS: Record<string, string> = {
  'TLS 1.3': '#34d399',
  'TLS 1.2': '#4f8ef7',
  'TLS 1.1': '#fb923c',
  'TLS 1.0': '#f87171',
  'SSLv3':   '#ef4444',
  'NONE':    '#4b5680',
};
const PROTO_COLORS: Record<string, string> = {
  SMTP: '#4f8ef7',
  IMAP: '#a78bfa',
  POP3: '#14d9c5',
};
const STARTTLS_COLORS: Record<string, { color: string; label: string }> = {
  STARTTLS_OK:    { color: '#34d399', label: 'STARTTLS OK' },
  IMPLICIT_TLS:   { color: '#4f8ef7', label: 'Implicit TLS' },
  STRIPPED:       { color: '#f87171', label: '⚠ STRIPPED' },
  PLAINTEXT_AUTH: { color: '#fb923c', label: '⚠ Plaintext' },
  NONE:           { color: '#4b5680', label: 'None' },
};

const PAGE_SIZE = 8;

function TlsBadge({ version }: { version: string }) {
  const color = TLS_COLORS[version] || '#4b5680';
  return (
    <span
      className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded"
      style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}
    >
      {version || 'N/A'}
    </span>
  );
}

function ProtoBadge({ protocol }: { protocol: string }) {
  const color = PROTO_COLORS[protocol] || '#4b5680';
  return (
    <span
      className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded"
      style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}
    >
      {protocol}
    </span>
  );
}

export const SessionTimeline: React.FC<Props> = ({ sessions }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(sessions.length / PAGE_SIZE);
  const pageSessions = sessions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const anomalyCount = sessions.filter(s => s.is_anomalous).length;

  return (
    <div className="card overflow-hidden" style={{ background: 'var(--card)' }}>
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'var(--primary-dim)', border: '1px solid var(--primary-border)' }}
          >
            <Activity className="w-4.5 h-4.5" style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <h3 className="text-[14px] font-bold font-grotesk" style={{ color: 'var(--text-primary)' }}>
              Session Timeline
            </h3>
            <p className="text-[11px]" style={{ color: 'var(--text-faint)' }}>
              {sessions.length} sessions
              {anomalyCount > 0 && (
                <span className="ml-2 text-amber-400 font-semibold">
                  · {anomalyCount} anomalous
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Protocol summary */}
        <div className="flex gap-1.5">
          {['SMTP', 'IMAP', 'POP3'].map(p => {
            const cnt = sessions.filter(s => s.protocol === p).length;
            if (!cnt) return null;
            return <ProtoBadge key={p} protocol={`${p} (${cnt})`} />;
          })}
        </div>
      </div>

      {/* Session list */}
      <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
        <AnimatePresence initial={false}>
          {pageSessions.map((s, i) => {
            const expanded = expandedId === s.id;
            const anomalous = s.is_anomalous || s.starttls_status === 'STRIPPED' || s.starttls_status === 'PLAINTEXT_AUTH';
            const tlsColor = TLS_COLORS[s.tls_version] || '#4b5680';
            const stCfg = STARTTLS_COLORS[s.starttls_status] || STARTTLS_COLORS.NONE;
            const riskColor = s.risk_score >= 70 ? '#f87171' : s.risk_score >= 40 ? '#fbbf24' : '#34d399';

            return (
              <React.Fragment key={s.id}>
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setExpandedId(expanded ? null : s.id)}
                  className="flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-colors"
                  style={{
                    borderLeft: anomalous ? `3px solid #f87171` : `3px solid transparent`,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(79,142,247,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Anomaly dot */}
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      background: anomalous ? '#f87171' : tlsColor,
                      boxShadow: anomalous ? '0 0 6px rgba(248,113,113,0.6)' : 'none',
                    }}
                  />

                  {/* Protocol */}
                  <ProtoBadge protocol={s.protocol} />

                  {/* IP route */}
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span className="font-mono text-[12px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                      {s.src_ip}:{s.src_port}
                    </span>
                    <span style={{ color: 'var(--text-faint)' }}>→</span>
                    <span className="font-mono text-[12px] font-semibold truncate" style={{ color: 'var(--text-secondary)' }}>
                      {s.dst_ip}:{s.dst_port}
                    </span>
                  </div>

                  {/* TLS badge */}
                  <TlsBadge version={s.tls_version} />

                  {/* STARTTLS */}
                  <span
                    className="hidden sm:inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded font-mono"
                    style={{ color: stCfg.color, background: `${stCfg.color}12` }}
                  >
                    {stCfg.label}
                  </span>

                  {/* PFS badge */}
                  {s.has_forward_secrecy && (
                    <span className="hidden md:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ color: '#34d399', background: 'rgba(52,211,153,0.1)' }}>PFS</span>
                  )}

                  {/* Risk score */}
                  <span className="font-mono text-[12px] font-black shrink-0" style={{ color: riskColor }}>
                    {s.risk_score.toFixed(0)}
                  </span>

                  <motion.div
                    animate={{ rotate: expanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                  >
                    <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-faint)' }} />
                  </motion.div>
                </motion.div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      key={`expand-${s.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="px-5 pb-4 pt-3"
                        style={{ background: 'rgba(79,142,247,0.025)', borderTop: '1px solid var(--border-subtle)' }}
                      >
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
                          {[
                            { label: 'Cipher Suite',   value: s.cipher_suite || 'N/A', mono: true },
                            { label: 'Key Exchange',   value: s.key_exchange  || 'N/A', mono: true },
                            { label: 'JA3 Hash',       value: s.ja3_hash?.slice(0, 16) + '…' || 'N/A', mono: true },
                            { label: 'JA3S Hash',      value: s.ja3s_hash?.slice(0, 16) + '…' || 'N/A', mono: true },
                            { label: 'Cert Subject',   value: s.cert_subject   || 'N/A', mono: false },
                            { label: 'Days Remaining', value: s.cert_days_remaining !== undefined ? `${s.cert_days_remaining}d` : 'N/A', mono: true },
                            { label: 'Key Alg/Length', value: s.cert_key_alg ? `${s.cert_key_alg} ${s.cert_key_length}` : 'N/A', mono: true },
                            { label: 'Anomaly Score',  value: s.anomaly_score.toFixed(4), mono: true },
                          ].map(({ label, value, mono }) => (
                            <div key={label}
                              className="p-2.5 rounded-lg"
                              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                            >
                              <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5"
                                style={{ color: 'var(--text-faint)' }}>
                                {label}
                              </p>
                              <p
                                className={`truncate font-semibold ${mono ? 'font-mono text-[11px]' : 'text-[12px]'}`}
                                style={{ color: 'var(--text-primary)' }}
                              >
                                {value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </React.Fragment>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="text-[12px]" style={{ color: 'var(--text-faint)' }}>
            Page {page + 1} of {totalPages} · {sessions.length} sessions
          </p>
          <div className="flex gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg transition-all disabled:opacity-30"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="p-1.5 rounded-lg transition-all disabled:opacity-30"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
