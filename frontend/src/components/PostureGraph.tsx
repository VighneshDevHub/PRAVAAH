'use client';

import React, { useState, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Globe, Server, Activity, Key, Award, ShieldAlert, Zap, X, Info,
  Search, ZoomIn, ZoomOut, Maximize2, RotateCcw, AlertTriangle,
  CheckCircle2, FileSearch, Layers, ChevronRight, Eye, ArrowRight,
  HelpCircle, ShieldCheck, Cpu, Terminal, FileText, Lock, Radio
} from 'lucide-react';

export interface GraphNode {
  id: string;
  category: string;
  label: string;
  subtitle: string;
  status: 'good' | 'warning' | 'high' | 'critical' | 'evidence' | 'info';
  statusText: string;
  icon: React.ElementType;
  x: number;
  y: number;
  details: {
    title: string;
    sectionHeader?: string;
    properties: Array<{ label: string; value: string; isWarning?: boolean; isHighlight?: boolean; isNotAvailable?: boolean }>;
    forensicNotes?: string;
    evidenceConfidence?: 'HIGH' | 'MEDIUM' | 'LIMITED';
    navTarget?: { type: 'session' | 'evidence' | 'certificate'; path: string };
  };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  status?: 'good' | 'warning' | 'high' | 'critical';
}

