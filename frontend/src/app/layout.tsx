import React from 'react';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import { AppShell } from '../components/AppShell';

export const metadata = {
  title: 'PRAVAAH | AI-Assisted Email Cryptographic Forensics & Security Posture',
  description:
    'PRAVAAH — AI-Assisted Email Cryptographic Forensics & Security Posture — National Technical Research Organisation (NTRO) · SIH 26159',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased font-sans">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
          themes={['light', 'dark']}
        >
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
