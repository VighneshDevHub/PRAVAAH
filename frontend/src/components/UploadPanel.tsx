'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud, FileCheck, Loader2, Sparkles,
  AlertTriangle, Play, CheckCircle, X, Zap,
  ShieldAlert, AlertCircle, Lock, ShieldCheck,
} from 'lucide-react';
import { uploadPcap, triggerSamplePcap } from '../lib/api';
import { Job } from '../lib/types';

interface Props { onUploadSuccess: (job: Job) => void; }

const SAMPLES = [
  {
    id: 'weak_sslv3',
    label: 'SSLv3 + RC4',
    desc: 'SMTP STARTTLS negotiating weak SSLv3 with RC4-SHA. Triggers CRITICAL posture score.',
    color: '#f87171', border: 'rgba(248,113,113,0.3)', glow: 'rgba(248,113,113,0.12)',
    tag: 'CRITICAL', tagStyle: 'text-red-400 bg-red-500/10 border-red-500/20',
    icon: ShieldAlert,
  },
  {
    id: 'expired_imaps',
    label: 'Expired SHA-1 Cert',
    desc: 'IMAP implicit TLS on port 993 with expired SHA-1 certificate. HIGH risk classification.',
    color: '#fb923c', border: 'rgba(251,146,60,0.3)', glow: 'rgba(251,146,60,0.12)',
    tag: 'HIGH', tagStyle: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    icon: AlertCircle,
  },
  {
    id: 'starttls_downgrade',
    label: 'STARTTLS Stripping',
    desc: 'POP3 port 110 STARTTLS stripped — cleartext credential leak detected.',
    color: '#fbbf24', border: 'rgba(251,191,36,0.3)', glow: 'rgba(251,191,36,0.12)',
    tag: 'CRITICAL', tagStyle: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    icon: Lock,
  },
  {
    id: 'hardened_tls13',
    label: 'Hardened TLS 1.3',
    desc: 'SMTP port 587 upgrading via STARTTLS to TLS 1.3 with ECDHE forward secrecy.',
    color: '#34d399', border: 'rgba(52,211,153,0.3)', glow: 'rgba(52,211,153,0.12)',
    tag: 'LOW', tagStyle: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    icon: ShieldCheck,
  },
];

const PIPELINE_STEPS = ['TCP Reassembly', 'TLS Parse', 'Cert Audit', 'Rule Engine', 'ML Score'];

