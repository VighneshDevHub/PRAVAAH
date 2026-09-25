import React from 'react';
import Link from 'next/link';
import { AlertCircle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 px-4">
      {/* Glow icon */}
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center"
        style={{
          background: 'rgba(248,113,113,0.1)',
          border: '1px solid rgba(248,113,113,0.25)',
          boxShadow: '0 0 40px rgba(248,113,113,0.15)',
        }}
      >
        <AlertCircle className="w-10 h-10 text-red-400" />
      </div>

      {/* Status code */}
      <div>
        <p
          className="text-[80px] font-black leading-none font-grotesk"
          style={{
            background: 'linear-gradient(135deg, #f87171, #fb923c)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </p>
        <h2 className="text-[22px] font-bold font-grotesk mt-2" style={{ color: 'var(--text-primary)' }}>
          Page Not Found
        </h2>
        <p className="text-[14px] mt-2 max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
          The requested forensic page could not be located in the SOC system.
        </p>
      </div>

      <Link
        href="/dashboard"
        className="btn-primary inline-flex gap-2 px-6 py-2.5 text-[14px] rounded-xl"
      >
        <Home className="w-4 h-4" />
        Return to SOC Dashboard
      </Link>
    </div>
  );
}
