'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Network, Database, Lock, Award, Cpu, FileCheck, ChevronRight, Zap, ArrowRight } from 'lucide-react';

interface Stage {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  glow: string;
  gradFrom: string;
  gradTo: string;
  details: string;
  rfc: string;
  metrics: string;
  stat: string;
  statLabel: string;
}

const STAGES: Stage[] = [
  {
    id: 1, title: 'PCAP Ingress', subtitle: 'Packet Capture',
    icon: Network, color: '#38bdf8', glow: 'rgba(56,189,248,0.35)',
    gradFrom: '#0ea5e9', gradTo: '#38bdf8',
    details: 'Ingests raw .pcap and .pcapng network dumps. Applies zero-copy packet filtering for TCP ports 25, 587, 465 (SMTP), 143, 993 (IMAP), 110, 995 (POP3) with header-only parsing on non-email streams.',
    rfc: 'PCAP / PCAPNG', metrics: '~1.2 Gbps throughput', stat: '1.2 Gbps', statLabel: 'Throughput',
  },
  {
    id: 2, title: 'TCP Reassembly', subtitle: '5-Tuple Ordering',
    icon: Database, color: '#818cf8', glow: 'rgba(129,140,248,0.35)',
    gradFrom: '#6366f1', gradTo: '#818cf8',
    details: 'Pure-Python stream reassembly engine. Sorts TCP sequence numbers, reconstructs full bidirectional client/server payload streams keyed by {src_ip, src_port, dst_ip, dst_port, protocol}.',
    rfc: 'RFC 793 — TCP', metrics: '< 2.5ms per stream', stat: '2.5ms', statLabel: 'Per Stream',
  },
  {
    id: 3, title: 'TLS Engine', subtitle: 'JA3 / JA3S',
    icon: Lock, color: '#a78bfa', glow: 'rgba(167,139,250,0.35)',
    gradFrom: '#8b5cf6', gradTo: '#a78bfa',
    details: 'Parses binary ClientHello & ServerHello frames. Identifies cipher suites, key exchange (ECDHE/DHE/RSA), TLS version and computes JA3/JA3S MD5 fingerprints for threat intelligence matching.',
    rfc: 'RFC 8446 — TLS 1.3', metrics: '99.8% parse accuracy', stat: '99.8%', statLabel: 'Accuracy',
  },
  {
    id: 4, title: 'X.509 Vault', subtitle: 'Cert Validation',
    icon: Award, color: '#fbbf24', glow: 'rgba(251,191,36,0.35)',
    gradFrom: '#d97706', gradTo: '#fbbf24',
    details: 'Extracts X.509 DER certificates. Evaluates expiry, key lengths (RSA ≥ 2048, ECC ≥ 256), SHA-1/MD5 signature detection, SAN hostname alignment, and chain of trust via certifi root store.',
    rfc: 'RFC 5280 / 6125', metrics: 'Certifi root store', stat: '100%', statLabel: 'Trust Coverage',
  },
  {
    id: 5, title: 'XGBoost ML', subtitle: 'Risk Scoring',
    icon: Cpu, color: '#34d399', glow: 'rgba(52,211,153,0.35)',
    gradFrom: '#059669', gradTo: '#34d399',
    details: 'Constructs 12-dimensional feature vectors from session metadata. XGBoost predicts Cryptographic Posture Score (0–100). Isolation Forest detects statistically anomalous TLS handshake patterns.',
    rfc: 'NIST SP 800-52 Rev 2', metrics: '< 1.0ms inference', stat: '<1ms', statLabel: 'Inference',
  },
  {
    id: 6, title: 'Audit Vault', subtitle: 'JSON / HTML / PDF',
    icon: FileCheck, color: '#f472b6', glow: 'rgba(244,114,182,0.35)',
    gradFrom: '#ec4899', gradTo: '#f472b6',
    details: 'Generates structured JSON, styled HTML, and print-ready PDF forensic reports with prioritized NIST SP 800-52 Rev 2 remediation roadmaps, standards citations, and session-level drill-down.',
    rfc: 'NIST SP 800-52 §3.1', metrics: '3 export formats', stat: '3 Formats', statLabel: 'Export Types',
  },
];

