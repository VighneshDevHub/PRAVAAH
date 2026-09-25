import React from 'react';
import { Lock, ShieldAlert, CheckCircle2, Server, Laptop, Key, FileCode } from 'lucide-react';
import { EvidenceStatus } from './EvidenceStatus';

interface TLSHandshakeProps {
  tlsVersion?: string;
  cipherSuite?: string;
  keyExchange?: string;
  hasForwardSecrecy?: boolean;
  ja3Hash?: string;
  ja3sHash?: string;
}

export const TLSHandshakeTimeline: React.FC<TLSHandshakeProps> = ({
  tlsVersion = 'TLS 1.3',
  cipherSuite = 'TLS_AES_256_GCM_SHA384',
  keyExchange = 'ECDHE',
  hasForwardSecrecy = true,
  ja3Hash,
  ja3sHash,
}) => {
  const isLegacyTLS = tlsVersion.includes('1.0') || tlsVersion.includes('1.1') || tlsVersion.includes('SSL');

  const handshakeSteps = [
    { sender: 'Client', msg: 'ClientHello', desc: 'Supported TLS versions, cipher suites, SNI, key shares' },
    { sender: 'Server', msg: 'ServerHello', desc: 'Selected cipher suite, key share agreement' },
    { sender: 'Server', msg: 'EncryptedExtensions', desc: 'Server extensions payload (Encrypted in TLS 1.3)' },
    { sender: 'Server', msg: 'Certificate', desc: 'X.509 Server Certificate Chain' },
    { sender: 'Server', msg: 'CertificateVerify', desc: 'Digital signature over handshake transcript' },
    { sender: 'Server / Client', msg: 'Finished', desc: 'HMAC verification & session key transition' },
  ];

  return (
    <div className="space-y-4">
      {/* TLS Security Specs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-4">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            TLS Protocol Version
          </span>
          <p className="text-base font-bold font-mono text-slate-900 dark:text-slate-100 flex items-center gap-2">
            {tlsVersion}
            {isLegacyTLS ? (
              <span className="badge badge-critical">DEPRECATED</span>
            ) : (
              <span className="badge badge-low font-mono text-[10px]">SECURE</span>
            )}
          </p>
        </div>

        <div className="card p-4">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Negotiated Cipher Suite
          </span>
          <p className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400 truncate" title={cipherSuite}>
            {cipherSuite || 'NOT DETERMINABLE'}
          </p>
        </div>

        <div className="card p-4">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Key Exchange Algorithm
          </span>
          <p className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">
            {keyExchange || 'NOT DETERMINABLE'}
          </p>
        </div>

        <div className="card p-4">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Perfect Forward Secrecy (PFS)
          </span>
          <p className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            {hasForwardSecrecy ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> YES (PFS Active)
              </span>
            ) : (
              <span className="text-red-500 flex items-center gap-1">
                <ShieldAlert className="w-4 h-4" /> NO (Static Keys)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* JA3 & JA3S Fingerprints */}
      {(ja3Hash || ja3sHash) && (
        <div className="card p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase font-mono block mb-1">
              JA3 Client Fingerprint Hash
            </span>
            <p className="text-xs font-mono bg-slate-100 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 select-all">
              {ja3Hash || 'NOT DETERMINABLE'}
            </p>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase font-mono block mb-1">
              JA3S Server Fingerprint Hash
            </span>
            <p className="text-xs font-mono bg-slate-100 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 select-all">
              {ja3sHash || 'NOT DETERMINABLE'}
            </p>
          </div>
        </div>
      )}

      {/* TLS Handshake Packet Flow */}
      <div className="card p-5">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
          <Key className="w-4 h-4 text-blue-600" />
          TLS 1.3 Handshake Protocol Message Flow
        </h4>

        <div className="space-y-2.5">
          {handshakeSteps.map((step, idx) => {
            const isClient = step.sender.includes('Client');
            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 font-bold flex items-center justify-center font-mono text-[11px]">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold font-mono text-slate-900 dark:text-slate-100">
                      {step.msg}
                    </span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    isClient ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900' : 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900'
                  }`}>
                    {step.sender}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
