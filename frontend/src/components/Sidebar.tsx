'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, UploadCloud, FileSearch, FileText,
  Terminal, LogOut, LogIn, ChevronLeft, ChevronRight,
  Shield, Activity, Settings, Network, Key, Award,
  Fingerprint, Layers, Cpu, ShieldAlert, SlidersHorizontal,
  FileCheck
} from 'lucide-react';
import { getStoredUser, logoutApi } from '../lib/api';
import { ThemeToggle } from './ThemeToggle';

interface NavGroup {
  groupName: string;
  items: {
    href: string;
    label: string;
    icon: React.ElementType;
    exact?: boolean;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupName: 'OVERVIEW',
    items: [
      { href: '/', label: 'SOC Dashboard', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    groupName: 'INVESTIGATION',
    items: [
      { href: '/ingest', label: 'PCAP Analysis', icon: UploadCloud },
      { href: '/sessions', label: 'Email Sessions', icon: Activity },
      { href: '/evidence', label: 'Evidence Workspace', icon: Layers },
    ],
  },
  {
    groupName: 'CRYPTOGRAPHIC',
    items: [
      { href: '/tls', label: 'TLS Analysis', icon: Key },
      { href: '/certificates', label: 'Certificates', icon: Award },
      { href: '/graph', label: 'Posture Graph', icon: Network },
      { href: '/sessions/dna', label: 'Session DNA', icon: Fingerprint },
    ],
  },
  {
    groupName: 'INTELLIGENCE',
    items: [
      { href: '/findings', label: 'Security Findings', icon: ShieldAlert },
      { href: '/risk', label: 'Risk Intelligence', icon: Cpu },
    ],
  },
  {
    groupName: 'REPORTING',
    items: [
      { href: '/reports', label: 'Reports Hub', icon: FileText },
    ],
  },
  {
    groupName: 'TOOLS',
    items: [
      { href: '/terminal', label: 'Analyst CLI', icon: Terminal },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const handleLogout = () => {
    logoutApi();
    setUser(null);
    router.push('/login');
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  return (
    <aside
      className={`relative flex flex-col h-screen shrink-0 z-30 transition-all duration-200 ease-in-out ${
        collapsed ? 'w-[72px]' : 'w-[256px]'
      }`}
      style={{
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Brand Header */}
      <div
        className="flex items-center justify-between h-16 px-4 shrink-0 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <Link href="/landing" className="flex items-center gap-2.5 min-w-0 overflow-hidden group">
          <img
            src="/ntro-logo3.png"
            alt="NTRO Logo Light"
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105 shrink-0 dark:hidden"
          />
          <img
            src="/ntro-logo2.png"
            alt="NTRO Logo Dark"
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105 shrink-0 hidden dark:block"
          />

          {!collapsed && (
            <div className="min-w-0 overflow-hidden">
              <p className="font-extrabold text-sm tracking-tight leading-none text-slate-900 dark:text-slate-100 truncate font-grotesk">
                PRAVAAH
              </p>
              <p className="text-[10px] mt-1 font-mono font-bold text-blue-600 dark:text-blue-400 truncate">
                NTRO · SIH 26159
              </p>
            </div>
          )}
        </Link>

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="p-1.5 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors shrink-0"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 py-3 px-2 space-y-4 overflow-y-auto scroll-region">
        {NAV_GROUPS.map((group) => (
          <div key={group.groupName} className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                {group.groupName}
              </p>
            )}

            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-blue-50 text-blue-600 border border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/60'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />

                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}

        {/* System Online Status Badge */}
        <div className={`p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 ${collapsed ? 'flex justify-center' : ''}`}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            {!collapsed && (
              <div>
                <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 leading-none">
                  Analysis Engine Online
                </p>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                  Passive Sniffer Active
                </p>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
              {user?.username || 'admin'}
            </p>
            <p className="text-[10px] text-slate-500 font-mono">NTRO Analyst</p>
          </div>
        )}
        <ThemeToggle compact />
      </div>
    </aside>
  );
};
