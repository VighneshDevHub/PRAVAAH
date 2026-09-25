import React from 'react';
import { CheckCircle2, XCircle, HelpCircle, Info } from 'lucide-react';

export type EvidenceStateType = 'OBSERVED' | 'NOT_OBSERVED' | 'NOT_DETERMINABLE';

interface EvidenceStatusProps {
  status: EvidenceStateType;
  label?: string;
  reason?: string;
  compact?: boolean;
}

export const EvidenceStatus: React.FC<EvidenceStatusProps> = ({
  status,
  label,
  reason,
  compact = false,
}) => {
  if (status === 'OBSERVED') {
    return (
      <div className={`inline-flex items-center gap-1.5 ${compact ? 'text-[11px]' : 'text-xs'} font-semibold text-emerald-600 dark:text-emerald-400`}>
        <CheckCircle2 className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-emerald-500`} />
        <span>{label || 'OBSERVED'}</span>
      </div>
    );
  }

  if (status === 'NOT_OBSERVED') {
    return (
      <div className={`inline-flex items-center gap-1.5 ${compact ? 'text-[11px]' : 'text-xs'} font-semibold text-slate-500 dark:text-slate-400`}>
        <XCircle className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-slate-400`} />
        <span>{label || 'NOT OBSERVED'}</span>
      </div>
    );
  }

  // NOT_DETERMINABLE state
  return (
    <div className="inline-flex flex-col gap-0.5">
      <div
        className={`inline-flex items-center gap-1.5 ${compact ? 'text-[11px]' : 'text-xs'} font-semibold px-2 py-0.5 rounded border border-amber-300 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300`}
        title={reason || 'Evidence unavailable or unobservable in passive capture frame stream.'}
      >
        <HelpCircle className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-amber-500 shrink-0`} />
        <span>{label || 'NOT DETERMINABLE'}</span>
      </div>
      {reason && !compact && (
        <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
          <Info className="w-3 h-3 text-slate-400 shrink-0" />
          {reason}
        </span>
      )}
    </div>
  );
};
