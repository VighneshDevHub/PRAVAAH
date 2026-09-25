'use client';

import React from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { LiveProductPreview } from '../components/landing/LiveProductPreview';
import { CapabilityStrip } from '../components/landing/CapabilityStrip';
import { ProblemSection } from '../components/landing/ProblemSection';
import { InvestigationPipeline } from '../components/landing/InvestigationPipeline';
import { CryptoIntelligence } from '../components/landing/CryptoIntelligence';
import { SessionDNASection } from '../components/landing/SessionDNASection';
import { SecurityPostureSection } from '../components/landing/SecurityPostureSection';
import { AIAnalysisSection } from '../components/landing/AIAnalysisSection';
import { EvidenceChainSection } from '../components/landing/EvidenceChainSection';
import { ReportOutputsSection } from '../components/landing/ReportOutputsSection';
import { UseCasesSection } from '../components/landing/UseCasesSection';
import { FinalCTASection } from '../components/landing/FinalCTASection';
import { FooterSection } from '../components/landing/FooterSection';

export default function RootLandingPage() {
  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/10 selection:text-blue-600">
      <main className="space-y-16 lg:space-y-24 py-6">
        <HeroSection />
        <LiveProductPreview />
        <CapabilityStrip />
        <ProblemSection />
        <InvestigationPipeline />
        <CryptoIntelligence />
        <SessionDNASection />
        <SecurityPostureSection />
        <AIAnalysisSection />
        <EvidenceChainSection />
        <ReportOutputsSection />
        <UseCasesSection />
        <FinalCTASection />
      </main>

      <FooterSection />
    </div>
  );
}
