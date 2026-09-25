'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ThemeToggle } from './ThemeToggle';
import {
  Shield, Loader2, Zap, UploadCloud, FileSearch, Terminal, FileText, Activity,
  Key, Award, Network, Fingerprint, Layers, Cpu, Settings, Bell
} from 'lucide-react';
import { getStoredUser } from '../lib/api';

const PUBLIC_ROUTES = ['/', '/landing', '/login', '/dashboard'];

const PAGE_META: Record<string, { title: string; subtitle: string; icon: React.ElementType }> = {
  '/':            { title: 'PRAVAAH Platform',         subtitle: 'AI-Assisted Email Cryptographic Forensics',        icon: Shield },
  '/dashboard':   { title: 'SOC Command Center',       subtitle: 'Passive email cryptographic security monitoring', icon: Zap },
  '/ingest':      { title: 'PCAP Ingestion & Analysis',subtitle: 'Upload captured traffic for passive forensic analysis', icon: UploadCloud },
  '/sessions':    { title: 'Email Sessions',           subtitle: 'Reconstructed communication sessions from captured traffic', icon: Activity },
  '/evidence':    { title: 'Evidence Workspace',       subtitle: 'Frame & packet evidence correlation',              icon: Layers },
  '/tls':         { title: 'TLS Security Analysis',    subtitle: 'Handshake & cipher suite security verification',   icon: Key },
  '/certificates':{ title: 'Certificate Health Hub',   subtitle: 'X.509 validity & certificate chain verification', icon: Award },
  '/graph':       { title: 'Cryptographic Posture Graph', subtitle: 'Interactive network relationship graph',         icon: Network },
  '/risk':        { title: 'Risk Intelligence',        subtitle: 'ML Anomaly detection & explainability engine',      icon: Cpu },
  '/findings':    { title: 'Security Findings',        subtitle: 'Cross-job cryptographic vulnerability database',    icon: FileSearch },
  '/reports':     { title: 'Report Export Hub',        subtitle: 'Download audit-ready forensic reports',             icon: FileText },
  '/terminal':    { title: 'Analyst CLI',              subtitle: 'Interactive forensic command interface',            icon: Terminal },
  '/settings':    { title: 'System Settings',          subtitle: 'System configurations & risk thresholds',          icon: Settings },
};

function getPageMeta(pathname: string) {
  if (PAGE_META[pathname]) return PAGE_META[pathname];
  if (pathname.startsWith('/sessions/'))
    return { title: 'Session Investigation', subtitle: 'Reconstructed TCP & Cryptographic Evidence', icon: Activity };
  if (pathname.startsWith('/jobs/'))
    return { title: 'Forensic Analysis Pipeline', subtitle: 'Session-level cryptographic assessment', icon: Shield };
  return { title: 'PRAVAAH', subtitle: 'NTRO SIH 26159', icon: Shield };
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isPublic = PUBLIC_ROUTES.some(r => pathname === r || (r !== '/' && pathname.startsWith(r + '/')));

  const [checkingAuth, setCheckingAuth] = useState(!isPublic);
  const [isAuthenticated, setIsAuthenticated] = useState(isPublic);

  useEffect(() => {
    if (!isPublic) {
      const user = getStoredUser();
      if (!user) {
        setIsAuthenticated(false);
        setCheckingAuth(false);
        router.replace('/login');
      } else {
        setIsAuthenticated(true);
        setCheckingAuth(false);
      }
    } else {
      setIsAuthenticated(true);
      setCheckingAuth(false);
    }
  }, [isPublic, pathname, router]);

  /* Public layout (landing / login) */
  if (isPublic) {
    const isLanding = pathname === '/' || pathname === '/landing';

    return (
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        {isLanding ? (
          <main className="flex-1 w-full">
            {children}
          </main>
        ) : (
          <>
            <main className="flex-1 w-full max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
              {children}
            </main>

            <footer className="py-5 px-6 border-t border-slate-200 dark:border-slate-800 mt-auto bg-white dark:bg-slate-900">
              <div className="max-w-[1300px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white">
                    <Shield className="w-3 h-3" strokeWidth={2.5} />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-grotesk">
                    PRAVAAH
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                    v1.0.0
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center font-mono">
                  National Technical Research Organisation (NTRO) · SIH 2026 · Problem Statement 26159
                </p>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>All Systems Operational</span>
                </div>
              </div>
            </footer>
          </>
        )}
      </div>
    );
  }

  /* App layout with sidebar & topbar */
  const meta = getPageMeta(pathname);
  const PageIcon = meta.icon;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          {/* Left: Breadcrumbs & Page title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600">
              <PageIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                <span>PRAVAAH</span>
                <span>/</span>
                <span className="text-slate-600 dark:text-slate-300 font-semibold">{meta.title}</span>
              </div>
              <h1 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {meta.subtitle}
              </h1>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Analysis Engine Online</span>
            </div>

            <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-600" />
            </button>
          </div>
        </header>

        {/* Scrollable content region */}
        <main className="flex-1 overflow-y-auto scroll-region px-6 py-6">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
