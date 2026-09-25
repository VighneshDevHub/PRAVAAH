'use client';

import React from 'react';
import { CertificateCard } from '../../components/CertificateCard';
import { Award } from 'lucide-react';

export default function CertificatesPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl font-bold font-grotesk text-slate-900 dark:text-slate-100">
          X.509 Certificate Health Hub
        </h1>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          Validation chain trust path, validity periods, and public key specification.
        </p>
      </div>

      <CertificateCard
        subject="mail.enterprise.gov"
        issuer="DigiCert Global Root G2"
        keyAlg="RSA"
        keyLength={2048}
        sigAlg="sha256WithRSAEncryption"
        daysRemaining={120}
        isSelfSigned={false}
      />
    </div>
  );
}