export const UploadPanel: React.FC<Props> = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive]     = useState(false);
  const [loading, setLoading]           = useState(false);
  const [loadingSample, setLoadingSample] = useState<string | null>(null);
  const [error, setError]               = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const processFile = useCallback(async (file: File) => {
    if (!file.name.match(/\.(pcap|pcapng|cap)$/i)) {
      setError('Please upload a valid .pcap, .pcapng, or .cap network capture file.');
      return;
    }
    setSelectedFile(file);
    setError(null);
    setLoading(true);
    try {
      const job = await uploadPcap(file);
      onUploadSuccess(job);
    } catch (err: any) {
      setError(err.message || 'Upload failed. Ensure the backend API is running.');
    } finally {
      setLoading(false);
    }
  }, [onUploadSuccess]);

  const handleFiles = (files: FileList | null) => { if (files?.[0]) processFile(files[0]); };

  const handleSample = async (sampleId: string) => {
    setError(null);
    setLoadingSample(sampleId);
    try {
      const job = await triggerSamplePcap(sampleId);
      onUploadSuccess(job);
    } catch (err: any) {
      setError(err.message || 'Failed to trigger sample scenario.');
    } finally {
      setLoadingSample(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* ── Drop zone ── */}
      <div
        className="card overflow-hidden"
        style={{ background: 'var(--card)' }}
      >
        <input
          type="file" id="pcap-upload"
          accept=".pcap,.pcapng,.cap"
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
          disabled={loading}
        />

        <label
          htmlFor="pcap-upload"
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={e => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
          className="relative flex flex-col items-center justify-center p-10 sm:p-16 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden m-1"
          style={{
            border: `2px dashed ${dragActive ? 'var(--primary)' : 'var(--border)'}`,
            background: dragActive ? 'var(--primary-dim)' : 'transparent',
          }}
        >
          {/* Animated grid when dragging */}
          <AnimatePresence>
            {dragActive && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: 'linear-gradient(var(--primary-border) 1px, transparent 1px), linear-gradient(90deg, var(--primary-border) 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                }}
              />
            )}
          </AnimatePresence>

          {/* Ambient glow on drag */}
          {dragActive && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 blur-3xl opacity-20 pointer-events-none"
              style={{ background: 'var(--primary)' }} />
          )}

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-6"
              >
                {/* Spinning ring */}
                <div className="relative w-20 h-20">
                  <div
                    className="absolute inset-0 rounded-2xl flex items-center justify-center"
                    style={{ background: 'var(--primary-dim)', border: '1px solid var(--primary-border)' }}
                  >
                    <Loader2 className="w-9 h-9 animate-spin" style={{ color: 'var(--primary)' }} />
                  </div>
                  <div
                    className="absolute inset-0 rounded-2xl animate-ping"
                    style={{ border: '1px solid var(--primary-border)' }}
                  />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-[16px] font-bold font-grotesk" style={{ color: 'var(--text-primary)' }}>
                    Analyzing PCAP capture…
                  </p>
                  <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                    Running 6-stage forensic pipeline
                  </p>
                </div>
                {/* Pipeline steps */}
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {PIPELINE_STEPS.map((step, i) => (
                    <React.Fragment key={step}>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.3 }}
                        className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded"
                        style={{
                          color: 'var(--primary)',
                          background: 'var(--primary-dim)',
                          border: '1px solid var(--primary-border)',
                        }}
                      >
                        {step}
                      </motion.span>
                      {i < PIPELINE_STEPS.length - 1 && (
                        <span style={{ color: 'var(--text-faint)' }}>›</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </motion.div>
            ) : selectedFile && !error ? (
              <motion.div key="selected"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)' }}
                >
                  <FileCheck className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="text-center">
                  <p className="text-[15px] font-bold text-emerald-400 font-grotesk">{selectedFile.name}</p>
                  <p className="text-[12px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {(selectedFile.size / 1024).toFixed(1)} KB · Ready for analysis
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="idle"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-5 text-center"
              >
                {/* Upload icon with 3D effect */}
                <motion.div
                  whileHover={{ scale: 1.1, rotateZ: 3 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="relative"
                >
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all"
                    style={{
                      background: dragActive ? 'var(--primary-dim)' : 'var(--surface)',
                      border: `1px solid ${dragActive ? 'var(--primary-border)' : 'var(--border)'}`,
                      boxShadow: dragActive ? '0 0 30px var(--primary-border)' : 'var(--shadow-card)',
                    }}
                  >
                    <UploadCloud
                      className="w-9 h-9 transition-colors"
                      style={{ color: dragActive ? 'var(--primary)' : 'var(--text-faint)' }}
                    />
                  </div>
                  {/* Floating dots */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        background: 'var(--primary)',
                        top: `${20 + i * 20}%`,
                        right: `-${8 + i * 4}px`,
                        opacity: 0.4,
                      }}
                      animate={{ y: [-4, 4, -4], opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
                    />
                  ))}
                </motion.div>

                <div>
                  <p className="text-[17px] font-bold font-grotesk" style={{ color: 'var(--text-primary)' }}>
                    Drop PCAP capture here, or{' '}
                    <span className="cursor-pointer" style={{ color: 'var(--primary)' }}>
                      browse files
                    </span>
                  </p>
                  <p className="text-[13px] mt-2" style={{ color: 'var(--text-secondary)' }}>
                    Supports{' '}
                    {['.pcap', '.pcapng', '.cap'].map(ext => (
                      <span key={ext} className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {ext}{' '}
                      </span>
                    ))}
                    files containing SMTP, IMAP, or POP3 traffic
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 text-[11px]">
                  {['100% Passive', 'NIST SP 800-52', 'JA3/JA3S', 'XGBoost ML'].map(tag => (
                    <div key={tag} className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span style={{ color: 'var(--text-faint)' }}>{tag}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </label>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="mx-2 mb-2 flex items-center gap-3 p-3.5 rounded-xl"
              style={{
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.2)',
              }}
            >
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-[13px] text-red-300 font-medium flex-1">{error}</p>
              <button onClick={() => setError(null)}>
                <X className="w-4 h-4" style={{ color: 'var(--text-faint)' }} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Synthetic scenarios ── */}
      <div className="card p-5 space-y-4" style={{ background: 'var(--card)' }}>
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h4 className="text-[14px] font-bold font-grotesk" style={{ color: 'var(--text-primary)' }}>
            Synthetic Test Scenarios
          </h4>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              color: '#fbbf24',
              background: 'rgba(251,191,36,0.1)',
              border: '1px solid rgba(251,191,36,0.25)',
            }}
          >
            One-Click Demo
          </span>
        </div>
        <p className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>
          Pre-built synthetic PCAP captures covering real-world vulnerability scenarios
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLES.map(sample => {
            const isLoading = loadingSample === sample.id;
            const SampleIcon = sample.icon;
            return (
              <motion.button
                key={sample.id}
                onClick={() => handleSample(sample.id)}
                disabled={!!loadingSample || loading}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="relative p-4 rounded-xl text-left overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${sample.color}0a, var(--surface))`,
                  border: `1px solid ${sample.border}`,
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${sample.glow}, transparent 65%)` }}
                />
                {/* Corner accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
                  style={{ background: `linear-gradient(90deg, transparent, ${sample.color}80, transparent)` }}
                />

                <div className="flex items-start justify-between mb-3 relative">
                  <span
                    className={`badge ${sample.tagStyle}`}
                  >
                    {sample.tag}
                  </span>
                  <SampleIcon className="w-5 h-5" style={{ color: sample.color }} />
                </div>

                <p className="text-[13px] font-bold relative font-grotesk" style={{ color: sample.color }}>
                  {sample.label}
                </p>
                <p className="text-[11px] mt-1.5 leading-relaxed relative" style={{ color: 'var(--text-faint)' }}>
                  {sample.desc}
                </p>

                {/* CTA */}
                <div className="mt-3 flex items-center gap-1.5 relative">
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: sample.color }} />
                  ) : (
                    <Play className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: sample.color }} />
                  )}
                  <span
                    className="text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: sample.color }}
                  >
                    {isLoading ? 'Starting…' : 'Run scenario'}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
