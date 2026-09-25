import React, { useState } from 'react';
import { Globe, Server, Activity, Key, Award, ShieldAlert, Zap, X, Info } from 'lucide-react';

interface NodeItem {
  id: string;
  type: string;
  label: string;
  status: 'good' | 'warning' | 'critical' | 'info';
  details: Record<string, string>;
}

export const PostureGraph: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<NodeItem | null>({
    id: 'node-cert',
    type: 'Certificate',
    label: 'mail.enterprise.gov Cert',
    status: 'good',
    details: {
      Subject: 'mail.enterprise.gov',
      Issuer: 'DigiCert Global Root G2',
      Validity: 'Valid (120 days remaining)',
      'Key Spec': 'RSA 2048 bits',
      Signature: 'sha256WithRSAEncryption',
      Fingerprint: '4A:78:E2:B1:C9:D0:3E:45:90:12:34:56:78:9A:BC:DE:F0:12:34:56',
      'Related Sessions': 'Session #042, Session #043',
    },
  });

  const graphNodes: NodeItem[] = [
    {
      id: 'node-domain',
      type: 'Email Domain',
      label: 'enterprise.gov',
      status: 'good',
      details: {
        Domain: 'enterprise.gov',
        MX: 'mail.enterprise.gov (Priority 10)',
        SPF: 'v=spf1 ip4:192.168.1.0/24 -all',
        DMARC: 'v=DMARC1; p=reject;',
      },
    },
    {
      id: 'node-server',
      type: 'Mail Server',
      label: 'mail.enterprise.gov:587',
      status: 'good',
      details: {
        Host: 'mail.enterprise.gov',
        IP: '192.168.1.100',
        Port: '587 (Submission / STARTTLS)',
        Software: 'Postfix SMTP 3.5.6',
      },
    },
    {
      id: 'node-session',
      type: 'Email Session',
      label: 'Session #042',
      status: 'good',
      details: {
        'Session ID': '#042',
        Protocol: 'SMTP',
        'Source IP': '10.0.1.24:54122',
        STARTTLS: 'Advertised & Upgraded',
      },
    },
    {
      id: 'node-tls',
      type: 'TLS Handshake',
      label: 'TLS 1.3 / AES-256-GCM',
      status: 'good',
      details: {
        Version: 'TLS 1.3',
        Cipher: 'TLS_AES_256_GCM_SHA384',
        'Key Exchange': 'ECDHE',
        PFS: 'Active (ECDHE)',
      },
    },
    {
      id: 'node-cert',
      type: 'Certificate',
      label: 'mail.enterprise.gov Cert',
      status: 'good',
      details: {
        Subject: 'mail.enterprise.gov',
        Issuer: 'DigiCert Global Root G2',
        Validity: 'Valid (120 days remaining)',
        'Key Spec': 'RSA 2048 bits',
        Signature: 'sha256WithRSAEncryption',
        Fingerprint: '4A:78:E2:B1:C9:D0:3E:45:90:12:34:56:78:9A:BC:DE:F0:12:34:56',
        'Related Sessions': 'Session #042, Session #043',
      },
    },
    {
      id: 'node-finding',
      type: 'Security Finding',
      label: 'RFC 8996 TLS Check',
      status: 'info',
      details: {
        Finding: 'TLS Version Compliance',
        Standard: 'RFC 8996 / RFC 8314',
        Severity: 'PASS (TLS 1.3 Active)',
        Recommendation: 'Maintain TLS 1.3 default policy',
      },
    },
    {
      id: 'node-risk',
      type: 'Risk Posture',
      label: 'Score 82 / 100 (GOOD)',
      status: 'good',
      details: {
        'Overall Posture': '82 / 100 (GOOD)',
        'TLS Security': '92 / 100',
        'Certificate Health': '88 / 100',
        'Behavioral Anomaly': '12 / 100 (Low)',
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Visual Relationship Node Canvas */}
      <div className="lg:col-span-2 card p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-grotesk flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-600" />
            Cryptographic Security Posture Relationship Graph
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Click any forensic node below to inspect cryptographic parameters and dependency chain.
          </p>
        </div>

        {/* Node Flow Diagram */}
        <div className="py-8 space-y-3">
          {graphNodes.map((node, i) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <div key={node.id} className="flex flex-col items-center">
                <button
                  onClick={() => setSelectedNode(node)}
                  className={`w-full max-w-md p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 shadow-sm ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 font-bold flex items-center justify-center text-xs font-mono">
                      0{i + 1}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                        {node.type}
                      </span>
                      <span className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100">
                        {node.label}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
                    INSPECT NODE
                  </span>
                </button>

                {i < graphNodes.length - 1 && (
                  <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-700 my-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Side Inspector Panel */}
      <div className="card p-5 flex flex-col justify-between">
        {selectedNode ? (
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-blue-600 dark:text-blue-400">
                  NODE INSPECTOR
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-grotesk">
                  {selectedNode.type}
                </h4>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 uppercase font-mono block">
                  NODE IDENTIFIER
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                  {selectedNode.label}
                </span>
              </div>

              {Object.entries(selectedNode.details).map(([key, value]) => (
                <div key={key} className="border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-[11px] font-mono text-slate-400 font-semibold block uppercase">
                    {key}
                  </span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 text-xs break-all">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
            Select a node in the relationship graph to view detailed cryptographic properties.
          </div>
        )}

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 font-mono">
          PRAVAAH Posture Graph Engine v1.0
        </div>
      </div>
    </div>
  );
};
