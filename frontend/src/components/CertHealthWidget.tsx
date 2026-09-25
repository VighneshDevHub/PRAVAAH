'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle, AlertTriangle, XCircle, Clock, Key, ShieldX } from 'lucide-react';
import { Session } from '../lib/types';

interface Props { sessions: Session[]; }

function RingProgress({ value, color, size = 96, stroke = 8 }: {
  value: number; color: string; size?: number; stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg width={size} height={size} className="progress-ring">
      <defs>
        <filter id="ringGlow">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={color} floodOpacity="0.6" />
        </filter>
      </defs>
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
      {/* Progress */}
      <motion.circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: [0.34, 1.1, 0.64, 1], delay: 0.15 }}
        filter="url(#ringGlow)"
      />
      {/* Glow halo */}
      <motion.circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke + 4}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: [0.34, 1.1, 0.64, 1], delay: 0.15 }}
        opacity={0.12}
      />
    </svg>
  );
}

function MetricCell({
  icon: Icon, label, value, color, delay = 0,
}: {
  icon: React.ElementType; label: string; value: number | string; color: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl text-center"
      style={{
        background: `${color}0c`,
        border: `1px solid ${color}25`,
      }}
    >
      <Icon className="w-4 h-4 mb-0.5" style={{ color }} />
      <span className="text-[18px] font-black font-grotesk leading-none" style={{ color }}>
        {value}
      </span>
      <span className="text-[10px] font-semibold leading-tight text-center" style={{ color: 'var(--text-faint)' }}>
        {label}
      </span>
    </motion.div>
  );
}

export const CertHealthWidget: React.FC<Props> = ({ sessions }) => {
  const stats = useMemo(() => {
    const withCerts = sessions.filter(s => s.cert_subject);
    const total     = withCerts.length;
    if (!total) return null;

    const selfSigned  = withCerts.filter(s => s.is_self_signed).length;
    const expired     = withCerts.filter(s => s.cert_days_remaining !== undefined && s.cert_days_remaining < 0).length;
    const expiring30  = withCerts.filter(s => s.cert_days_remaining !== undefined && s.cert_days_remaining >= 0 && s.cert_days_remaining <= 30).length;
    const weakKey     = withCerts.filter(s => s.cert_key_alg === 'RSA' && s.cert_key_length !== undefined && s.cert_key_length < 2048).length;
    const valid       = total - selfSigned - expired - weakKey;

    const pSelf    = total ? (selfSigned / total) * 100 : 0;
    const pExpired = total ? (expired    / total) * 100 : 0;
    const pWeak    = total ? (weakKey    / total) * 100 : 0;
    const health   = Math.max(0, Math.round(100 - pSelf * 0.3 - pExpired * 0.4 - pWeak * 0.3));

    return { total, selfSigned, expired, expiring30, weakKey, valid, health };
  }, [sessions]);

  const healthColor =
    !stats ? '#4f8ef7'
    : stats.health >= 80 ? '#34d399'
    : stats.health >= 50 ? '#fbbf24'
    : '#f87171';

  return (
    <div className="card p-5 h-full" style={{ background: 'var(--card)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${healthColor}18`, border: `1px solid ${healthColor}30` }}
        >
          <Award className="w-4.5 h-4.5" style={{ color: healthColor }} />
        </div>
        <div>
          <h3 className="text-[14px] font-bold font-grotesk" style={{ color: 'var(--text-primary)' }}>
            Certificate Health
          </h3>
          <p className="text-[11px]" style={{ color: 'var(--text-faint)' }}>
            X.509 certificate audit across sessions
          </p>
        </div>
      </div>

      {!stats ? (
        <div className="flex flex-col items-center justify-center h-40 gap-2">
          <Award className="w-8 h-8" style={{ color: 'var(--text-faint)' }} />
          <p className="text-[13px]" style={{ color: 'var(--text-faint)' }}>No certificates to audit</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Ring */}
          <div className="relative shrink-0">
            <RingProgress value={stats.health} color={healthColor} size={100} stroke={9} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[22px] font-black font-grotesk" style={{ color: healthColor }}>
                {stats.health}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: 'var(--text-faint)' }}>
                health
              </span>
            </div>
          </div>

          {/* Metrics grid */}
          <div className="flex-1 w-full grid grid-cols-3 gap-2">
            <MetricCell icon={CheckCircle}    label="Extracted"    value={stats.total}      color="#4f8ef7" delay={0.05} />
            <MetricCell icon={ShieldX}        label="Self-Signed"  value={stats.selfSigned} color="#f87171" delay={0.10} />
            <MetricCell icon={XCircle}        label="Expired"      value={stats.expired}    color="#fb923c" delay={0.15} />
            <MetricCell icon={Clock}          label="Expiring <30d" value={stats.expiring30} color="#fbbf24" delay={0.20} />
            <MetricCell icon={Key}            label="Weak Key"     value={stats.weakKey}    color="#a78bfa" delay={0.25} />
            <MetricCell icon={CheckCircle}    label="Valid"        value={stats.valid}      color="#34d399" delay={0.30} />
          </div>
        </div>
      )}

      {/* Health score bar */}
      {stats && (
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-[10px]" style={{ color: 'var(--text-faint)' }}>
            <span>Certificate Health Score</span>
            <span className="font-bold font-mono" style={{ color: healthColor }}>{stats.health}/100</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${stats.health}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              style={{ background: `linear-gradient(90deg, ${healthColor}aa, ${healthColor})` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
