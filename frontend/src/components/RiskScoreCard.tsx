'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ShieldX, AlertTriangle, TrendingDown, TrendingUp, Activity, Cpu } from 'lucide-react';

interface RiskScoreCardProps {
  score: number;
  category: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  filename?: string;
  totalSessions?: number;
}

const CFG = {
  CRITICAL: {
    color: '#f87171', glow: 'rgba(248,113,113,0.3)',
    bg: 'rgba(248,113,113,0.06)', border: 'rgba(248,113,113,0.22)',
    badge: 'text-red-400 bg-red-500/10 border-red-500/20',
    icon: ShieldX, label: 'Critical Risk',
    desc: 'Immediate remediation required. Multiple severe cryptographic vulnerabilities detected across sessions.',
    track: '#2a0a0a',
  },
  HIGH: {
    color: '#fb923c', glow: 'rgba(251,146,60,0.3)',
    bg: 'rgba(251,146,60,0.06)', border: 'rgba(251,146,60,0.22)',
    badge: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    icon: ShieldAlert, label: 'High Risk',
    desc: 'Significant cryptographic weaknesses detected. Prioritize remediation within 48 hours.',
    track: '#2a1200',
  },
  MODERATE: {
    color: '#fbbf24', glow: 'rgba(251,191,36,0.3)',
    bg: 'rgba(251,191,36,0.06)', border: 'rgba(251,191,36,0.22)',
    badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    icon: AlertTriangle, label: 'Moderate Risk',
    desc: 'Some cryptographic issues detected. Review and address within the standard maintenance cycle.',
    track: '#1a1500',
  },
  LOW: {
    color: '#34d399', glow: 'rgba(52,211,153,0.3)',
    bg: 'rgba(52,211,153,0.06)', border: 'rgba(52,211,153,0.22)',
    badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    icon: ShieldCheck, label: 'Low Risk',
    desc: 'Cryptographic posture meets modern security standards. Continue monitoring.',
    track: '#001a10',
  },
};

/* Animated number counter */
function AnimatedCount({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = 16;
    const inc = target / (duration / step);
    const timer = setInterval(() => {
      start += inc;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{count}</>;
}

/* 3D gauge arc */
function GaugeArc3D({ score, color, track }: { score: number; color: string; track: string }) {
  const r = 56;
  const cx = 72;
  const cy = 72;
  const halfCirc = Math.PI * r;
  const offset = halfCirc - (score / 100) * halfCirc;

  /* Tip dot position along the arc */
  const angle = Math.PI - (score / 100) * Math.PI; // 0=left end, PI=right end inverted
  const dotX = cx - r * Math.cos(angle);
  const dotY = cy - r * Math.sin(angle);

  return (
    <svg width="144" height="84" viewBox="0 0 144 84">
      {/* Drop shadow filter */}
      <defs>
        <filter id="gaugeShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={color} floodOpacity="0.5" />
        </filter>
        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>

      {/* Background track */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke={track} strokeWidth="10" strokeLinecap="round"
      />
      {/* Glow halo */}
      <motion.path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
        strokeDasharray={halfCirc} initial={{ strokeDashoffset: halfCirc }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.4, ease: 'easeOut', delay: 0.1 }}
        opacity={0.18}
      />
      {/* Main arc */}
      <motion.path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="url(#gaugeGrad)" strokeWidth="10" strokeLinecap="round"
        strokeDasharray={halfCirc} initial={{ strokeDashoffset: halfCirc }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.4, ease: [0.34, 1.2, 0.64, 1], delay: 0.1 }}
        filter="url(#gaugeShadow)"
      />
      {/* Tip dot */}
      <motion.circle
        r="6" fill={color}
        filter="url(#gaugeShadow)"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ cx: dotX, cy: dotY, opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.34, 1.2, 0.64, 1], delay: 0.1 }}
      />
      <motion.circle
        r="10" fill={color} opacity={0.2}
        initial={{ opacity: 0 }}
        animate={{ cx: dotX, cy: dotY, opacity: [0, 0.3, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
      />
    </svg>
  );
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ score, category, filename, totalSessions }) => {
  const cfg = CFG[category] || CFG.LOW;
  const Icon = cfg.icon;
  const isGood = category === 'LOW';
  const cardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-80, 80], [4, -4]), { stiffness: 200, damping: 30 });
  const rotY = useSpring(useTransform(mx, [-160, 160], [-3, 3]), { stiffness: 200, damping: 30 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    mx.set(e.clientX - r.left - r.width / 2);
    my.set(e.clientY - r.top - r.height / 2);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouse}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        rotateX: rotX, rotateY: rotY,
        transformStyle: 'preserve-3d',
        background: `linear-gradient(135deg, ${cfg.bg} 0%, var(--card) 100%)`,
        border: `1px solid ${cfg.border}`,
        boxShadow: `0 0 48px ${cfg.glow}, var(--shadow-elevated)`,
      }}
      className="relative rounded-2xl overflow-hidden"
    >
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />
      {/* Corner glow */}
      <div
        className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: cfg.color }}
      />
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)` }}
      />

      <div className="relative p-6 sm:p-8" style={{ transform: 'translateZ(8px)' }}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8">

          {/* ── Gauge + score ── */}
          <div className="flex items-end gap-5 shrink-0">
            <div className="relative">
              <GaugeArc3D score={score} color={cfg.color} track={cfg.track} />
              {/* Score overlay */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center leading-none">
                <span className="text-[32px] font-black font-grotesk" style={{ color: cfg.color }}>
                  <AnimatedCount target={score} />
                </span>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-faint)' }}>/100</span>
              </div>
            </div>

            {/* Risk badge */}
            <div className="mb-1 space-y-2">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border uppercase tracking-wider ${cfg.badge}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cfg.label}
              </div>
              <div className="flex items-center gap-1.5">
                {isGood
                  ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  : <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                }
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  {isGood ? 'Posture meets standards' : 'Action required'}
                </span>
              </div>
            </div>
          </div>

          {/* ── Details ── */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Cpu className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--text-faint)' }}>
                  Cryptographic Security Posture Score
                </span>
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {cfg.desc}
              </p>
            </div>

            {/* Meta chips */}
            {(filename || totalSessions !== undefined) && (
              <div className="flex flex-wrap gap-2">
                {filename && (
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px]"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  >
                    <span style={{ color: 'var(--text-faint)' }}>PCAP</span>
                    <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{filename}</span>
                  </div>
                )}
                {totalSessions !== undefined && (
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px]"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  >
                    <Activity className="w-3.5 h-3.5" style={{ color: 'var(--text-faint)' }} />
                    <span style={{ color: 'var(--text-faint)' }}>Sessions</span>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{totalSessions}</span>
                  </div>
                )}
              </div>
            )}

            {/* Score bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono" style={{ color: 'var(--text-faint)' }}>
                <span>0 — Critical</span><span>50 — Moderate</span><span>100 — Safe</span>
              </div>
              <div
                className="relative h-2.5 rounded-full overflow-hidden"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
              >
                {/* Background segments */}
                <div className="absolute inset-0 flex">
                  <div className="flex-1 bg-red-500/10" />
                  <div className="flex-1 bg-amber-500/10" />
                  <div className="flex-1 bg-emerald-500/10" />
                </div>
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1.4, ease: [0.34, 1.2, 0.64, 1], delay: 0.2 }}
                  style={{
                    background: `linear-gradient(90deg, ${cfg.color}bb, ${cfg.color})`,
                    boxShadow: `0 0 12px ${cfg.glow}`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
