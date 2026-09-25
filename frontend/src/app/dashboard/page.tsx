'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getJobs, getFindings, getJobSessions } from '../../lib/api';
import { Job, Finding, Session } from '../../lib/types';
import { ProtocolDistribution } from '../../components/ProtocolDistribution';
import { CertHealthWidget } from '../../components/CertHealthWidget';
import {
  UploadCloud, Shield, Activity, AlertTriangle,
  Database, ShieldAlert, Loader2, RefreshCw, ChevronRight,
  Cpu
} from 'lucide-react';

export default function DashboardPage() {
  const [jobs,       setJobs]       = useState<Job[]>([]);
  const [findings,   setFindings]   = useState<Finding[]>([]);
  const [sessions,   setSessions]   = useState<Session[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true); else setRefreshing(true);
    try {
      const j = await getJobs();
      setJobs(j);
      const completed = j.filter(x => x.status === 'COMPLETED');
      if (completed.length > 0) {
        const [f, s] = await Promise.all([
          getFindings(completed[0].id),
          getJobSessions(completed[0].id),
        ]);
        setFindings(f);
        setSessions(s);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const latest       = jobs.find(j => j.status === 'COMPLETED') || jobs[0];
  const totalSess    = jobs.reduce((a, j) => a + j.total_sessions, 0);
  const totalSmtp    = jobs.reduce((a, j) => a + j.smtp_count, 0);
  const totalImap    = jobs.reduce((a, j) => a + j.imap_count, 0);
  const totalPop3    = jobs.reduce((a, j) => a + j.pop3_count, 0);
  const criticalCnt  = findings.filter(f => f.severity === 'CRITICAL').length;
  const highCnt      = findings.filter(f => f.severity === 'HIGH').length;
  const mediumCnt    = findings.filter(f => f.severity === 'MEDIUM').length;
  const lowCnt       = findings.filter(f => f.severity === 'LOW').length;

  const avgPostureScore = latest?.risk_score !== undefined ? Math.min(100, Math.max(0, Math.round(latest.risk_score))) : 82;
  const anomalyCount    = sessions.filter(s => s.is_anomalous).length;

  const KPI_CARDS = [
    { label: 'PCAPs Analyzed',    value: jobs.length,           sub: `${jobs.filter(j => j.status === 'COMPLETED').length} completed`, icon: Database },
    { label: 'Email Sessions',    value: totalSess,             sub: `${totalSmtp + totalImap + totalPop3} protocol streams`, icon: Activity },
    { label: 'Findings',          value: findings.length,       sub: `${criticalCnt} critical, ${highCnt} high`, icon: ShieldAlert },
    { label: 'High/Critical',     value: criticalCnt + highCnt, sub: 'Requires analyst attention', icon: AlertTriangle },
    { label: 'Average Posture',   value: `${avgPostureScore} / 100`, sub: avgPostureScore >= 75 ? 'GOOD SECURITY' : 'WEAK POSTURE', icon: Shield },
    { label: 'Anomalies',         value: anomalyCount,          sub: 'Flagged by ML engine', icon: Cpu },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-xs font-mono text-slate-500">Loading SOC Command Center...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-grotesk text-slate-900 dark:text-slate-100">
            SOC Command Center
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Passive email cryptographic security monitoring · PRAVAAH SIH 26159
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="btn-ghost text-xs gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link href="/ingest" className="btn-primary text-xs gap-1.5">
            <UploadCloud className="w-4 h-4" />
            + New PCAP Analysis
          </Link>
        </div>
      </div>

      {/* 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {KPI_CARDS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="card p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase font-mono">{kpi.label}</span>
                <Icon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                {kpi.value}
              </div>
              <p className="text-[10px] text-slate-500 truncate">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Row 2: Posture Breakdown & Risk Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Cryptographic Security Posture */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-grotesk">
                Cryptographic Security Posture
              </h3>
              <p className="text-xs text-slate-500 font-mono">Passive channel security rating</p>
            </div>
            <span className="badge badge-low font-mono">GOOD</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
            {/* Radial Score Display */}
            <div className="w-28 h-28 rounded-full border-4 border-blue-600/20 border-t-blue-600 flex flex-col items-center justify-center shrink-0">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-mono leading-none">
                {avgPostureScore}
              </span>
              <span className="text-[10px] font-mono text-slate-500 mt-1">/ 100</span>
            </div>

            {/* Posture Breakdown Bars */}
            <div className="flex-1 w-full space-y-2.5 text-xs font-mono">
              <div>
                <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                  <span>TLS Security</span>
                  <span className="font-bold">92%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                  <span>Certificate Health</span>
                  <span className="font-bold">84%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '84%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                  <span>Protocol Security</span>
                  <span className="font-bold">78%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '78%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                  <span>Behavioral Anomaly</span>
                  <span className="font-bold">12% Anomaly</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '12%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Risk Overview Bar Chart */}
        <div className="card p-5 space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-grotesk">
              Risk Overview & Severity Spectrum
            </h3>
            <p className="text-xs text-slate-500 font-mono">Categorized security finding count</p>
          </div>

          <div className="space-y-3 pt-2 font-mono text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-red-500 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> CRITICAL
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{criticalCnt}</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(100, criticalCnt * 20)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-orange-500 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500" /> HIGH
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{highCnt}</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.min(100, highCnt * 20)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-amber-500 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> MEDIUM
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{mediumCnt}</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, mediumCnt * 20)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-emerald-500 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> LOW / INFO
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{lowCnt}</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, lowCnt * 20)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Distribution & Certificate Health Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ProtocolDistribution smtp={totalSmtp} imap={totalImap} pop3={totalPop3} />
        <CertHealthWidget sessions={sessions} />
      </div>

      {/* Analysis Jobs Table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-grotesk">
              Recent Analysis Jobs
            </h3>
            <p className="text-xs text-slate-500 font-mono">Ingested PCAP captures</p>
          </div>
          <Link href="/ingest" className="text-xs font-semibold text-blue-600 flex items-center gap-1">
            + Ingest New <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 font-mono">
            No PCAP jobs ingested yet. Click "+ New PCAP Analysis" to upload a capture.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>File</th>
                  <th>Status</th>
                  <th>Sessions</th>
                  <th>Protocols</th>
                  <th>Posture Score</th>
                  <th>Risk</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.id}>
                    <td className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {j.filename}
                    </td>
                    <td>
                      <span className={`badge ${
                        j.status === 'COMPLETED' ? 'badge-low' : j.status === 'PROCESSING' ? 'badge-info' : 'badge-medium'
                      }`}>
                        {j.status}
                      </span>
                    </td>
                    <td className="font-mono font-bold text-xs">{j.total_sessions}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <span className="protocol-smtp">{j.smtp_count}</span>
                        <span className="protocol-imap">{j.imap_count}</span>
                        <span className="protocol-pop3">{j.pop3_count}</span>
                      </div>
                    </td>
                    <td className="font-mono font-bold text-xs">
                      {j.status === 'COMPLETED' ? `${j.risk_score} / 100` : '—'}
                    </td>
                    <td>
                      <span className={`badge ${
                        j.risk_category === 'CRITICAL' || j.risk_category === 'HIGH' ? 'badge-critical' : 'badge-low'
                      }`}>
                        {j.risk_category}
                      </span>
                    </td>
                    <td className="font-mono text-[11px] text-slate-500">
                      {new Date(j.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>
                      <Link href={`/jobs/${j.id}`} className="text-xs font-semibold text-blue-600 flex items-center gap-0.5">
                        Inspect <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
