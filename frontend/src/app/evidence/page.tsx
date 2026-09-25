'use client';

import React from 'react';
import { Layers, FileCode, CheckCircle2, Info } from 'lucide-react';
import { EvidenceStatus } from '../../components/EvidenceStatus';

export default function EvidencePage() {
  const evidenceItems = [
    {
      id: 'F-042',
      pcap: 'enterprise_mail_capture.pcap',
      session: 'Session #042',
      frame: '18,421',
      timestamp: '10:42:13.204',
      protocol: 'SMTP/TLS',
      finding: 'Valid TLS 1.3 Negotiation',
      confidence: 'HIGH',
      hasFrames: true,
    },
    {
      id: 'F-043',
      pcap: 'enterprise_mail_capture.pcap',
      session: 'Session #043',
      frame: '18,480',
      timestamp: '10:42:18.112',
      protocol: 'POP3',
      finding: 'Plaintext POP3 Authentication',
      confidence: 'HIGH',
      hasFrames: true,
    },
    {
      id: 'F-044',
      pcap: 'passive_mail_stream.pcap',
      session: 'Session #044',
      frame: 'N/A',
      timestamp: '10:45:00.000',
      protocol: 'IMAP/TLS',
      finding: 'Passive Certificate Extraction',
      confidence: 'NOT DETERMINABLE',
      hasFrames: false,
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl font-bold font-grotesk text-slate-900 dark:text-slate-100">
          Forensic Evidence Workspace
        </h1>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          Frame-level packet evidence correlation and RFC finding attribution.
        </p>
      </div>

      <div className="space-y-4">
        {evidenceItems.map((ev) => (
          <div key={ev.id} className="card p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-600">Finding #{ev.id}</span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{ev.finding}</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-slate-400">Confidence:</span>
                {ev.hasFrames ? (
                  <span className="badge badge-low">HIGH</span>
                ) : (
                  <EvidenceStatus status="NOT_DETERMINABLE" compact />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs text-slate-600 dark:text-slate-400">
              <div><span className="text-slate-400 block text-[10px]">SOURCE PCAP</span>{ev.pcap}</div>
              <div><span className="text-slate-400 block text-[10px]">SESSION ID</span>{ev.session}</div>
              <div><span className="text-slate-400 block text-[10px]">FRAME #</span>{ev.frame}</div>
              <div><span className="text-slate-400 block text-[10px]">TIMESTAMP</span>{ev.timestamp}</div>
              <div><span className="text-slate-400 block text-[10px]">PROTOCOL</span>{ev.protocol}</div>
            </div>

            {ev.hasFrames ? (
              <div className="p-3 rounded bg-slate-950 text-slate-200 font-mono text-[11px] space-y-1">
                <div>0000 16 03 03 00 4b 01 00 00 47 03 03 4a 78 e2 b1 c9 ....K...G..Jx..</div>
                <div>0010 d0 3e 45 90 12 34 56 78 9a bc de f0 12 34 56 78 .&gt;E..4Vx.....4Vx</div>
              </div>
            ) : (
              <EvidenceStatus
                status="NOT_DETERMINABLE"
                reason="Frame-level raw packet bytes were unobservable in this capture stream."
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