/* Tilt card wrapper */
function TiltCard({
  children,
  className = '',
  style = {},
  onClick,
  isSelected,
  color,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  isSelected: boolean;
  color: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-50, 50], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-50, 50], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', ...style }}
      whileHover={{ scale: 1.04, z: 20 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* Animated SVG connector */
function Connector({ active, color }: { active: boolean; color: string }) {
  return (
    <div className="hidden lg:flex items-center justify-center w-8 shrink-0 mt-[-8px]">
      <svg width="32" height="16" viewBox="0 0 32 16">
        <line x1="0" y1="8" x2="32" y2="8" stroke="var(--border-bright)" strokeWidth="1.5" strokeDasharray="3 3" />
        {active && (
          <motion.line
            x1="0" y1="8" x2="32" y2="8"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
        )}
        <motion.circle
          cx="28" cy="8" r="3"
          fill={active ? color : 'var(--border-bright)'}
          animate={{ scale: active ? [1, 1.4, 1] : 1 }}
          transition={{ duration: 1, repeat: active ? Infinity : 0 }}
        />
      </svg>
    </div>
  );
}

export const Pipeline3DVisualizer: React.FC = () => {
  const [selected, setSelected] = useState<Stage>(STAGES[0]);

  return (
    <div
      className="card p-6 sm:p-8 relative overflow-hidden"
      style={{ background: 'var(--card)' }}
    >
      {/* Background mesh */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--text-primary) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none blur-3xl opacity-10"
        style={{ background: `radial-gradient(ellipse, ${selected.color}, transparent)` }}
      />

      {/* Header */}
      <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8">
        <div>
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold mb-3"
            style={{
              background: 'var(--primary-dim)',
              border: '1px solid var(--primary-border)',
              color: 'var(--primary)',
            }}
          >
            <Zap className="w-3 h-3 animate-pulse" />
            Interactive Pipeline Architecture
          </div>
          <h3
            className="text-xl sm:text-2xl font-bold font-grotesk tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            6-Stage Passive Cryptographic Analysis
          </h3>
          <p className="text-[13px] mt-1" style={{ color: 'var(--text-muted)' }}>
            Click any node to inspect stage specs, RFC references, and performance metrics
          </p>
        </div>
        {/* Active stage indicator */}
        <div
          className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px] font-semibold"
          style={{
            background: `${selected.color}15`,
            border: `1px solid ${selected.color}35`,
            color: selected.color,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: selected.color }} />
          Stage {selected.id} Active
        </div>
      </div>

      {/* Stage nodes */}
      <div className="relative flex flex-wrap lg:flex-nowrap items-stretch gap-2 lg:gap-0 perspective-1000">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isSelected = selected.id === stage.id;
          const isPrev = stage.id < selected.id;

          return (
            <React.Fragment key={stage.id}>
              <TiltCard
                isSelected={isSelected}
                color={stage.color}
                onClick={() => setSelected(stage)}
                className="flex-1 min-w-[130px] lg:min-w-0"
                style={{
                  background: isSelected
                    ? `linear-gradient(135deg, ${stage.gradFrom}22, ${stage.gradTo}12)`
                    : 'var(--surface)',
                  border: isSelected
                    ? `1px solid ${stage.color}50`
                    : '1px solid var(--border)',
                  borderRadius: '16px',
                  boxShadow: isSelected
                    ? `0 0 32px ${stage.glow}, 0 8px 24px rgba(0,0,0,0.3)`
                    : '0 2px 8px rgba(0,0,0,0.15)',
                  padding: '16px',
                }}
              >
                {/* Stage number badge */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{
                      background: isPrev || isSelected ? `${stage.color}18` : 'var(--surface-2)',
                      color: isPrev || isSelected ? stage.color : 'var(--text-faint)',
                    }}
                  >
                    0{stage.id}
                  </span>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: stage.color,
                        boxShadow: `0 0 8px ${stage.color}`,
                        animation: 'pulseRing 2s infinite',
                      }}
                    />
                  )}
                  {isPrev && !isSelected && (
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: stage.color, opacity: 0.6 }}
                    />
                  )}
                </div>

                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${stage.gradFrom}28, ${stage.gradTo}18)`,
                    border: `1px solid ${stage.color}30`,
                    boxShadow: isSelected ? `0 0 20px ${stage.glow}` : 'none',
                    transform: 'translateZ(12px)',
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: stage.color }} />
                </div>

                {/* Text */}
                <h4
                  className="text-[13px] font-bold leading-tight font-grotesk"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {stage.title}
                </h4>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {stage.subtitle}
                </p>

                {/* Stat */}
                <div
                  className="mt-2.5 inline-block font-mono text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{ color: stage.color, background: `${stage.color}18` }}
                >
                  {stage.stat}
                </div>

                {/* Selection ring */}
                {isSelected && (
                  <motion.div
                    layoutId="pipeline-ring"
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ border: `2px solid ${stage.color}60` }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </TiltCard>

              {/* Connector */}
              {idx < STAGES.length - 1 && (
                <Connector active={stage.id < selected.id} color={STAGES[idx + 1].color} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Details panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="mt-6 rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${selected.gradFrom}10, var(--surface))`,
            border: `1px solid ${selected.color}28`,
          }}
        >
          {/* Corner glow */}
          <div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ background: selected.color }}
          />

          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
            {/* Left: description */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2.5 mb-2">
                <span className="text-[15px] font-bold font-grotesk" style={{ color: selected.color }}>
                  Stage {selected.id} — {selected.title}
                </span>
                <span
                  className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-lg"
                  style={{
                    color: selected.color,
                    background: `${selected.color}18`,
                    border: `1px solid ${selected.color}28`,
                  }}
                >
                  {selected.rfc}
                </span>
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {selected.details}
              </p>
            </div>

            {/* Right: performance metric */}
            <div
              className="shrink-0 text-center px-5 py-4 rounded-xl min-w-[120px]"
              style={{
                background: `${selected.color}10`,
                border: `1px solid ${selected.color}22`,
              }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-faint)' }}>
                {selected.statLabel}
              </p>
              <p className="font-mono text-lg font-bold" style={{ color: selected.color }}>
                {selected.stat}
              </p>
              <div className="flex items-center justify-center gap-1 mt-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-semibold">Active</span>
              </div>
            </div>
          </div>

          {/* Stage progress bar */}
          <div className="mt-4 flex items-center gap-2">
            {STAGES.map((s) => (
              <motion.button
                key={s.id}
                onClick={() => setSelected(s)}
                className="flex-1 h-1 rounded-full transition-all"
                style={{
                  background: s.id <= selected.id ? s.color : 'var(--border)',
                  opacity: s.id === selected.id ? 1 : s.id < selected.id ? 0.6 : 0.3,
                }}
                whileHover={{ scaleY: 2.5 }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