const INITIAL_NODES: GraphNode[] = [
  {
    id: 'node-domain',
    category: 'EMAIL DOMAIN',
    label: 'enterprise.gov',
    subtitle: 'Primary Government Domain',
    status: 'good',
    statusText: 'Verified Active',
    icon: Globe,
    x: 50,
    y: 220,
    details: {
      title: 'Email Domain Infrastructure',
      sectionHeader: 'DNS & Policy Security',
      properties: [
        { label: 'DOMAIN NAME', value: 'enterprise.gov' },
        { label: 'MX RECORD', value: 'mail.enterprise.gov (Priority 10)' },
        { label: 'SPF POLICY', value: 'v=spf1 ip4:192.168.1.0/24 -all (HARD FAIL)' },
        { label: 'DMARC POLICY', value: 'v=DMARC1; p=reject; rua=mailto:dmarc@enterprise.gov' },
        { label: 'MTA-STS POLICY', value: 'Enforce (Mode: Enforce, Max-Age: 604800)' },
      ],
      evidenceConfidence: 'HIGH',
      forensicNotes: 'DNS TXT policies verified via authoritative name server lookup.',
    },
  },
  {
    id: 'node-server',
    category: 'MAIL SERVER',
    label: 'mail.enterprise.gov:587',
    subtitle: 'SMTP Submission Endpoint',
    status: 'good',
    statusText: 'Online (Port 587)',
    icon: Server,
    x: 270,
    y: 220,
    details: {
      title: 'Mail Server Endpoint',
      sectionHeader: 'Network Endpoint Details',
      properties: [
        { label: 'HOSTNAME', value: 'mail.enterprise.gov' },
        { label: 'IP ADDRESS', value: '192.168.1.100' },
        { label: 'PORT / SERVICE', value: '587 / SMTP Submission (STARTTLS)' },
        { label: 'SOFTWARE BANNER', value: 'Postfix ESMTP (Ubuntu Linux)' },
        { label: 'LISTEN INTERFACE', value: 'eth0 (Passive Tap Dedicated Port)' },
      ],
      evidenceConfidence: 'HIGH',
      forensicNotes: 'Target host identified in passive PCAP TCP SYN/ACK handshake.',
    },
  },
  {
    id: 'node-session-42',
    category: 'EMAIL SESSION',
    label: 'Session #042',
    subtitle: 'SMTP / STARTTLS Stream',
    status: 'good',
    statusText: 'Completed (Secure)',
    icon: Activity,
    x: 490,
    y: 110,
    details: {
      title: 'Reconstructed Email Session #042',
      sectionHeader: 'Session State & Telemetry',
      properties: [
        { label: 'SESSION ID', value: '#042' },
        { label: 'PROTOCOL', value: 'SMTP (Port 587)' },
        { label: 'CLIENT IP', value: '10.0.1.24:54122' },
        { label: 'SERVER IP', value: '192.168.1.100:587' },
        { label: 'STARTTLS OFFERED', value: 'Yes (220 2.0.0 Ready to start TLS)' },
        { label: 'COMMAND SEQUENCE', value: 'EHLO -> STARTTLS -> TLS Handshake -> MAIL FROM' },
      ],
      evidenceConfidence: 'HIGH',
      forensicNotes: 'Clean STARTTLS upgrade sequence observed without injection or plaintext leak.',
      navTarget: { type: 'session', path: '/sessions' },
    },
  },
  {
    id: 'node-session-43',
    category: 'EMAIL SESSION',
    label: 'Session #043',
    subtitle: 'IMAP / TLS Stream',
    status: 'high',
    statusText: 'Warning Flags',
    icon: Activity,
    x: 490,
    y: 340,
    details: {
      title: 'Reconstructed Email Session #043',
      sectionHeader: 'Session State & Telemetry',
      properties: [
        { label: 'SESSION ID', value: '#043' },
        { label: 'PROTOCOL', value: 'IMAP (Port 993 Direct TLS)' },
        { label: 'CLIENT IP', value: '10.0.2.88:61204' },
        { label: 'SERVER IP', value: '192.168.1.105:993' },
        { label: 'TLS UPGRADE', value: 'Implicit TLS (Port 993 Direct Connect)' },
        { label: 'ANOMALY DETECTED', value: 'Expired Server Certificate Offered', isWarning: true },
      ],
      evidenceConfidence: 'HIGH',
      forensicNotes: 'Session established using legacy TLS 1.2 and an expired X.509 certificate.',
      navTarget: { type: 'session', path: '/sessions' },
    },
  },
  {
    id: 'node-starttls',
    category: 'STARTTLS',
    label: 'Upgrade Detected',
    subtitle: 'TCP Stream #42',
    status: 'good',
    statusText: 'RFC 3207 Verified',
    icon: Zap,
    x: 710,
    y: 50,
    details: {
      title: 'STARTTLS Protocol Upgrade',
      sectionHeader: 'Cleartext to Encrypted Transition',
      properties: [
        { label: 'EXTENSION', value: 'RFC 3207 STARTTLS' },
        { label: 'SERVER RESPONSE', value: '220 2.0.0 Ready to start TLS' },
        { label: 'STRIPPED ATTACK', value: 'No downgrade or stripping observed' },
        { label: 'TRANSITION FRAME', value: 'Frame #18452 (TCP ACK)' },
      ],
      evidenceConfidence: 'HIGH',
      forensicNotes: 'Passive tap confirmed STARTTLS keyword advertised in EHLO response.',
    },
  },
  {
    id: 'node-tls13',
    category: 'TLS HANDSHAKE',
    label: 'TLS 1.3',
    subtitle: 'AES-256-GCM',
    status: 'good',
    statusText: 'Modern Cryptography',
    icon: Key,
    x: 710,
    y: 170,
    details: {
      title: 'TLS 1.3 Handshake Telemetry',
      sectionHeader: 'Handshake & Cipher Details',
      properties: [
        { label: 'TLS VERSION', value: 'TLS 1.3 (0x0304)' },
        { label: 'CIPHER SUITE', value: 'TLS_AES_256_GCM_SHA384 (0x1302)' },
        { label: 'KEY EXCHANGE', value: 'X25519 (ECDHE)' },
        { label: 'SNI HOSTNAME', value: 'mail.enterprise.gov' },
        { label: 'ALPN PROTOCOL', value: 'smtp' },
      ],
      evidenceConfidence: 'HIGH',
      forensicNotes: 'TLS 1.3 1-RTT handshake verified with forward secrecy key share.',
    },
  },
  {
    id: 'node-tls12',
    category: 'TLS HANDSHAKE',
    label: 'TLS 1.2',
    subtitle: 'ECDHE-RSA-AES128',
    status: 'warning',
    statusText: 'Legacy Policy',
    icon: Key,
    x: 710,
    y: 340,
    details: {
      title: 'TLS 1.2 Handshake Telemetry',
      sectionHeader: 'Handshake & Cipher Details',
      properties: [
        { label: 'TLS VERSION', value: 'TLS 1.2 (0x0303)' },
        { label: 'CIPHER SUITE', value: 'TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256', isWarning: true },
        { label: 'FORWARD SECRECY', value: 'Supported (ECDHE_P256)' },
        { label: 'SNI HOSTNAME', value: 'Not Available (TLS 1.3 Encrypted Handshake Limit)', isNotAvailable: true },
        { label: 'CLIENT CERT', value: 'Not Observed', isNotAvailable: true },
      ],
      evidenceConfidence: 'LIMITED',
      forensicNotes: 'TLS 1.2 in use. RFC 8996 recommends migrating to TLS 1.3.',
    },
  },
  {
    id: 'node-crypto-params',
    category: 'CRYPTO PARAMETERS',
    label: 'X25519 Curve',
    subtitle: 'Forward Secrecy: YES',
    status: 'good',
    statusText: 'PFS Enabled',
    icon: Lock,
    x: 930,
    y: 110,
    details: {
      title: 'Cryptographic Parameters',
      sectionHeader: 'Key Exchange & PFS Verification',
      properties: [
        { label: 'ELLIPTIC CURVE', value: 'x25519 (Curve25519)' },
        { label: 'FORWARD SECRECY', value: 'YES (Perfect Forward Secrecy Active)' },
        { label: 'SIGNATURE ALGORITHM', value: 'ecdsa_secp256r1_sha256' },
        { label: 'QUANTUM SAFE', value: 'No (Classical ECC)' },
      ],
      evidenceConfidence: 'HIGH',
      forensicNotes: 'Ephemeral key exchange prevents retrospective decryption if server keys leak.',
    },
  },
  {
    id: 'node-cert-valid',
    category: 'CERTIFICATE',
    label: 'mail.enterprise.gov',
    subtitle: 'Valid (120 days)',
    status: 'good',
    statusText: 'X.509 Valid',
    icon: Award,
    x: 930,
    y: 230,
    details: {
      title: 'X.509 Certificate Chain Inspection',
      sectionHeader: 'Certificate Validity & Public Key',
      properties: [
        { label: 'SUBJECT CN', value: 'mail.enterprise.gov' },
        { label: 'ISSUER CA', value: 'DigiCert TLS RSA SHA256 Root CA' },
        { label: 'VALIDITY PERIOD', value: 'Valid (120 days remaining)' },
        { label: 'PUBLIC KEY SPEC', value: 'RSA 2048 bits (e=65537)' },
        { label: 'SIGNATURE HASH', value: 'SHA-256' },
        { label: 'SAN EXTENSIONS', value: 'mail.enterprise.gov, smtp.enterprise.gov' },
        { label: 'FINGERPRINT', value: '8F:42:E9:1A:78:B0:99:C4:12:34:56:78:9A:BC:DE:F0' },
      ],
      evidenceConfidence: 'HIGH',
      forensicNotes: 'Chain fully verified against trusted OS CA certificate store.',
      navTarget: { type: 'certificate', path: '/certificates' },
    },
  },
  {
    id: 'node-cert-expired',
    category: 'CERTIFICATE',
    label: 'legacy-mail.enterprise',
    subtitle: 'Expired 14 Days Ago',
    status: 'high',
    statusText: 'EXPIRED X.509',
    icon: Award,
    x: 930,
    y: 370,
    details: {
      title: 'X.509 Certificate Chain Inspection',
      sectionHeader: 'Expired Certificate Evidence',
      properties: [
        { label: 'SUBJECT CN', value: 'legacy-mail.enterprise.gov', isWarning: true },
        { label: 'ISSUER CA', value: 'Internal Enterprise Self-Signed CA', isWarning: true },
        { label: 'VALIDITY STATUS', value: 'EXPIRED (14 days past validity end)', isWarning: true },
        { label: 'PUBLIC KEY SPEC', value: 'RSA 2048 bits' },
        { label: 'SIGNATURE HASH', value: 'SHA-1 (Legacy Deprecated)', isWarning: true },
        { label: 'FINGERPRINT', value: '3C:99:B4:12:88:E0:11:F4:99:11:22:33:44:55:66:77' },
      ],
      evidenceConfidence: 'HIGH',
      forensicNotes: 'Certificate expired on 2026-09-11. Passive client connections trigger security warnings.',
      navTarget: { type: 'certificate', path: '/certificates' },
    },
  },
  {
    id: 'node-finding-low',
    category: 'SECURITY FINDING',
    label: 'Modern Baseline',
    subtitle: 'Hardened TLS 1.3',
    status: 'good',
    statusText: 'PASS (Low Risk)',
    icon: ShieldCheck,
    x: 1150,
    y: 110,
    details: {
      title: 'Security Finding Assessment',
      sectionHeader: 'Evaluated Finding Parameters',
      properties: [
        { label: 'FINDING NAME', value: 'Compliant TLS 1.3 Channel Baseline' },
        { label: 'SEVERITY', value: 'LOW / PASS' },
        { label: 'MAPPED STANDARD', value: 'RFC 8996 / NIST SP 800-52 Rev 2' },
        { label: 'EXPLANABILITY', value: 'STARTTLS succeeded, TLS 1.3 negotiated with forward secrecy.' },
      ],
      evidenceConfidence: 'HIGH',
      forensicNotes: 'Channel complies with government secure email communication guidelines.',
    },
  },
  {
    id: 'node-finding-high',
    category: 'SECURITY FINDING',
    label: 'Certificate Expired',
    subtitle: 'High Severity Vulnerability',
    status: 'critical',
    statusText: 'HIGH / CRITICAL',
    icon: ShieldAlert,
    x: 1150,
    y: 340,
    details: {
      title: 'Security Finding Assessment',
      sectionHeader: 'Evaluated Vulnerability Parameters',
      properties: [
        { label: 'FINDING NAME', value: 'Expired Mail Server Certificate Offered', isWarning: true },
        { label: 'SEVERITY LEVEL', value: 'HIGH / CRITICAL RISK', isWarning: true },
        { label: 'MAPPED STANDARD', value: 'RFC 5280 / RFC 8314 Section 3' },
        { label: 'VULNERABILITY ID', value: 'PRV-2026-0428' },
        { label: 'EXPLANABILITY', value: 'Server offered an X.509 certificate expired 14 days ago during IMAP handshake.', isWarning: true },
      ],
      evidenceConfidence: 'HIGH',
      forensicNotes: 'Clients connecting to port 993 receive untrusted/expired identity proof.',
    },
  },
  {
    id: 'node-pcap-evidence',
    category: 'PCAP EVIDENCE',
    label: 'Frame #18472',
    subtitle: 'TCP Stream #42',
    status: 'evidence',
    statusText: 'Captured Frame',
    icon: FileSearch,
    x: 1370,
    y: 340,
    details: {
      title: 'PCAP Frame & Packet Evidence',
      sectionHeader: 'Raw Packet Capture Correlation',
      properties: [
        { label: 'FRAME NUMBER', value: 'Frame #18472 (Length: 1420 bytes)' },
        { label: 'TCP STREAM ID', value: 'TCP Stream #42' },
        { label: 'TIMESTAMP', value: '2026-09-25 09:32:14.481290 UTC' },
        { label: 'PACKET TYPE', value: 'TLS Certificate Handshake Record (Content Type 22)' },
        { label: 'HEX DUMP OFFSET', value: '0x0040: 0b 00 03 84 00 03 81 00 03 7e 30 82 03 7a ...' },
      ],
      evidenceConfidence: 'HIGH',
      forensicNotes: 'Raw byte record preserved in PCAP storage for audit integrity.',
      navTarget: { type: 'evidence', path: '/evidence' },
    },
  },
  {
    id: 'node-recom-high',
    category: 'RECOMMENDATION',
    label: 'Renew Certificate',
    subtitle: 'Deploy MTA-STS',
    status: 'warning',
    statusText: 'Action Required',
    icon: Cpu,
    x: 1580,
    y: 340,
    details: {
      title: 'Remediation & Action Plan',
      sectionHeader: 'Forensic Remediation Guidance',
      properties: [
        { label: 'PRIMARY ACTION', value: 'Renew and re-deploy server X.509 certificate on mail.enterprise.gov', isWarning: true },
        { label: 'CONFIGURATION FIX', value: 'Update Posture Policy: enforce TLS 1.3 and disable SSLv3/TLS 1.0/1.1' },
        { label: 'POLICY ENFORCEMENT', value: 'Publish MTA-STS policy file at https://mta-sts.enterprise.gov/.well-known/mta-sts.txt' },
        { label: 'ESTIMATED TIME', value: '< 30 minutes' },
      ],
      evidenceConfidence: 'HIGH',
      forensicNotes: 'Executing these remediation steps clears Finding PRV-2026-0428.',
    },
  },
];

