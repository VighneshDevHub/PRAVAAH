'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getJob, getJobSessions, getFindings, getRecommendations } from '../../../lib/api';
import { Job, Session, Finding, Recommendation } from '../../../lib/types';
import { useJobSocket } from '../../../hooks/useJobSocket';
import { RiskScoreCard } from '../../../components/RiskScoreCard';
import { SessionTimeline } from '../../../components/SessionTimeline';
import { FindingsTable } from '../../../components/FindingsTable';
import { ReportExportButton } from '../../../components/ReportExportButton';
import {
  Loader2, AlertCircle, ShieldAlert, CheckCircle2,
  ChevronRight, Cpu, FileCheck, Activity, BarChart3,
  Mail, Zap,
} from 'lucide-react';

const STAGES = [
  { label: 'TCP Reassembly',       color: '#4f8ef7' },
  { label: 'STARTTLS Detection',   color: '#a78bfa' },
  { label: 'TLS Handshake Parse',  color: '#14d9c5' },
  { label: 'Certificate Validation',color: '#fbbf24' },
  { label: 'Rule Engine',          color: '#f87171' },
  { label: 'ML Risk Scoring',      color: '#34d399' },
];

function getActiveStage(progress: number) {
  if (progress < 15) return 0;
  if (progress < 30) return 1;
  if (progress < 50) return 2;
  if (progress < 65) return 3;
  if (progress < 80) return 4;
  if (progress < 95) return 5;
  return 6;
}

const STATUS_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  COMPLETED:  { color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.25)' },
  PROCESSING: { color: '#4f8ef7', bg: 'rgba(79,142,247,0.1)',  border: 'rgba(79,142,247,0.25)' },
  PENDING:    { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)' },
  FAILED:     { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)' },
};

