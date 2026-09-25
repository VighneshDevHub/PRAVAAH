'use client';

import React from 'react';
import { PostureGraph } from '../../components/PostureGraph';

export default function PostureGraphPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl font-bold font-grotesk text-slate-900 dark:text-slate-100">
          Cryptographic Posture Graph
        </h1>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          Visual relationship graph linking domains, servers, sessions, certificates, findings, and risk scores.
        </p>
      </div>

      <PostureGraph />
    </div>
  );
}
