'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getJobs, getJobSessions } from '../../lib/api';
import { Session, Job } from '../../lib/types';
import { Activity, Search, Filter, ArrowUpRight, ChevronRight, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading]   = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [protocolFilter, setProtocolFilter] = useState('ALL');

  useEffect(() => {
    async function loadSessions() {
      try {
        const jobs = await getJobs();
        const completedJobs = jobs.filter(j => j.status === 'COMPLETED');
        let allSessions: Session[] = [];
        for (const job of completedJobs) {
          const sess = await getJobSessions(job.id);
          allSessions = [...allSessions, ...sess];
        }
        setSessions(allSessions);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadSessions();
  }, []);

  const filteredSessions = sessions.filter(s => {
    const matchesSearch =
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.src_ip.includes(searchTerm) ||
      s.dst_ip.includes(searchTerm) ||
      s.protocol.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProtocol = protocolFilter === 'ALL' || s.protocol.toUpperCase() === protocolFilter;
    return matchesSearch && matchesProtocol;
  });

  const smtpCount = sessions.filter(s => s.protocol.toUpperCase() === 'SMTP').length;
  const imapCount = sessions.filter(s => s.protocol.toUpperCase() === 'IMAP').length;
  const pop3Count = sessions.filter(s => s.protocol.toUpperCase() === 'POP3').length;
  const tlsCount  = sessions.filter(s => s.tls_version && !s.tls_version.includes('NONE')).length;
  const anomalyCount = sessions.filter(s => s.is_anomalous).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-grotesk text-slate-900 dark:text-slate-100">
            Email Sessions
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Reconstructed communication sessions from captured network traffic.
          </p>
        </div>
      </div>

      {/* Top Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="card p-3 text-center font-mono">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">TOTAL SESSIONS</span>
          <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{sessions.length}</span>
        </div>
        <div className="card p-3 text-center font-mono">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">SMTP SESSIONS</span>
          <span className="text-lg font-extrabold text-blue-600">{smtpCount}</span>
        </div>
        <div className="card p-3 text-center font-mono">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">IMAP SESSIONS</span>
          <span className="text-lg font-extrabold text-purple-600">{imapCount}</span>
        </div>
        <div className="card p-3 text-center font-mono">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">POP3 SESSIONS</span>
          <span className="text-lg font-extrabold text-teal-600">{pop3Count}</span>
        </div>
        <div className="card p-3 text-center font-mono">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">TLS SESSIONS</span>
          <span className="text-lg font-extrabold text-emerald-600">{tlsCount}</span>
        </div>
        <div className="card p-3 text-center font-mono">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">ANOMALOUS</span>
          <span className="text-lg font-extrabold text-red-500">{anomalyCount}</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by session ID, IP address, protocol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-base pl-9 text-xs font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={protocolFilter}
            onChange={(e) => setProtocolFilter(e.target.value)}
            className="input-base text-xs font-mono py-1.5 w-full sm:w-auto"
          >
            <option value="ALL">All Protocols</option>
            <option value="SMTP">SMTP</option>
            <option value="IMAP">IMAP</option>
            <option value="POP3">POP3</option>
          </select>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs font-mono text-slate-500">Loading reconstructed email sessions...</div>
        ) : filteredSessions.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-slate-500">No email sessions matched your criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Session ID</th>
                  <th>Protocol</th>
                  <th>Source IP</th>
                  <th>Destination IP</th>
                  <th>Port</th>
                  <th>TLS Version</th>
                  <th>Certificate</th>
                  <th>Risk Score</th>
                  <th>Anomaly</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((s) => (
                  <tr key={s.id}>
                    <td className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                      #{s.id.slice(0, 8)}
                    </td>
                    <td>
                      <span className={`protocol-${s.protocol.toLowerCase()}`}>{s.protocol}</span>
                    </td>
                    <td className="font-mono text-xs text-slate-700 dark:text-slate-300">
                      {s.src_ip}:{s.src_port}
                    </td>
                    <td className="font-mono text-xs text-slate-700 dark:text-slate-300">
                      {s.dst_ip}
                    </td>
                    <td className="font-mono text-xs">{s.dst_port}</td>
                    <td className="font-mono text-xs font-semibold">
                      {s.tls_version || 'NONE'}
                    </td>
                    <td>
                      <span className={`badge ${s.cert_subject ? 'badge-low' : 'badge-medium'}`}>
                        {s.cert_subject ? 'Valid' : 'Not Determinable'}
                      </span>
                    </td>
                    <td className="font-mono font-bold text-xs">
                      {s.risk_score} / 100
                    </td>
                    <td>
                      {s.is_anomalous ? (
                        <span className="badge badge-critical">ANOMALY</span>
                      ) : (
                        <span className="badge badge-low">LOW</span>
                      )}
                    </td>
                    <td>
                      <Link
                        href={`/sessions/${s.id}`}
                        className="text-xs font-semibold text-blue-600 flex items-center gap-0.5"
                      >
                        Investigate <ChevronRight className="w-3.5 h-3.5" />
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
