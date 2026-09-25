'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, UploadCloud, FileSearch, FileText, Home,
  LogOut, LogIn, Terminal, ChevronDown, Menu, X, Shield,
  Activity, Bell,
} from 'lucide-react';
import { getStoredUser, logoutApi } from '../lib/api';
import { ThemeToggle } from './ThemeToggle';

const APP_NAV_LINKS = [
  { href: '/',          label: 'Home',          icon: Home },
  { href: '/console',   label: 'SOC Dashboard', icon: LayoutDashboard },
  { href: '/upload',    label: 'Ingest PCAP',   icon: UploadCloud },
  { href: '/findings',  label: 'Findings',      icon: FileSearch },
  { href: '/terminal',  label: 'CLI',           icon: Terminal },
  { href: '/reports',   label: 'Reports',       icon: FileText },
];

const LANDING_NAV_LINKS = [
  { href: '#platform',     label: 'Platform',     icon: Shield },
  { href: '#capabilities', label: 'Capabilities', icon: Activity },
  { href: '#pipeline',     label: 'How It Works', icon: FileSearch },
  { href: '#crypto',       label: 'Forensics',    icon: Terminal },
  { href: '#reports',      label: 'Reports',      icon: FileText },
];

const ROLE_COLORS: Record<string, string> = {
  admin:   'text-red-400    bg-red-500/10    border-red-500/20',
  analyst: 'text-blue-400   bg-blue-500/10   border-blue-500/20',
  auditor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
};