const INITIAL_EDGES: GraphEdge[] = [
  { id: 'e-dom-srv',    source: 'node-domain',      target: 'node-server',       label: 'hosts' },
  { id: 'e-srv-s42',    source: 'node-server',      target: 'node-session-42',   label: 'establishes' },
  { id: 'e-srv-s43',    source: 'node-server',      target: 'node-session-43',   label: 'establishes', status: 'warning' },
  { id: 'e-s42-stls',   source: 'node-session-42',  target: 'node-starttls',     label: 'upgrades via' },
  { id: 'e-stls-t13',   source: 'node-starttls',    target: 'node-tls13',        label: 'negotiates' },
  { id: 'e-t13-crypto', source: 'node-tls13',       target: 'node-crypto-params',label: 'configures' },
  { id: 'e-t13-cert1',  source: 'node-tls13',       target: 'node-cert-valid',   label: 'presents' },
  { id: 'e-crypto-f1',  source: 'node-crypto-params',target: 'node-finding-low', label: 'evaluates' },
  { id: 'e-cert1-f1',   source: 'node-cert-valid',  target: 'node-finding-low',  label: 'verifies' },
  { id: 'e-s43-t12',    source: 'node-session-43',  target: 'node-tls12',        label: 'negotiates', status: 'warning' },
  { id: 'e-t12-cert2',  source: 'node-tls12',       target: 'node-cert-expired', label: 'presents', status: 'warning' },
  { id: 'e-cert2-f2',   source: 'node-cert-expired',target: 'node-finding-high',label: 'triggers', status: 'critical' },
  { id: 'e-f2-pcap2',   source: 'node-finding-high',target: 'node-pcap-evidence',label: 'supported by', status: 'critical' },
  { id: 'e-pcap2-r2',   source: 'node-pcap-evidence',target: 'node-recom-high',  label: 'remediates', status: 'warning' },
];

