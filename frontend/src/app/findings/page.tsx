'use client';

import React, { useEffect, useState } from 'react';
import { getFindings, getJobs } from '../../lib/api';
import { Finding } from '../../lib/types';
import { ShieldAlert, Search, Filter, ChevronRight, FileSearch } from 'lucide-react';

export default function FindingsPage() {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading]   = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  useEffect(() => {
    async function load() {
      try {
        const jobs = await getJobs();
        let allFindings: Finding[] = [];
        for (const job of jobs) {
          const f = await getFindings(job.id);
          allFindings = [...allFindings, ...f];
        }
        setFindings(allFindings);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = findings.filter(f => {
    const matchesSearch =
      f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.standard_ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSev = severityFilter === 'ALL' || f.severity === severityFilter;
    return matchesSearch && matchesSev;
  });

  const criticals = findings.filter(f => f.severity === 'CRITICAL').length;
  const highs     = findings.filter(f => f.severity === 'HIGH').length;
  const mediums   = findings.filter(f => f.severity === 'MEDIUM').length;
  const lows      = findings.filter(f => f.severity === 'LOW').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl font-bold font-grotesk text-slate-900 dark:text-slate-100">
          Security Findings Database
        </h1>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          Deterministic vulnerability and policy evaluation across RFC 8996, RFC 8314, RFC 3207, RFC 8461 standards.
        </p>
      </div>

      {/* Counter Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="card p-3 text-center font-mono">
          <span className="text-[10px] text-red-500 font-bold uppercase block">CRITICAL</span>
          <span className="text-lg font-extrabold text-red-500">{criticals}</span>
        </div>
        <div className="card p-3 text-center font-mono">
          <span className="text-[10px] text-orange-500 font-bold uppercase block">HIGH</span>
          <span className="text-lg font-extrabold text-orange-500">{highs}</span>
        </div>
        <div className="card p-3 text-center font-mono">
          <span className="text-[10px] text-amber-500 font-bold uppercase block">MEDIUM</span>
          <span className="text-lg font-extrabold text-amber-500">{mediums}</span>
        </div>
        <div className="card p-3 text-center font-mono">
          <span className="text-[10px] text-emerald-500 font-bold uppercase block">LOW</span>
          <span className="text-lg font-extrabold text-emerald-500">{lows}</span>
        </div>
        <div className="card p-3 text-center font-mono">
          <span className="text-[10px] text-blue-500 font-bold uppercase block">TOTAL FINDINGS</span>
          <span className="text-lg font-extrabold text-blue-500">{findings.length}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by title, rule ID, RFC standard..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-base pl-9 text-xs font-mono"
          />
        </div>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="input-base text-xs font-mono py-1.5 w-full sm:w-auto"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* Findings Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs font-mono text-slate-500">Loading security findings...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-slate-500">No findings matched your filter criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Severity</th>
                  <th>Category</th>
                  <th>Finding Title</th>
                  <th>Standard Reference</th>
                  <th>Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <span className={`badge badge-${f.severity.toLowerCase()}`}>{f.severity}</span>
                    </td>
                    <td className="font-mono text-xs">{f.category}</td>
                    <td className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">{f.title}</td>
                    <td className="font-mono text-xs text-blue-600 font-semibold">{f.standard_ref}</td>
                    <td className="text-xs text-slate-600 dark:text-slate-400">{f.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
