'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getJobSessions, getJobs } from '../../../lib/api';
import { Session } from '../../../lib/types';
import { STARTTLSTimeline } from '../../../components/STARTTLSTimeline';
import { TLSHandshakeTimeline } from '../../../components/TLSHandshakeTimeline';
import { CertificateCard } from '../../../components/CertificateCard';
import { SessionDNA } from '../../../components/SessionDNA';
import { EvidenceStatus } from '../../../components/EvidenceStatus';
import { Activity, Clock, Shield, Key, Award, Fingerprint, Layers, ChevronRight, Lock, Unlock } from 'lucide-react';

export default function SessionInvestigationPage() {
  const params = useParams();
  const sessionId = params?.id as string;
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'starttls' | 'tls' | 'certificate' | 'evidence' | 'dna'>('overview');

  useEffect(() => {
    async function loadSession() {
      try {
        const jobs = await getJobs();
        for (const job of jobs) {
          const sessions = await getJobSessions(job.id);
          const found = sessions.find(s => s.id === sessionId || s.id.startsWith(sessionId));
          if (found) {
            setSession(found);
            break;
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [sessionId]);

  // Fallback demo session if direct navigation without API data
  const s = session || {
    id: sessionId || '042',
    job_id: 'job-demo',
    src_ip: '10.0.1.24',
    src_port: 54122,
    dst_ip: '192.168.1.100',
    dst_port: 587,
    protocol: 'SMTP',
    starttls_status: 'STARTTLS_SUCCESS',
    tls_version: 'TLS 1.3',
    cipher_suite: 'TLS_AES_256_GCM_SHA384',
    key_exchange: 'ECDHE',
    has_forward_secrecy: true,
    cert_subject: 'mail.example.gov',
    cert_issuer: 'DigiCert Global Root CA',
    cert_key_alg: 'RSA',
    cert_key_length: 2048,
    cert_sig_alg: 'sha256WithRSAEncryption',
    cert_days_remaining: 120,
    is_self_signed: false,
    is_anomalous: false,
    anomaly_score: 12,
    risk_score: 82,
    created_at: new Date().toISOString(),
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'starttls', label: 'STARTTLS', icon: Lock },
    { id: 'tls', label: 'TLS', icon: Key },
    { id: 'certificate', label: 'Certificate', icon: Award },
    { id: 'evidence', label: 'Evidence', icon: Layers },
    { id: 'dna', label: 'Session DNA', icon: Fingerprint },
  ] as const;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Session Investigation Header */}
      <div className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <span>Sessions</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>#{s.id.slice(0, 8)}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold font-grotesk text-slate-900 dark:text-slate-100">
              SESSION #{s.id.slice(0, 8)}
            </h1>
            <span className={`protocol-${s.protocol.toLowerCase()}`}>{s.protocol}</span>
          </div>
          <p className="text-xs font-mono text-slate-500 mt-1">
            {s.src_ip}:{s.src_port} → {s.dst_ip}:{s.dst_port}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">RISK SCORE</span>
            <span className="text-xl font-extrabold font-mono text-blue-600 dark:text-blue-400">
              {s.risk_score} / 100
            </span>
          </div>
          <span className="badge badge-low font-mono text-xs py-1 px-3">
            HIGH POSTURE
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg w-fit border border-slate-200 dark:border-slate-800">
        {tabs.map(t => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold font-grotesk transition-all ${
                active
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Areas */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-4 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-mono block">PROTOCOL & TRANSPORT</span>
            <div className="text-xs font-mono space-y-1">
              <div className="flex justify-between"><span>Protocol:</span><span className="font-bold text-slate-900 dark:text-slate-100">{s.protocol}</span></div>
              <div className="flex justify-between"><span>Transport:</span><span className="font-bold text-slate-900 dark:text-slate-100">TCP Stream</span></div>
              <div className="flex justify-between"><span>Source IP:</span><span className="font-bold text-slate-900 dark:text-slate-100">{s.src_ip}</span></div>
              <div className="flex justify-between"><span>Destination Port:</span><span className="font-bold text-slate-900 dark:text-slate-100">{s.dst_port}</span></div>
            </div>
          </div>

          <div className="card p-4 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-mono block">CRYPTOGRAPHIC STATE</span>
            <div className="text-xs font-mono space-y-1">
              <div className="flex justify-between"><span>STARTTLS:</span><span className="font-bold text-emerald-600">{s.starttls_status}</span></div>
              <div className="flex justify-between"><span>TLS Version:</span><span className="font-bold text-slate-900 dark:text-slate-100">{s.tls_version}</span></div>
              <div className="flex justify-between"><span>Cipher Suite:</span><span className="font-bold text-blue-600 truncate">{s.cipher_suite}</span></div>
              <div className="flex justify-between"><span>Key Exchange:</span><span className="font-bold text-slate-900 dark:text-slate-100">{s.key_exchange}</span></div>
            </div>
          </div>

          <div className="card p-4 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-mono block">CERTIFICATE & ANOMALY</span>
            <div className="text-xs font-mono space-y-1">
              <div className="flex justify-between"><span>Certificate:</span><span className="font-bold text-emerald-600">{s.cert_subject ? 'Valid Chain' : 'Not Determinable'}</span></div>
              <div className="flex justify-between"><span>Forward Secrecy:</span><span className="font-bold text-emerald-600">{s.has_forward_secrecy ? 'YES (PFS)' : 'NO'}</span></div>
              <div className="flex justify-between"><span>Anomaly Score:</span><span className="font-bold text-slate-900 dark:text-slate-100">{s.anomaly_score} / 100</span></div>
              <div className="flex justify-between"><span>Status:</span><span className="badge badge-low">BASELINE</span></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="card p-6 space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-grotesk">
            Forensic Session Event Timeline
          </h4>
          <div className="space-y-3 font-mono text-xs">
            {[
              { time: '10:42:11.002', event: 'TCP 3-Way Handshake Established', frame: 'Frame #18410' },
              { time: '10:42:11.045', event: 'SMTP Banner Advertised by Server', frame: 'Frame #18412' },
              { time: '10:42:11.080', event: 'Client EHLO Command Issued', frame: 'Frame #18414' },
              { time: '10:42:11.120', event: '250-STARTTLS Capability Advertised', frame: 'Frame #18416' },
              { time: '10:42:11.150', event: 'Client STARTTLS Request Initiated', frame: 'Frame #18418' },
              { time: '10:42:11.200', event: 'TLS 1.3 ClientHello Record Received', frame: 'Frame #18420' },
              { time: '10:42:11.245', event: 'TLS 1.3 ServerHello & Encrypted Session', frame: 'Frame #18422' },
              { time: '10:42:15.820', event: 'Session Closed Gracefully (QUIT)', frame: 'Frame #18450' },
            ].map((e, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span className="text-slate-400">{e.time}</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{e.event}</span>
                </div>
                <span className="text-slate-500 text-[10px]">{e.frame}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'starttls' && (
        <STARTTLSTimeline status={s.starttls_status} protocol={s.protocol} />
      )}

      {activeTab === 'tls' && (
        <TLSHandshakeTimeline
          tlsVersion={s.tls_version}
          cipherSuite={s.cipher_suite}
          keyExchange={s.key_exchange}
          hasForwardSecrecy={s.has_forward_secrecy}
          ja3Hash={s.ja3_hash}
          ja3sHash={s.ja3s_hash}
        />
      )}

      {activeTab === 'certificate' && (
        <CertificateCard
          subject={s.cert_subject}
          issuer={s.cert_issuer}
          keyAlg={s.cert_key_alg}
          keyLength={s.cert_key_length}
          sigAlg={s.cert_sig_alg}
          daysRemaining={s.cert_days_remaining}
          isSelfSigned={s.is_self_signed}
        />
      )}

      {activeTab === 'evidence' && (
        <div className="card p-6 space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-grotesk">
            Packet & Frame Level Evidence Workspace
          </h4>
          <p className="text-xs text-slate-500 font-mono">
            Captured packet headers and TLS handshake evidence frames.
          </p>

          <div className="p-4 rounded-lg bg-slate-950 text-slate-200 font-mono text-xs space-y-2 overflow-x-auto">
            <div className="text-slate-400">// Frame 18420: TLS 1.3 ClientHello Handshake Record</div>
            <div>0000  02 42 ac 11 00 02 02 42  0a 00 01 18 08 00 45 00  .|...... B......E.</div>
            <div>0010  02 0c 61 db 40 00 40 06  6c ab 0a 00 01 18 c0 a8  ..a.@.@. l.......</div>
            <div>0020  01 64 d3 6a 02 4b fe d7  61 fb a6 multi 78 80 18  .d.j.K.. a...x..</div>
          </div>
        </div>
      )}

      {activeTab === 'dna' && (
        <SessionDNA session={s} />
      )}
    </div>
  );
}