export const PostureGraph: React.FC = () => {
  const router = useRouter();
  const [nodes, setNodes] = useState<GraphNode[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-finding-high');
  const [searchQuery, setSearchQuery] = useState('');
  const [scale, setScale] = useState(0.85);
  const [pan, setPan] = useState({ x: 30, y: 30 });
  const [isTracingFinding, setIsTracingFinding] = useState(false);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);
  const isPanningRef = useRef(false);
  const startPanRef = useRef({ x: 0, y: 0 });

  // Selected node object
  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || nodes[0];
  }, [nodes, selectedNodeId]);

  // Traced Path IDs (Finding -> Certificate -> TLS -> Session -> Server -> Evidence -> Recommendation)
  const tracedNodeIds = useMemo(() => {
    if (!isTracingFinding && selectedNodeId !== 'node-finding-high') {
      return new Set<string>();
    }
    return new Set<string>([
      'node-domain',
      'node-server',
      'node-session-43',
      'node-tls12',
      'node-cert-expired',
      'node-finding-high',
      'node-pcap-evidence',
      'node-recom-high',
    ]);
  }, [isTracingFinding, selectedNodeId]);

  const tracedEdgeIds = useMemo(() => {
    if (!isTracingFinding && selectedNodeId !== 'node-finding-high') {
      return new Set<string>();
    }
    return new Set<string>([
      'e-dom-srv',
      'e-srv-s43',
      'e-s43-t12',
      'e-t12-cert2',
      'e-cert2-f2',
      'e-f2-pcap2',
      'e-pcap2-r2',
    ]);
  }, [isTracingFinding, selectedNodeId]);

  // Handle Trace Finding Toggle
  const toggleTraceFinding = () => {
    if (isTracingFinding) {
      setIsTracingFinding(false);
    } else {
      setIsTracingFinding(true);
      setSelectedNodeId('node-finding-high');
    }
  };

  // Zoom controls
  const handleZoomIn = () => setScale((s) => Math.min(1.4, s + 0.1));
  const handleZoomOut = () => setScale((s) => Math.max(0.4, s - 0.1));
  const handleResetFit = () => {
    setScale(0.85);
    setPan({ x: 30, y: 30 });
    setIsTracingFinding(false);
    setSelectedNodeId('node-finding-high');
    setSearchQuery('');
  };

  // Dragging Canvas Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || draggingNodeId) return;
    isPanningRef.current = true;
    startPanRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId) {
      const containerRect = canvasRef.current?.getBoundingClientRect();
      if (containerRect) {
        const newX = (e.clientX - containerRect.left - pan.x) / scale - dragOffset.x;
        const newY = (e.clientY - containerRect.top - pan.y) / scale - dragOffset.y;
        setNodes((prev) =>
          prev.map((n) => (n.id === draggingNodeId ? { ...n, x: Math.max(10, newX), y: Math.max(10, newY) } : n))
        );
      }
      return;
    }
    if (!isPanningRef.current) return;
    setPan({
      x: e.clientX - startPanRef.current.x,
      y: e.clientY - startPanRef.current.y,
    });
  };

  const handleMouseUp = () => {
    isPanningRef.current = false;
    setDraggingNodeId(null);
  };

  // Node Drag Handler
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string, nodeX: number, nodeY: number) => {
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    setDraggingNodeId(nodeId);
    const containerRect = canvasRef.current?.getBoundingClientRect();
    if (containerRect) {
      const currentMouseX = (e.clientX - containerRect.left - pan.x) / scale;
      const currentMouseY = (e.clientY - containerRect.top - pan.y) / scale;
      setDragOffset({
        x: currentMouseX - nodeX,
        y: currentMouseY - nodeY,
      });
    }
  };

  // Map of node position lookups
  const nodeMap = useMemo(() => {
    const map = new Map<string, GraphNode>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  // Filtered nodes by search
  const matchesSearch = useCallback(
    (n: GraphNode) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        n.label.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q) ||
        n.subtitle.toLowerCase().includes(q) ||
        n.statusText.toLowerCase().includes(q)
      );
    },
    [searchQuery]
  );

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] min-h-[680px] w-full space-y-3 font-sans selection:bg-blue-500/10 text-slate-900 dark:text-slate-100">
      {/* ── Top Header Controls & Action Bar ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 card bg-slate-900 border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 shadow-sm">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold font-grotesk text-slate-100">
                Cryptographic Security Posture Graph
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Analysis Engine Online
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Trace security posture from email infrastructure → session → cryptography → finding → evidence.
            </p>
          </div>
        </div>

        {/* Action Controls & Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Filter Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search session, cert, node..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 pl-8 pr-3 py-1.5 text-xs font-mono rounded-lg w-48 sm:w-56 focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-500"
            />
          </div>

          {/* Unique PRAVAAH "Trace Finding" Button */}
          <button
            onClick={toggleTraceFinding}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              isTracingFinding
                ? 'bg-amber-500 text-slate-950 border border-amber-400 animate-pulse shadow-amber-500/20'
                : 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-500'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isTracingFinding ? 'Tracing Active Finding...' : '⚡ Trace Finding'}</span>
          </button>

          {/* Zoom / Pan Reset Controls */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-1">
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-1 hover:bg-slate-800 rounded text-slate-300 transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-1 hover:bg-slate-800 rounded text-slate-300 transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetFit}
              title="Fit Graph Canvas"
              className="p-1 hover:bg-slate-800 rounded text-slate-300 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetFit}
              title="Reset Selection"
              className="p-1 hover:bg-slate-800 rounded text-slate-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Canvas (72%) & Node Inspector (28%) Layout ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 overflow-hidden">
        {/* ── LEFT / CENTER: Interactive Graph Canvas (72% -> lg:col-span-8 or 9) ── */}
        <div
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="lg:col-span-8 xl:col-span-9 card p-0 bg-slate-950 border-slate-800 relative overflow-hidden flex flex-col justify-between cursor-grab active:cursor-grabbing select-none"
        >
          {/* Subtle Grid Background Pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Floating Cryptographic Posture Summary Overlay */}
          <div className="absolute top-3 left-3 z-20 p-3 rounded-xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-md w-56 font-mono text-xs space-y-2 pointer-events-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">POSTURE OVERVIEW</span>
              <span className="text-xs font-extrabold text-amber-400 font-grotesk">MEDIUM RISK</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">Posture Rating</span>
              <span className="font-extrabold text-slate-100 text-sm">82 / 100</span>
            </div>
            <div className="space-y-1 text-[10px] pt-1">
              <div className="flex justify-between text-slate-400">
                <span>Sessions</span>
                <span className="text-emerald-400 font-bold">1 Secure</span>
                <span className="text-amber-400 font-bold">1 Warning</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>TLS Protocols</span>
                <span className="text-blue-400 font-bold">TLS 1.3 (1)</span>
                <span className="text-amber-400 font-bold">TLS 1.2 (1)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Certificates</span>
                <span className="text-emerald-400 font-bold">1 Valid</span>
                <span className="text-red-400 font-bold">1 Expired</span>
              </div>
            </div>
          </div>

          {/* Zoom Level Indicator */}
          <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-[10px] text-slate-400 pointer-events-none">
            Scale: {Math.round(scale * 100)}%
          </div>

          {/* Scaled & Panned Canvas Surface */}
          <div
            className="w-full h-full relative origin-top-left transition-transform duration-75"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
              width: '1800px',
              height: '800px',
            }}
          >
            {/* SVG Connection Lines & Labels */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <marker
                  id="arrow-good"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                </marker>
                <marker
                  id="arrow-warning"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                </marker>
                <marker
                  id="arrow-critical"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                </marker>
              </defs>

              {INITIAL_EDGES.map((edge) => {
                const srcNode = nodeMap.get(edge.source);
                const tgtNode = nodeMap.get(edge.target);
                if (!srcNode || !tgtNode) return null;

                const srcX = srcNode.x + 90; // center offset of node card (width ~180)
                const srcY = srcNode.y + 40; // center offset of node card (height ~80)
                const tgtX = tgtNode.x + 90;
                const tgtY = tgtNode.y + 40;

                const isTraced = tracedEdgeIds.has(edge.id);
                const isSelectedEdge = selectedNodeId === edge.source || selectedNodeId === edge.target;
                const isDimmed = (isTracingFinding || selectedNodeId) && !isTraced && !isSelectedEdge;

                const strokeColor =
                  edge.status === 'critical' || edge.status === 'warning'
                    ? isTraced
                      ? '#ef4444'
                      : '#f59e0b'
                    : isTraced
                    ? '#06b6d4'
                    : '#3b82f6';

                const markerId =
                  edge.status === 'critical'
                    ? 'url(#arrow-critical)'
                    : edge.status === 'warning'
                    ? 'url(#arrow-warning)'
                    : 'url(#arrow-good)';

                // Smooth Bezier Curve Path
                const dx = tgtX - srcX;
                const controlX1 = srcX + dx * 0.4;
                const controlX2 = tgtX - dx * 0.4;
                const pathD = `M ${srcX} ${srcY} C ${controlX1} ${srcY}, ${controlX2} ${tgtY}, ${tgtX} ${tgtY}`;

                const midX = (srcX + tgtX) / 2;
                const midY = (srcY + tgtY) / 2;

                return (
                  <g key={edge.id} className="transition-all duration-300" style={{ opacity: isDimmed ? 0.2 : 1 }}>
                    <path
                      d={pathD}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={isTraced || isSelectedEdge ? 3 : 2}
                      strokeDasharray={isTraced ? '6 4' : undefined}
                      markerEnd={markerId}
                      className={isTraced ? 'animate-pulse' : ''}
                    />
                    {/* Edge Label Badge */}
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x="-36"
                        y="-10"
                        width="72"
                        height="18"
                        rx="4"
                        fill="#0b0f19"
                        stroke={strokeColor}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="2"
                        fill="#94a3b8"
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {edge.label}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* Render Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isTraced = tracedNodeIds.has(node.id);
              const isSearching = searchQuery.trim() !== '';
              const matches = matchesSearch(node);
              const isDimmed = (isTracingFinding || (searchQuery && !matches)) && !isTraced && !isSelected;

              const Icon = node.icon;

              let statusBorder = 'border-slate-800 bg-slate-900/90 text-slate-100';
              let badgeBg = 'bg-slate-800 text-slate-300';

              if (node.status === 'good') {
                statusBorder = isSelected
                  ? 'border-emerald-500 bg-emerald-950/40 shadow-emerald-500/20'
                  : 'border-slate-800 bg-slate-900/90 hover:border-emerald-500/50';
                badgeBg = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
              } else if (node.status === 'warning') {
                statusBorder = isSelected
                  ? 'border-amber-500 bg-amber-950/40 shadow-amber-500/20'
                  : 'border-amber-900/50 bg-slate-900/90 hover:border-amber-500/60';
                badgeBg = 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
              } else if (node.status === 'critical' || node.status === 'high') {
                statusBorder = isSelected
                  ? 'border-red-500 bg-red-950/40 shadow-red-500/20'
                  : 'border-red-900/60 bg-slate-900/90 hover:border-red-500/60';
                badgeBg = 'bg-red-500/20 text-red-400 border border-red-500/30';
              } else if (node.status === 'evidence') {
                statusBorder = isSelected
                  ? 'border-cyan-500 bg-cyan-950/40 shadow-cyan-500/20'
                  : 'border-cyan-900/50 bg-slate-900/90 hover:border-cyan-500/60';
                badgeBg = 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30';
              }

              return (
                <div
                  key={node.id}
                  onMouseDown={(e) => handleNodeMouseDown(e, node.id, node.x, node.y)}
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    opacity: isDimmed ? 0.25 : 1,
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                  }}
                  className={`absolute w-44 p-3 rounded-2xl border transition-all duration-200 shadow-xl cursor-pointer pointer-events-auto z-10 ${statusBorder} ${
                    isTraced ? 'ring-2 ring-cyan-400 shadow-cyan-500/30' : ''
                  }`}
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between gap-1 mb-1.5 border-b border-slate-800/80 pb-1.5">
                    <span className="text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase truncate">
                      {node.category}
                    </span>
                    <Icon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  </div>

                  {/* Primary Identifier */}
                  <div className="font-mono font-extrabold text-xs text-slate-100 truncate mb-0.5">
                    {node.label}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mb-2 font-sans">
                    {node.subtitle}
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded truncate ${badgeBg}`}>
                      ● {node.statusText}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Compact Legend */}
          <div className="p-2.5 bg-slate-900/95 border-t border-slate-800 font-mono text-[10px] flex flex-wrap items-center justify-between gap-3 text-slate-400 shrink-0 z-20 pointer-events-auto">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Secure</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Warning</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> High Risk / Critical</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" /> PCAP Evidence</span>
              <span className="flex items-center gap-1.5 text-slate-400"><span className="w-4 h-0.5 bg-blue-500" /> — Relationship</span>
            </div>
            <span className="text-slate-400 hidden sm:inline">Drag nodes or drag canvas to pan · Click any node to inspect</span>
          </div>
        </div>

        {/* ── RIGHT: Node Inspector Panel (28% -> lg:col-span-4 or 3) ── */}
        <div className="lg:col-span-4 xl:col-span-3 card p-4 bg-slate-900 border-slate-800 flex flex-col justify-between min-h-0 overflow-y-auto scroll-region font-mono">
          {selectedNode ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase block">
                    NODE INSPECTOR
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-100 font-grotesk">
                    {selectedNode.category}
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  ID: {selectedNode.id}
                </span>
              </div>

              {/* Title & Section Header */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">
                  {selectedNode.details.sectionHeader || 'FORENSIC ITEM'}
                </span>
                <h4 className="text-xs font-bold text-blue-400 break-all font-grotesk">
                  {selectedNode.details.title}
                </h4>
              </div>

              {/* Property Details Grid */}
              <div className="space-y-2 text-xs">
                {selectedNode.details.properties.map((prop, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg border ${
                      prop.isWarning
                        ? 'bg-red-950/30 border-red-900/60 text-red-300'
                        : prop.isNotAvailable
                        ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-200'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 font-bold block uppercase mb-0.5">
                      {prop.label}
                    </span>
                    <span className="text-xs font-bold font-mono break-all leading-snug">
                      {prop.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Forensic Notes & Digital Forensics Transparency */}
              {selectedNode.details.forensicNotes && (
                <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-900/50 space-y-1 text-[11px] text-blue-300">
                  <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span>FORENSIC VERIFICATION NOTES</span>
                  </div>
                  <p className="text-[11px] leading-relaxed font-sans text-slate-300">
                    {selectedNode.details.forensicNotes}
                  </p>
                </div>
              )}

              {/* Forensic Evidence Confidence */}
              {selectedNode.details.evidenceConfidence && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                  <span className="text-slate-400">Evidence Confidence:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      selectedNode.details.evidenceConfidence === 'HIGH'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : selectedNode.details.evidenceConfidence === 'LIMITED'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {selectedNode.details.evidenceConfidence}
                  </span>
                </div>
              )}

              {/* Action Buttons for Navigation */}
              <div className="pt-2 space-y-2">
                {selectedNode.details.navTarget && (
                  <button
                    onClick={() => router.push(selectedNode.details.navTarget!.path)}
                    className="btn-primary w-full py-2.5 text-xs font-bold font-grotesk gap-2 rounded-xl"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View {selectedNode.details.navTarget.type.toUpperCase()} Target</span>
                  </button>
                )}

                <button
                  onClick={toggleTraceFinding}
                  className="btn-ghost w-full py-2 text-xs font-bold font-grotesk gap-2 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Trace Finding Dependencies</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 space-y-3">
              <HelpCircle className="w-10 h-10 mx-auto text-slate-600 animate-bounce" />
              <p className="text-xs font-mono">
                Click any node in the relationship graph to inspect cryptographic details and evidence.
              </p>
            </div>
          )}

          {/* Inspector Footer */}
          <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between shrink-0 mt-4">
            <span>PRAVAAH Forensics v1.0</span>
            <span className="text-emerald-400 font-bold">● Active Tap</span>
          </div>
        </div>
      </div>
    </div>
  );
};
