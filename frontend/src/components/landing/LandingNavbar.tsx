'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, Activity, ArrowRight } from 'lucide-react';

export const LandingNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm py-2.5'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left Logo */}
        <Link href="/landing" className="flex items-center gap-3 shrink-0 group">
          <div className="flex items-center gap-2.5">
            <img
              src="/ntro-logo3.png"
              alt="NTRO Logo Light"
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105 shrink-0 dark:hidden"
            />
            <img
              src="/ntro-logo2.png"
              alt="NTRO Logo Dark"
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105 shrink-0 hidden dark:block"
            />
            {/* Custom PRAVAAH Flow Shield Logo */}
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm relative">
              <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-white animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100 font-grotesk">
                PRAVAAH
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900">
                SIH 26159
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-none mt-0.5">
              Cryptographic Security Intelligence
            </p>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300 font-sans">
          <a href="#platform" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Platform</a>
          <a href="#capabilities" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Capabilities</a>
          <a href="#pipeline" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How It Works</a>
          <a href="#forensics" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Forensics</a>
          <a href="#reports" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Reports</a>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>SYSTEM OPERATIONAL</span>
          </div>

          <Link
            href="/login"
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 px-3 py-1.5 font-sans"
          >
            Sign In
          </Link>

          <Link
            href="/"
            className="btn-primary text-xs px-4 py-2 rounded-lg gap-1.5 font-bold shadow-sm"
          >
            <span>View Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </nav>
  );
};
