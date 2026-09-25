import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export const FooterSection: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 text-xs font-mono">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/ntro-logo3.png"
                alt="NTRO Logo Light"
                className="h-8 w-auto object-contain shrink-0 dark:hidden"
              />
              <img
                src="/ntro-logo2.png"
                alt="NTRO Logo Dark"
                className="h-8 w-auto object-contain shrink-0 hidden dark:block"
              />
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100 font-grotesk">
                PRAVAAH
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
              AI-Assisted Email Cryptographic Forensics & Security Posture.
            </p>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
              NTRO • SIH 2026 • SIH26159
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PLATFORM NAVIGATION</span>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><Link href="/#platform" className="hover:text-blue-600">Platform Overview</Link></li>
              <li><Link href="/#capabilities" className="hover:text-blue-600">Capabilities</Link></li>
              <li><Link href="/#pipeline" className="hover:text-blue-600">Pipeline Forensics</Link></li>
              <li><Link href="/reports" className="hover:text-blue-600">Report Export Hub</Link></li>
              <li><Link href="/console" className="hover:text-blue-600">SOC Dashboard</Link></li>
            </ul>
          </div>

          {/* Technical Scope */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TECHNICAL COVERAGE</span>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><span>Passive PCAP Analysis</span></li>
              <li><span>SMTP / IMAP / POP3 Parsing</span></li>
              <li><span>STARTTLS & TLS 1.3 Inspection</span></li>
              <li><span>X.509 Trust Chain Verification</span></li>
              <li><span>ML Isolation Forest Anomaly Engine</span></li>
            </ul>
          </div>

          {/* RFC Standards Mapped */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">MAPPED IETF RFC STANDARDS</span>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><span>RFC 8996 (TLS Deprecation)</span></li>
              <li><span>RFC 8314 (Implicit TLS)</span></li>
              <li><span>RFC 3207 (STARTTLS Extension)</span></li>
              <li><span>RFC 8461 (MTA-STS Policy)</span></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            Designed as a research and prototype platform for cryptographic security posture assessment (SIH 26159).
          </p>

          <span>© 2026 PRAVAAH Team · All Rights Reserved</span>
        </div>
      </div>
    </footer>
  );
};
