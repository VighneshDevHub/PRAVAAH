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

export const STAGE_COLUMNS = [
  { stage: 1, label: 'EMAIL DOMAIN', x: 50 },
  { stage: 2, label: 'MAIL SERVER', x: 270 },
  { stage: 3, label: 'EMAIL SESSION', x: 490 },
  { stage: 4, label: 'STARTTLS / TLS', x: 710 },
  { stage: 5, label: 'CRYPTO PARAMS', x: 930 },
  { stage: 6, label: 'CERTIFICATE', x: 1150 },
  { stage: 7, label: 'SECURITY FINDING', x: 1370 },
  { stage: 8, label: 'EVIDENCE', x: 1590 },
  { stage: 9, label: 'RECOMMENDATION', x: 1810 },
];

const INITIAL_NODES: GraphNode[] = [
  // ── STAGE 1: EMAIL DOMAIN ──
  {
    id: 'node-domain',
    category: 'EMAIL DOMAIN',
    label: 'enterprise.gov',
    subtitle: 'Primary Govt Domain',
    status: 'good',
    statusText: 'Verified Active',
    icon: Globe,
    x: 50,
    y: 260,
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

  // ── STAGE 2: MAIL SERVER ──
  {
    id: 'node-server',
    category: 'MAIL SERVER',
    label: 'mail.enterprise.gov:587',
    subtitle: 'SMTP Submission Endpoint',
    status: 'good',
    statusText: 'Online (Port 587)',
    icon: Server,
    x: 270,
    y: 260,
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

  // ── STAGE 3: EMAIL SESSION ──
  {
    id: 'node-session-42',
    category: 'EMAIL SESSION',
    label: 'Session #042',
    subtitle: 'SMTP / STARTTLS Stream',
    status: 'good',
    statusText: 'Completed (Secure)',
    icon: Activity,
    x: 490,
    y: 120,
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
    y: 400,
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

  // ── STAGE 4: STARTTLS / TLS ──
  {
    id: 'node-starttls',
    category: 'STARTTLS',
    label: 'Upgrade Offered',
    subtitle: 'RFC 3207 Upgraded',
    status: 'good',
    statusText: 'Upgrade Verified',
    icon: Zap,
    x: 710,
    y: 120,
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
    id: 'node-tls12',
    category: 'STARTTLS / TLS',
    label: 'Direct TLS 1.2',
    subtitle: 'Implicit Secure Port',
    status: 'warning',
    statusText: 'Legacy Protocol',
    icon: Key,
    x: 710,
    y: 400,
    details: {
      title: 'Direct TLS Handshake Telemetry',
      sectionHeader: 'Handshake & Cipher Details',
      properties: [
        { label: 'TLS VERSION', value: 'TLS 1.2 (0x0303)' },
        { label: 'CIPHER SUITE', value: 'TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256', isWarning: true },
        { label: 'FORWARD SECRECY', value: 'Supported (ECDHE_P256)' },
        { label: 'POLICY WARNING', value: 'NIST SP 800-52 recommends TLS 1.3 default' },
      ],
      evidenceConfidence: 'HIGH',
      forensicNotes: 'TLS 1.2 in use. Legacy protocol negotiation observed without TLS 1.3 support.',
    },
  },

  // ── STAGE 5: CRYPTO PARAMS ──
  {
    id: 'node-tls13',
    category: 'CRYPTO PARAMS',
    label: 'TLS 1.3 / X25519',
    subtitle: 'AES-256-GCM + PFS',
    status: 'good',
    statusText: 'Modern Cipher',
    icon: Lock,
    x: 930,
    y: 120,
    details: {
      title: 'Cryptographic Parameters & Key Exchange',
      sectionHeader: 'Handshake & Cipher Details',
      properties: [
        { label: 'TLS VERSION', value: 'TLS 1.3 (0x0304)' },
        { label: 'CIPHER SUITE', value: 'TLS_AES_256_GCM_SHA384 (0x1302)' },
        { label: 'KEY EXCHANGE', value: 'X25519 (ECDHE Forward Secrecy)' },
        { label: 'FORWARD SECRECY', value: 'YES (Perfect Forward Secrecy Active)' },
        { label: 'ALPN PROTOCOL', value: 'smtp' },
      ],
      evidenceConfidence: 'HIGH',
      forensicNotes: 'TLS 1.3 1-RTT handshake verified with forward secrecy key share.',
    },
  },
  {
    id: 'node-crypto-legacy',
    category: 'CRYPTO PARAMS',
    label: 'CBC Cipher Suite',
    subtitle: 'SHA-1 Signature',
    status: 'warning',
    statusText: 'Weak Parameters',
    icon: Lock,
    x: 930,
    y: 400,
    details: {
      title: 'Legacy Cryptographic Parameters',
      sectionHeader: 'Cryptographic Weakness Identification',
      properties: [
        { label: 'TLS VERSION', value: 'TLS 1.2' },
        { label: 'CIPHER BLOCK', value: 'AES-128-CBC (Vulnerable to LUCKY13)' },
        { label: 'SIGNATURE HASH', value: 'SHA-1 (Deprecated Signature Algorithm)', isWarning: true },
        { label: 'KEY SIZE', value: 'RSA 2048 bit' },
      ],
      evidenceConfidence: 'HIGH',
      forensicNotes: 'Handshake utilized legacy cipher suite with weak digest signature.',
    },
  },

  // ── STAGE 6: CERTIFICATE ──
  {
    id: 'node-cert-valid',
    category: 'CERTIFICATE',
    label: 'mail.enterprise.gov',
    subtitle: 'Valid (120 days left)',
    status: 'good',
    statusText: 'X.509 Valid',
    icon: Award,
    x: 1150,
    y: 120,
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
    x: 1150,
    y: 400,
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

  // ── STAGE 7: SECURITY FINDING ──
  {
    id: 'node-finding-low',
    category: 'SECURITY FINDING',
    label: 'Modern Baseline',
    subtitle: 'Hardened TLS 1.3',
    status: 'good',
    statusText: 'PASS (Low Risk)',
    icon: ShieldCheck,
    x: 1370,
    y: 120,
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
    subtitle: 'High Severity Issue',
    status: 'critical',
    statusText: 'HIGH / CRITICAL',
    icon: ShieldAlert,
    x: 1370,
    y: 400,
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

  // ── STAGE 8: EVIDENCE ──
  {
    id: 'node-evidence-ok',
    category: 'EVIDENCE',
    label: 'Session Audit Log',
    subtitle: 'Verified Compliant',
    status: 'evidence',
    statusText: 'Verified Log',
    icon: FileText,
    x: 1590,
    y: 120,
    details: {
      title: 'Compliant Session Evidence Log',
      sectionHeader: 'Audit Trace Records',
      properties: [
        { label: 'AUDIT RECORD ID', value: 'LOG-2026-9901' },
        { label: 'INTEGRITY HASH', value: 'SHA256: 4a8e991b0c...' },
        { label: 'STATUS', value: 'PASSED SECURITY POLICIES' },
      ],
      evidenceConfidence: 'HIGH',
      forensicNotes: 'Telemetry log registered clean TLS 1.3 handshake.',
    },
  },
  {
    id: 'node-pcap-evidence',
    category: 'EVIDENCE',
    label: 'PCAP Frame #18472',
    subtitle: 'TCP Stream #42',
    status: 'evidence',
    statusText: 'Captured Frame',
    icon: FileSearch,
    x: 1590,
    y: 400,
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

  // ── STAGE 9: RECOMMENDATION ──
  {
    id: 'node-recom-low',
    category: 'RECOMMENDATION',
    label: 'Continuous Monitor',
    subtitle: 'Maintain Baseline',
    status: 'good',
    statusText: 'Compliant',
    icon: CheckCircle2,
    x: 1810,
    y: 120,
    details: {
      title: 'Security Maintenance Guidance',
      sectionHeader: 'Operational Policy Maintenance',
      properties: [
        { label: 'RECOMMENDED ACTION', value: 'Maintain automated daily certificate renewal checks' },
        { label: 'NEXT REVIEW', value: '30 Days' },
      ],
      evidenceConfidence: 'HIGH',
      forensicNotes: 'No immediate action required.',
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
    x: 1810,
    y: 400,
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
  // Stage 1 -> Stage 2
  { id: 'e-dom-srv',     source: 'node-domain',      target: 'node-server',       label: 'hosts' },

  // Stage 2 -> Stage 3
  { id: 'e-srv-s42',     source: 'node-server',      target: 'node-session-42',   label: 'establishes' },
  { id: 'e-srv-s43',     source: 'node-server',      target: 'node-session-43',   label: 'establishes', status: 'warning' },

  // Stage 3 -> Stage 4
  { id: 'e-s42-stls',    source: 'node-session-42',  target: 'node-starttls',     label: 'upgrades via' },
  { id: 'e-s43-t12',     source: 'node-session-43',  target: 'node-tls12',        label: 'negotiates', status: 'warning' },

  // Stage 4 -> Stage 5
  { id: 'e-stls-t13',    source: 'node-starttls',    target: 'node-tls13',        label: 'negotiates' },
  { id: 'e-t12-crypto',  source: 'node-tls12',       target: 'node-crypto-legacy',label: 'uses legacy', status: 'warning' },

  // Stage 5 -> Stage 6
  { id: 'e-t13-cert1',   source: 'node-tls13',       target: 'node-cert-valid',   label: 'presents' },
  { id: 'e-crypto-cert2',source: 'node-crypto-legacy',target: 'node-cert-expired', label: 'binds to', status: 'warning' },

  // Stage 6 -> Stage 7
  { id: 'e-cert1-f1',    source: 'node-cert-valid',  target: 'node-finding-low',  label: 'verifies' },
  { id: 'e-cert2-f2',    source: 'node-cert-expired',target: 'node-finding-high',label: 'triggers', status: 'critical' },

  // Stage 7 -> Stage 8
  { id: 'e-f1-ev1',      source: 'node-finding-low', target: 'node-evidence-ok',  label: 'logged in' },
  { id: 'e-f2-pcap2',    source: 'node-finding-high',target: 'node-pcap-evidence',label: 'supported by', status: 'critical' },

  // Stage 8 -> Stage 9
  { id: 'e-ev1-r1',      source: 'node-evidence-ok', target: 'node-recom-low',   label: 'recommends' },
  { id: 'e-pcap2-r2',    source: 'node-pcap-evidence',target: 'node-recom-high',  label: 'remediates', status: 'warning' },
];

export const PostureGraph: React.FC = () => {
  const router = useRouter();
  const [nodes, setNodes] = useState<GraphNode[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-finding-high');
  const [searchQuery, setSearchQuery] = useState('');
  const [scale, setScale] = useState(0.78);
  const [pan, setPan] = useState({ x: 20, y: 30 });
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
      'node-crypto-legacy',
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
      'e-t12-crypto',
      'e-crypto-cert2',
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
    setScale(0.78);
    setPan({ x: 20, y: 30 });
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
                9-Stage Pipeline Online
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Structured forensic graph mapping DOMAIN → SERVER → SESSION → TLS → CRYPTO → CERT → FINDING → EVIDENCE → RECOMMENDATION.
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
              width: '2050px',
              height: '580px',
            }}
          >
            {/* ── STAGE PIPELINE HEADERS & COLUMN SWIMLANES ── */}
            <div className="absolute top-0 left-0 w-full pointer-events-none z-0">
              {STAGE_COLUMNS.map((col) => (
                <div
                  key={col.stage}
                  style={{ left: `${col.x}px`, width: '176px' }}
                  className="absolute top-3 flex flex-col items-center"
                >
                  <div className="w-full py-1.5 px-2 bg-slate-900/90 border border-slate-800 rounded-lg text-center font-mono shadow-md backdrop-blur-sm">
                    <span className="text-[9px] text-blue-400 font-extrabold block">STAGE 0{col.stage}</span>
                    <span className="text-[10px] text-slate-200 font-extrabold font-grotesk tracking-tight uppercase truncate block">
                      {col.label}
                    </span>
                  </div>
                  {/* Dotted Vertical Column Guide Line */}
                  <div
                    className="w-[1px] bg-slate-800/60 mt-2 border-r border-dashed border-slate-800"
                    style={{ height: '480px' }}
                  />
                </div>
              ))}

              {/* Parallel Track Row Labels */}
              <div className="absolute left-3 top-[100px] text-[10px] font-mono font-bold text-emerald-400/80 uppercase tracking-wider flex items-center gap-1 bg-emerald-950/40 border border-emerald-900/50 px-2 py-1 rounded-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                TRACK A: SECURE FLOW (TLS 1.3)
              </div>

              <div className="absolute left-3 top-[380px] text-[10px] font-mono font-bold text-red-400/80 uppercase tracking-wider flex items-center gap-1 bg-red-950/40 border border-red-900/50 px-2 py-1 rounded-md">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                TRACK B: INCIDENT FLOW (EXPIRED CERT)
              </div>
            </div>

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

                const srcX = srcNode.x + 88; // center offset of node card (width 176px)
                const srcY = srcNode.y + 40; // center offset of node card (height ~80px)
                const tgtX = tgtNode.x + 88;
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
