'use client';

import React from 'react';
import { TLSHandshakeTimeline } from '../../components/TLSHandshakeTimeline';
import { Key, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function TLSAnalysisPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl font-bold font-grotesk text-slate-900 dark:text-slate-100">
          TLS Protocol Security Matrix
        </h1>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          Handshake parameters, cipher suite strength, and forward secrecy verification.
        </p>
      </div>

      <TLSHandshakeTimeline
        tlsVersion="TLS 1.3"
        cipherSuite="TLS_AES_256_GCM_SHA384"
        keyExchange="ECDHE"
        hasForwardSecrecy={true}
        ja3Hash="771,4865-4866-4867,0-23-65281-10-11,29-23-24,0"
        ja3sHash="771,4865,0-23-10-11-29"
      />
    </div>
  );
}
