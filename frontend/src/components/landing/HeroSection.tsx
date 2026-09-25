'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, UploadCloud, Shield, CheckCircle2 } from 'lucide-react';
import { HeroConsoleVisual } from './HeroConsoleVisual';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-4 pb-8 lg:pt-8 lg:pb-12 overflow-hidden">
      {/* Network Topology Background Glow */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
        <div className="w-[700px] h-[400px] bg-gradient-to-tr from-blue-600/10 via-indigo-500/10 to-cyan-400/5 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center">
        {/* Left Column — Content & Copy */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Small Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300 tracking-tight uppercase">
              NTRO • SIH 2026 • SIH26159
            </span>
          </motion.div>

          {/* Product Name & Marathi Script */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-xl font-mono font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase">
                PRAVAAH
              </span>
              <span className="text-lg font-bold text-slate-500 dark:text-slate-400 font-sans">
                (प्रवाह)
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-grotesk leading-[1.1]">
              From Encrypted Packets <br className="hidden sm:inline" />
              to Explainable{' '}
              <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 dark:from-blue-400 dark:via-indigo-400 dark:to-cyan-400 pr-1">
                Security Posture.
              </span>
            </h1>

            <p className="text-sm font-mono text-slate-600 dark:text-slate-400 italic">
              "Passive cryptographic forensics for secure email communications."
            </p>
          </motion.div>

          {/* Body Description */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-sans"
          >
            PRAVAAH is a passive cryptographic forensics platform for secure email communications. It reconstructs SMTP, IMAP and POP3 sessions, analyzes STARTTLS, TLS and X.509 evidence, and converts observable network data into prioritized security findings — without decrypting email content.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1"
          >
            <Link
              href="/dashboard"
              className="btn-primary text-sm px-6 py-3.5 rounded-xl gap-2.5 font-bold shadow-md hover:shadow-lg transition-all"
            >
              <span>Explore Security Console</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/ingest"
              className="btn-ghost text-sm px-6 py-3.5 rounded-xl gap-2 font-bold"
            >
              <UploadCloud className="w-4 h-4 text-blue-600" />
              <span>Analyze a PCAP</span>
            </Link>
          </motion.div>

          {/* Small Trust Line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xs font-mono text-slate-500 dark:text-slate-400 pt-2 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Passive Analysis • PCAP / PCAPNG • Evidence-Preserving</span>
          </motion.p>
        </div>

        {/* Right Column — Realistic Console Visual Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-5"
        >
          <HeroConsoleVisual />
        </motion.div>
      </div>
    </section>
  );
};