export default function JobDetailPage() {
  const params  = useParams();
  const jobId   = params?.id as string;
  const socketData = useJobSocket(jobId);

  const [job,        setJob]        = useState<Job | null>(null);
  const [sessions,   setSessions]   = useState<Session[]>([]);
  const [findings,   setFindings]   = useState<Finding[]>([]);
  const [recs,       setRecs]       = useState<Recommendation[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [activeTab,  setActiveTab]  = useState<'findings' | 'sessions' | 'recommendations'>('findings');

  useEffect(() => {
    if (!jobId) return;
    async function load() {
      try {
        const j = await getJob(jobId);
        setJob(j);
        if (j.status === 'COMPLETED') {
          const [sess, find, rec] = await Promise.all([
            getJobSessions(jobId),
            getFindings(jobId),
            getRecommendations(jobId),
          ]);
          setSessions(sess);
          setFindings(find);
          setRecs(rec);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, [jobId, socketData?.status]);

  const current: Job = socketData?.status ? { ...job, ...socketData } as Job : job as Job;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: 'var(--primary-dim)', border: '1px solid var(--primary-border)' }}
        >
          <Loader2 className="w-7 h-7 animate-spin" style={{ color: 'var(--primary)' }} />
        </div>
        <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>Loading forensic analysis…</p>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="card p-12 text-center max-w-md mx-auto">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-[15px] font-bold font-grotesk" style={{ color: 'var(--text-primary)' }}>Job Not Found</p>
        <p className="text-[13px] mt-1" style={{ color: 'var(--text-faint)' }}>The requested analysis job could not be found.</p>
      </div>
    );
  }

  const activeStage = getActiveStage(current.progress || 0);
  const ss = STATUS_STYLES[current.status] || STATUS_STYLES.PENDING;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 max-w-6xl"
    >
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="min-w-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[12px] mb-1.5" style={{ color: 'var(--text-faint)' }}>
            <span>Jobs</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>{jobId.slice(0, 8)}…</span>
          </div>
          <h1 className="text-[20px] font-bold font-grotesk tracking-tight truncate" style={{ color: 'var(--text-primary)' }}>
            {current.filename}
          </h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg border"
              style={{ color: ss.color, background: ss.bg, borderColor: ss.border }}
            >
              {current.status === 'PROCESSING' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />}
              {current.status}
            </span>
            <span className="text-[12px]" style={{ color: 'var(--text-faint)' }}>{current.total_sessions} sessions</span>
            <span className="w-1 h-1 rounded-full" style={{ background: 'var(--border-bright)' }} />
            <span className="font-mono text-[12px]" style={{ color: 'var(--text-faint)' }}>{current.id?.slice(0, 8)}</span>
          </div>
        </div>
        {current.status === 'COMPLETED' && (
          <div className="shrink-0">
            <ReportExportButton jobId={current.id} />
          </div>
        )}
      </div>

      {/* ── Processing panel ── */}
      <AnimatePresence>
        {current.status === 'PROCESSING' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="card p-6 space-y-5 relative overflow-hidden"
            style={{ borderColor: 'var(--primary-border)' }}
          >
            {/* Animated scan line */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              <motion.div
                className="absolute left-0 right-0 h-24"
                style={{ background: 'linear-gradient(180deg, transparent, rgba(79,142,247,0.04), transparent)' }}
                animate={{ top: ['-20%', '120%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            {/* Progress */}
            <div className="space-y-2 relative">
              <div className="flex justify-between items-center text-[13px]">
                <span className="font-semibold flex items-center gap-2" style={{ color: 'var(--primary)' }}>
                  <Activity className="w-4 h-4 animate-pulse" />
                  Analyzing PCAP — Pipeline Running…
                </span>
                <span className="font-black font-grotesk" style={{ color: 'var(--text-primary)' }}>
                  {Math.round(current.progress || 0)}%
                </span>
              </div>
              <div
                className="h-3 rounded-full overflow-hidden"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
              >
                {/* Background segments */}
                <div className="absolute inset-0 flex rounded-full overflow-hidden h-3">
                  {STAGES.map((s, i) => (
                    <div key={i} className="flex-1" style={{ background: `${s.color}08` }} />
                  ))}
                </div>
                <motion.div
                  className="h-full rounded-full relative"
                  style={{
                    background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                    boxShadow: '0 0 12px rgba(79,142,247,0.5)',
                  }}
                  animate={{ width: `${current.progress || 0}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Stage pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 relative">
              {STAGES.map((stage, i) => {
                const done   = i < activeStage;
                const active = i === activeStage;
                return (
                  <React.Fragment key={stage.label}>
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg shrink-0 text-[11px] font-semibold border transition-all"
                      style={{
                        color:       done ? '#34d399' : active ? stage.color : 'var(--text-faint)',
                        background:  done ? 'rgba(52,211,153,0.1)' : active ? `${stage.color}12` : 'var(--surface)',
                        borderColor: done ? 'rgba(52,211,153,0.25)' : active ? `${stage.color}35` : 'var(--border)',
                        boxShadow:   active ? `0 0 12px ${stage.color}30` : 'none',
                      }}
                    >
                      {done   && <CheckCircle2 className="w-3 h-3" />}
                      {active && <Loader2 className="w-3 h-3 animate-spin" />}
                      {!done && !active && (
                        <span className="w-3 h-3 rounded-full border border-current opacity-40" />
                      )}
                      {stage.label}
                    </div>
                    {i < STAGES.length - 1 && (
                      <ChevronRight className="w-3 h-3 shrink-0" style={{ color: 'var(--text-faint)' }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Completed content ── */}
      {current.status === 'COMPLETED' && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Risk score */}
          <RiskScoreCard
            score={current.risk_score}
            category={current.risk_category as any}
            filename={current.filename}
            totalSessions={current.total_sessions}
          />

          {/* Protocol mini-stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'SMTP', value: current.smtp_count, color: '#4f8ef7' },
              { label: 'IMAP', value: current.imap_count, color: '#a78bfa' },
              { label: 'POP3', value: current.pop3_count, color: '#14d9c5' },
            ].map(p => (
              <div
                key={p.label}
                className="card p-4 text-center"
                style={{ borderColor: `${p.color}25` }}
              >
                <div className="text-[24px] font-black font-grotesk" style={{ color: 'var(--text-primary)' }}>
                  {p.value}
                </div>
                <span
                  className="inline-block text-[11px] font-bold font-mono px-2 py-0.5 rounded mt-1"
                  style={{ color: p.color, background: `${p.color}12`, border: `1px solid ${p.color}25` }}
                >
                  {p.label}
                </span>
              </div>
            ))}
          </div>

          {/* Tab bar */}
          <div
            className="flex items-center gap-1 p-1 rounded-xl w-fit"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            {([
              { id: 'findings',        label: `Findings (${findings.length})`,  icon: ShieldAlert },
              { id: 'sessions',        label: `Sessions (${sessions.length})`,  icon: Activity },
              { id: 'recommendations', label: `Remediations (${recs.length})`,  icon: FileCheck },
            ] as const).map(tab => {
              const Icon   = tab.icon;
              const active = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold font-grotesk transition-all"
                  style={{
                    color:       active ? 'var(--primary)' : 'var(--text-secondary)',
                    background:  active ? 'var(--primary-dim)' : 'transparent',
                    border:      active ? '1px solid var(--primary-border)' : '1px solid transparent',
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'findings' && <FindingsTable findings={findings} />}
              {activeTab === 'sessions' && <SessionTimeline sessions={sessions} />}
              {activeTab === 'recommendations' && (
                <div className="space-y-3">
                  {recs.length === 0 ? (
                    <div className="card p-12 text-center" style={{ borderColor: 'rgba(52,211,153,0.25)' }}>
                      <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                      <p className="text-[14px] font-semibold text-emerald-400 font-grotesk">No remediation actions required</p>
                    </div>
                  ) : recs.map((rec, i) => {
                    const sev = rec.severity;
                    const sevColor = sev === 'CRITICAL' ? '#f87171' : sev === 'HIGH' ? '#fb923c' : '#fbbf24';
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                        className="card p-5"
                        style={{ borderLeft: `3px solid ${sevColor}60` }}
                      >
                        <div className="flex items-start justify-between gap-4 mb-2.5 flex-wrap">
                          <span
                            className="text-[11px] font-bold px-2.5 py-1 rounded-lg border font-grotesk"
                            style={{ color: sevColor, background: `${sevColor}12`, borderColor: `${sevColor}30` }}
                          >
                            #{rec.priority}
                          </span>
                          <span
                            className="font-mono text-[11px] px-2 py-0.5 rounded-lg"
                            style={{ color: 'var(--primary)', background: 'var(--primary-dim)', border: '1px solid var(--primary-border)' }}
                          >
                            {rec.standard_ref}
                          </span>
                        </div>
                        <h4 className="text-[14px] font-bold font-grotesk mb-1.5" style={{ color: 'var(--text-primary)' }}>
                          {rec.title}
                        </h4>
                        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {rec.recommendation}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── Failed state ── */}
      {current.status === 'FAILED' && (
        <div className="card p-8 text-center" style={{ borderColor: 'rgba(248,113,113,0.25)' }}>
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-[15px] font-bold font-grotesk text-red-400 mb-1">Analysis Failed</p>
          <p className="text-[13px] font-mono" style={{ color: 'var(--text-secondary)' }}>
            {current.error_message || 'Unknown pipeline error'}
          </p>
        </div>
      )}
    </motion.div>
  );
}
