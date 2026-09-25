'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  RadialBarChart, RadialBar,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

interface Props { smtp: number; imap: number; pop3: number; }

const PROTOCOLS = [
  { key: 'smtp', label: 'SMTP',  color: '#4f8ef7', ports: '25 · 587 · 465' },
  { key: 'imap', label: 'IMAP',  color: '#a78bfa', ports: '143 · 993' },
  { key: 'pop3', label: 'POP3',  color: '#14d9c5', ports: '110 · 995' },
];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className="px-3 py-2.5 rounded-xl text-[12px] shadow-xl"
      style={{
        background: 'var(--card)',
        border: `1px solid ${d.color}40`,
        boxShadow: `0 0 20px ${d.color}20`,
      }}
    >
      <div className="font-bold font-grotesk" style={{ color: d.color }}>{d.label}</div>
      <div style={{ color: 'var(--text-secondary)' }}>
        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{d.value}</span> sessions
      </div>
      <div style={{ color: 'var(--text-faint)' }}>{d.percent.toFixed(1)}% of traffic</div>
    </div>
  );
}

export const ProtocolDistribution: React.FC<Props> = ({ smtp, imap, pop3 }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const total = smtp + imap + pop3;

  const data = PROTOCOLS.map(p => ({
    ...p,
    value: p.key === 'smtp' ? smtp : p.key === 'imap' ? imap : pop3,
    percent: total > 0 ? ((p.key === 'smtp' ? smtp : p.key === 'imap' ? imap : pop3) / total) * 100 : 0,
  })).filter(d => d.value > 0);

  const isEmpty = total === 0;

  return (
    <div className="card p-5 h-full" style={{ background: 'var(--card)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'var(--primary-dim)', border: '1px solid var(--primary-border)' }}
        >
          <BarChart3 className="w-4.5 h-4.5" style={{ color: 'var(--primary)' }} />
        </div>
        <div>
          <h3 className="text-[14px] font-bold font-grotesk" style={{ color: 'var(--text-primary)' }}>
            Protocol Distribution
          </h3>
          <p className="text-[11px]" style={{ color: 'var(--text-faint)' }}>
            {total} total sessions across email protocols
          </p>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-40 gap-2">
          <BarChart3 className="w-8 h-8" style={{ color: 'var(--text-faint)' }} />
          <p className="text-[13px]" style={{ color: 'var(--text-faint)' }}>No session data yet</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Donut chart */}
          <div className="relative shrink-0">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={data}
                  cx={75} cy={75}
                  innerRadius={46}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={(_, i) => setHovered(data[i].key)}
                  onMouseLeave={() => setHovered(null)}
                  strokeWidth={0}
                >
                  {data.map((entry, i) => (
                    <Cell
                      key={entry.key}
                      fill={entry.color}
                      opacity={hovered && hovered !== entry.key ? 0.4 : 1}
                      style={{
                        filter: hovered === entry.key ? `drop-shadow(0 0 8px ${entry.color}80)` : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center total */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black font-grotesk" style={{ color: 'var(--text-primary)' }}>
                {total}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-faint)' }}>
                sessions
              </span>
            </div>
          </div>

          {/* Legend + bars */}
          <div className="flex-1 w-full space-y-3">
            {PROTOCOLS.map(proto => {
              const val = proto.key === 'smtp' ? smtp : proto.key === 'imap' ? imap : pop3;
              const pct = total > 0 ? (val / total) * 100 : 0;
              const isHov = hovered === proto.key;
              return (
                <motion.div
                  key={proto.key}
                  onHoverStart={() => setHovered(proto.key)}
                  onHoverEnd={() => setHovered(null)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{
                          background: proto.color,
                          boxShadow: isHov ? `0 0 8px ${proto.color}` : 'none',
                        }}
                      />
                      <span
                        className="text-[12px] font-bold font-mono"
                        style={{ color: isHov ? proto.color : 'var(--text-primary)' }}
                      >
                        {proto.label}
                      </span>
                      <span className="text-[10px]" style={{ color: 'var(--text-faint)' }}>
                        {proto.ports}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                        {val}
                      </span>
                      <span
                        className="text-[11px] font-bold font-mono"
                        style={{ color: proto.color }}
                      >
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  {/* Bar */}
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: 'var(--surface-2)' }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
                      style={{
                        background: `linear-gradient(90deg, ${proto.color}bb, ${proto.color})`,
                        boxShadow: isHov ? `0 0 10px ${proto.color}60` : 'none',
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
