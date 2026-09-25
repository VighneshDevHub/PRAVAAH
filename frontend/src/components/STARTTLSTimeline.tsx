import React from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, Lock, Unlock } from 'lucide-react';

interface STARTTLSTimelineProps {
  status: string; // 'STARTTLS_SUCCESS' | 'STARTTLS_NOT_ADVERTISED' | 'STARTTLS_REJECTED' | 'CLEARTEXT' | string
  protocol?: string; // 'SMTP' | 'IMAP' | 'POP3'
}

export const STARTTLSTimeline: React.FC<STARTTLSTimelineProps> = ({
  status,
  protocol = 'SMTP',
}) => {
  const isPlaintextOnly = status === 'CLEARTEXT' || status === 'STARTTLS_NOT_ADVERTISED';
  const isPolicyDeviation = status === 'STARTTLS_REJECTED' || isPlaintextOnly;

  const steps = [
    { label: `${protocol} PLAINTEXT`, sub: 'Initial TCP Connect' },
    { label: protocol === 'SMTP' ? 'EHLO / CAPABILITY' : 'CAPABILITY', sub: 'Feature Discovery' },
    { label: 'STARTTLS ADVERTISED', sub: 'Server Capability' },
    { label: 'STARTTLS REQUEST', sub: 'Client Command' },
    { label: 'TLS NEGOTIATION', sub: 'Handshake Initiated' },
    { label: 'ENCRYPTED SESSION', sub: 'TLS Secured Tunnel' },
  ];

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            {isPolicyDeviation ? (
              <Unlock className="w-4 h-4 text-amber-500" />
            ) : (
              <Lock className="w-4 h-4 text-emerald-500" />
            )}
            STARTTLS Protocol State Machine Transition
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Observing in-band upgrade from unencrypted protocol command stream to TLS encryption layer.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isPolicyDeviation ? (
            <span className="badge badge-medium flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> POLICY DEVIATION / UNENCRYPTED
            </span>
          ) : (
            <span className="badge badge-low flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> NORMAL ENCRYPTED TRANSITION
            </span>
          )}
        </div>
      </div>

      {/* Visual Pipeline Sequence */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-2">
        {steps.map((step, i) => {
          const isCurrentOrPassed = !isPolicyDeviation || i < 3;
          const isFailedStep = isPolicyDeviation && i >= 3;

          return (
            <div
              key={step.label}
              className={`p-3 rounded-lg border text-center relative flex flex-col justify-between ${
                isFailedStep
                  ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300'
                  : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div>
                <span className="text-[10px] font-mono text-slate-400 block mb-1">
                  STAGE 0{i + 1}
                </span>
                <p className="text-xs font-bold font-mono tracking-tight leading-snug">
                  {step.label}
                </p>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-mono">
                {step.sub}
              </p>

              {/* Status indicator */}
              <div className="mt-2 flex justify-center">
                {isFailedStep ? (
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 font-mono">NOT OBSERVED</span>
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
