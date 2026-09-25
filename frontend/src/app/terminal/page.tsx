'use client';

import React, { useState } from 'react';
import { Terminal as TerminalIcon, Send, CornerDownLeft } from 'lucide-react';

export default function TerminalPage() {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<string[]>([
    'PRAVAAH Forensic CLI [Version 1.0.0]',
    'National Technical Research Organisation (NTRO) • SIH 26159',
    'Type "help" for a list of available analyst commands.',
    '------------------------------------------------------------------',
  ]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    const newLogs = [...logs, `pravaah-analyst$ ${cmd}`];

    if (cmd === 'help') {
      newLogs.push(
        'Available Analyst Commands:',
        '  jobs              List recent PCAP analysis jobs',
        '  analyze <job_id>   Run deep cryptographic posture evaluation',
        '  findings <job_id>  Output security findings for a job',
        '  rules             Display active RFC compliance rules',
        '  sample <name>     Trigger controlled synthetic test scenario',
        '  clear             Clear terminal screen'
      );
    } else if (cmd === 'jobs') {
      newLogs.push('Fetching active PCAP jobs...', 'JOB-042 | enterprise_mail_capture.pcap | COMPLETED | Score: 82');
    } else if (cmd === 'rules') {
      newLogs.push(
        'Active RFC Compliance Rules:',
        '  [RFC-8996] TLS 1.0/1.1 Deprecation Enforcement',
        '  [RFC-8314] Implicit TLS Default Specification',
        '  [RFC-3207] STARTTLS Security & Downgrade Prevention',
        '  [RFC-8461] MTA-STS Policy & Certificate Chain Validation'
      );
    } else if (cmd === 'clear') {
      setLogs([]);
      setInput('');
      return;
    } else {
      newLogs.push(`Command not recognized: "${cmd}". Type "help" for usage.`);
    }

    setLogs(newLogs);
    setInput('');
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold font-grotesk text-slate-900 dark:text-slate-100">
          Analyst Forensic CLI
        </h1>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          Embedded command line interface for direct forensic queries.
        </p>
      </div>

      <div className="card bg-slate-950 text-slate-100 p-5 rounded-xl border border-slate-800 font-mono text-xs space-y-4 min-h-[450px] flex flex-col justify-between">
        <div className="space-y-1.5 overflow-y-auto max-h-[380px] scroll-region">
          {logs.map((log, i) => (
            <div key={i} className={log.startsWith('pravaah-analyst$') ? 'text-blue-400 font-bold' : 'text-slate-300'}>
              {log}
            </div>
          ))}
        </div>

        <form onSubmit={handleCommand} className="flex items-center gap-2 border-t border-slate-800 pt-3">
          <span className="text-blue-400 font-bold">pravaah-analyst$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-slate-100 font-mono text-xs"
            placeholder="Type command (e.g. help, rules, jobs)..."
          />
          <button type="submit" className="text-slate-400 hover:text-white">
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
