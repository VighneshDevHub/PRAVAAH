'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadPcap, triggerSamplePcap } from '../../lib/api';
import {
  UploadCloud, FileCheck, ShieldAlert, Cpu, AlertCircle, Loader2, Zap, ArrowRight, ShieldCheck, FileCode
} from 'lucide-react';

export default function IngestPage() {
  const router = useRouter();
  const [file, setFile]             = useState<File | null>(null);
  const [fileHash, setFileHash]     = useState<string>('');
  const [loading, setLoading]       = useState(false);
  const [sampleLoading, setSampleLoading] = useState<string | null>(null);
  const [error, setError]           = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setError('');
      // Compute simple hash string for visual display
      const simulatedHash = Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      setFileHash(`sha256:${simulatedHash}`);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const job = await uploadPcap(file);
      router.push(`/jobs/${job.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to upload PCAP');
      setLoading(false);
    }
  };

  const handleTriggerSample = async (sampleName: string) => {
    setSampleLoading(sampleName);
    setError('');
    try {
      const job = await triggerSamplePcap(sampleName);
      router.push(`/jobs/${job.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to trigger synthetic PCAP test scenario');
      setSampleLoading(null);
    }
  };

  const syntheticScenarios = [
    {
      id: 'weak_sslv3',
      title: 'Weak TLS Configuration Scenario',
      desc: 'Simulates deprecated SSLv3 / TLS 1.0 handshake negotiation with weak cipher suites (RC4/3DES).',
      tag: 'WEAK TLS POLICY',
    },
    {
      id: 'expired_imaps',
      title: 'Expired X.509 Certificate Scenario',
      desc: 'Simulates IMAPS communication with an expired server certificate signature.',
      tag: 'EXPIRED CERT',
    },
    {
      id: 'starttls_downgrade',
      title: 'STARTTLS Policy Deviation Scenario',
      desc: 'Simulates cleartext POP3 session where STARTTLS advertisement was stripped or rejected.',
      tag: 'POLICY DEVIATION',
    },
    {
      id: 'hardened_tls13',
      title: 'Hardened TLS 1.3 Baseline Scenario',
      desc: 'Simulates fully compliant SMTP session using TLS 1.3, AES-256-GCM, and valid chain cert.',
      tag: 'HARDENED BASELINE',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold font-grotesk text-slate-900 dark:text-slate-100">
          PCAP Analysis & Ingestion
        </h1>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          Upload captured email traffic for passive forensic analysis without decrypting content.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          {error}
        </div>
      )}

      {/* Main Drag & Drop Zone */}
      <div className="card p-8 border-2 border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 mx-auto">
          <UploadCloud className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-grotesk">
            Select or Drag Network Capture File
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
            Supported formats: .pcap, .pcapng, .cap (Max size: 500 MB)
          </p>
        </div>

        <input
          type="file"
          accept=".pcap,.pcapng,.cap"
          onChange={handleFileChange}
          className="hidden"
          id="pcap-upload-input"
        />

        {!file ? (
          <label
            htmlFor="pcap-upload-input"
            className="btn-primary cursor-pointer text-xs py-2.5 px-5 inline-flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            Browse File System
          </label>
        ) : (
          <div className="max-w-md mx-auto p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100">
              <span className="truncate">{file.name}</span>
              <span className="text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <div className="text-[11px] text-slate-500 truncate">{fileHash}</div>

            <button
              onClick={handleUpload}
              disabled={loading}
              className="btn-primary w-full py-2 text-xs font-semibold gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Ingesting & Running Pipeline...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" /> Start PCAP Analysis
                </>
              )}
            </button>
          </div>
        )}

        <div className="pt-2 text-[11px] text-slate-400 font-mono flex items-center justify-center gap-4">
          <span>● Passive Analysis</span>
          <span>● Zero Content Decryption</span>
          <span>● Evidence Hash Preserved</span>
        </div>
      </div>

      {/* Synthetic Test Scenarios */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div>
            <span className="text-[10px] font-mono font-bold text-amber-600 uppercase tracking-wider block">
              CONTROLLED SYNTHETIC DATA
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-grotesk">
              Pre-Generated Forensic Test Scenarios
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">For Demonstration & Audit Verification</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {syntheticScenarios.map((sc) => (
            <div
              key={sc.id}
              className="card p-4 space-y-3 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="badge badge-medium font-mono text-[10px]">{sc.tag}</span>
                  <span className="text-[10px] font-mono text-slate-400">CONTROLLED SYNTHETIC</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 font-grotesk">
                  {sc.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {sc.desc}
                </p>
              </div>

              <button
                onClick={() => handleTriggerSample(sc.id)}
                disabled={sampleLoading !== null}
                className="btn-ghost w-full py-1.5 text-xs font-semibold gap-1.5 justify-center"
              >
                {sampleLoading === sc.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                ) : (
                  <>
                    Run Synthetic Scenario <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