export const Navbar: React.FC = () => {
  const router   = useRouter();
  const pathname = usePathname();
  const [user, setUser]           = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isLanding = pathname === '/' || pathname === '/landing';
  const isLogin   = pathname === '/login';
  const navLinks  = isLanding || isLogin ? LANDING_NAV_LINKS : APP_NAV_LINKS;

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logoutApi();
    setUser(null);
    setMenuOpen(false);
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href.startsWith('#')) return false;
    return href === '/' ? pathname === href : pathname === href || pathname.startsWith(href + '/');
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      if (pathname !== '/' && pathname !== '/landing') {
        router.push(`/${href}`);
      } else {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
      setMobileOpen(false);
    }
  };

  return (
    <>
      <nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? 'var(--navbar-bg)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(12px)',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(12px)',
          borderBottom: scrolled
            ? '1px solid var(--border)'
            : '1px solid transparent',
          boxShadow: scrolled ? 'var(--shadow-card)' : 'none',
        }}
      >
        <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4">

          {/* ── Logo with NTRO Image ── */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="flex items-center gap-2">
              <img
                src="/ntro-logo3.png"
                alt="NTRO Logo Light"
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105 dark:hidden"
              />
              <img
                src="/ntro-logo2.png"
                alt="NTRO Logo Dark"
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105 hidden dark:block"
              />
              <div
                className="relative w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-blue-600 text-white"
              >
                <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-white animate-pulse" />
              </div>
            </div>

            <div className="hidden sm:block">
              <div className="flex items-baseline gap-2">
                <span
                  className="font-extrabold text-base tracking-tight font-grotesk"
                  style={{ color: 'var(--text-primary)' }}
                >
                  PRAVAAH
                </span>
                <span
                  className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                  style={{
                    color: 'var(--primary)',
                    background: 'var(--primary-dim)',
                    border: '1px solid var(--primary-border)',
                  }}
                >
                  SIH 26159
                </span>
              </div>
              <p className="text-[10px] font-medium leading-none mt-0.5 text-slate-500">
                National Technical Research Organisation (NTRO)
              </p>
            </div>
          </Link>

          {/* ── Desktop nav pills ── */}
          <div
            className="hidden lg:flex items-center gap-0.5 p-1 rounded-xl shrink-0"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              const isHash = href.startsWith('#');

              if (isHash) {
                return (
                  <a
                    key={href}
                    href={href}
                    onClick={(e) => handleNavClick(e, href)}
                    className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors outline-none font-grotesk hover:bg-slate-100 dark:hover:bg-slate-800/60 whitespace-nowrap shrink-0"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="whitespace-nowrap">{label}</span>
                  </a>
                );
              }

              return (
                <Link
                  key={href}
                  href={href}
                  className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 outline-none whitespace-nowrap shrink-0"
                  style={{
                    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: 'linear-gradient(135deg, var(--primary-dim), var(--accent-dim))',
                        border: '1px solid var(--primary-border)',
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon
                    className="w-3.5 h-3.5 relative z-10 shrink-0"
                    style={{ color: active ? 'var(--primary)' : 'var(--text-muted)' }}
                  />
                  <span className="relative z-10 font-grotesk whitespace-nowrap">{label}</span>
                </Link>
              );
            })}
          </div>

          {/* ── Right side ── */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Dashboard Redirect Button (hidden on /login) */}
            {!isLogin && (
              <Link
                href="/console"
                className="btn-primary text-xs sm:text-[13px] px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl flex items-center gap-1.5 sm:gap-2 font-bold font-grotesk shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0"
              >
                <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">SOC Dashboard</span>
              </Link>
            )}

            {/* Back to Landing Platform button (shown on /login) */}
            {isLogin && (
              <Link
                href="/"
                className="btn-ghost text-xs sm:text-[13px] px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold font-grotesk border border-slate-200 dark:border-slate-800 whitespace-nowrap shrink-0"
              >
                <Home className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="whitespace-nowrap">Back to Platform</span>
              </Link>
            )}

            {/* Status pill */}
            <div
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold"
              style={{
                background: 'rgba(52,211,153,0.07)',
                border: '1px solid rgba(52,211,153,0.2)',
                color: '#34d399',
              }}
            >
              <Activity className="w-3 h-3 animate-pulse" />
              <span>Live</span>
            </div>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* User section or Landing CTA */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl transition-all text-sm group"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0 bg-blue-600"
                  >
                    {user.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span
                    className="hidden sm:block font-semibold text-[13px] font-grotesk"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {user.username}
                  </span>
                  <span
                    className={`hidden sm:block text-[10px] font-bold px-1.5 py-0.5 rounded border ${ROLE_COLORS[user.role] || ROLE_COLORS.analyst}`}
                  >
                    {user.role?.toUpperCase()}
                  </span>
                  <ChevronDown
                    className="w-3.5 h-3.5 transition-transform"
                    style={{
                      color: 'var(--text-muted)',
                      transform: menuOpen ? 'rotate(180deg)' : 'none',
                    }}
                  />
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden"
                      style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-modal)',
                      }}
                    >
                      <div className="p-3" style={{ borderBottom: '1px solid var(--border)' }}>
                        <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {user.username}
                        </p>
                        <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--text-faint)' }}>
                          {user.email || `${user.username}@pravaah.ntro`}
                        </p>
                      </div>
                      <div className="p-1.5 space-y-0.5">
                        <Link
                          href="/"
                          onClick={() => setMenuOpen(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          <LayoutDashboard className="w-4 h-4 text-blue-500" />
                          SOC Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-colors"
                          style={{ color: '#f87171' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.08)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : !isLogin ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="btn-primary text-[13px] px-4 py-2"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              </div>
            ) : null}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl transition-all"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden"
              style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}
            >
              <div className="p-3 space-y-1">
                {navLinks.map(({ href, label, icon: Icon }) => {
                  const active = isActive(href);
                  const isHash = href.startsWith('#');

                  if (isHash) {
                    return (
                      <a
                        key={href}
                        href={href}
                        onClick={(e) => handleNavClick(e, href)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all font-grotesk text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Icon className="w-4 h-4 text-slate-400" />
                        {label}
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all font-grotesk"
                      style={{
                        color: active ? 'var(--primary)' : 'var(--text-secondary)',
                        background: active ? 'var(--primary-dim)' : 'transparent',
                        border: active ? '1px solid var(--primary-border)' : '1px solid transparent',
                      }}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

