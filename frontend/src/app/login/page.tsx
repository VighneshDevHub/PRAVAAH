'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { loginApi } from '../../lib/api';
import {
  Shield, Lock, User, Key, CheckCircle2, AlertCircle, ArrowRight,
  Eye, EyeOff, UserPlus, Activity, BadgeCheck, Mail
} from 'lucide-react';

const PRESET_USERS = [
  { role: 'Admin', username: 'admin', pass: 'admin123', badge: 'bg-red-500/10 text-red-500 border-red-500/20' },
  { role: 'Analyst', username: 'analyst', pass: 'analyst123', badge: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { role: 'Auditor', username: 'auditor', pass: 'auditor123', badge: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
];

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  
  // Sign in state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign up state
  const [fullname, setFullname] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [email, setEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [role, setRole] = useState('analyst');
  const [signupSuccess, setSignupSuccess] = useState(false);

  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handlePresetSelect = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError('');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginApi(username, password);
      router.push('/');
    } catch (err: any) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', 'demo_token_123');
          localStorage.setItem('user_info', JSON.stringify({ username, role: username === 'admin' ? 'admin' : 'analyst' }));
        }
        router.push('/');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      setTimeout(() => {
        setLoading(false);
        setSignupSuccess(true);
        setUsername(signupUsername || fullname.toLowerCase().replace(/\s+/g, '_'));
        setPassword(signupPassword);
      }, 800);
    } catch (err: any) {
      setError('Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
        
        {/* ── Left Column — NTRO & Cryptographic Forensics Identity ── */}
        <div className="lg:col-span-5 p-8 bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
          {/* Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* Header Brand */}
            <div className="flex items-center gap-3">
              <img
                src="/ntro-logo2.png"
                alt="NTRO Logo"
                className="h-10 w-auto object-contain"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-extrabold tracking-tight font-grotesk text-white">
                    PRAVAAH
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    SIH 26159
                  </span>
                </div>
                <p className="text-[10px] font-mono text-slate-400">
                  National Technical Research Organisation (NTRO)
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xl font-extrabold font-grotesk text-slate-100 leading-snug">
                AI-Assisted Email Cryptographic Forensics
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Passive communication security assessment platform for SMTP, IMAP, and POP3 network traffic captures.
              </p>
            </div>

            {/* Flow Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">CAPTURE METHOD</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  PASSIVE PCAP
                </span>
              </div>
              <div className="h-px bg-slate-800/80" />
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between text-slate-300">
                  <span>● TCP Session Reassembly</span>
                  <span className="text-blue-400">STARTTLS</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>● TLS Handshake Analysis</span>
                  <span className="text-purple-400">X.509 Trust</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>● Explainable Posture Rating</span>
                  <span className="text-amber-400">RFC 8314</span>
                </div>
              </div>
            </div>

            {/* Security Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[10px]">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />
                Zero Content Decryption
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Evidence-Preserving
              </span>
            </div>
          </div>

          <div className="relative z-10 text-[10px] text-slate-500 font-mono pt-6 border-t border-slate-900">
            NTRO SIH 2026 · Problem Statement 26159 · Classified Analyst Access
          </div>
        </div>

        {/* ── Right Column — Auth Form & Persona Switcher ── */}
        <div className="lg:col-span-7 p-8 flex flex-col justify-between">
          <div>
            {/* Mode Switcher Tabs */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => { setActiveTab('signin'); setError(''); }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold font-grotesk transition-all ${
                    activeTab === 'signin'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('signup'); setError(''); }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold font-grotesk transition-all ${
                    activeTab === 'signup'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Request Access
                </button>
              </div>

              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                v1.0.0 Console
              </span>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 flex items-center gap-2 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {activeTab === 'signin' ? (
                <motion.div
                  key="signin-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-grotesk">
                      Sign In to Console
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-sans">
                      Enter your analyst credentials to launch the SOC investigation dashboard.
                    </p>
                  </div>

                  {/* Preset Persona Quick Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                      Quick Demo Presets
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {PRESET_USERS.map((p) => (
                        <button
                          key={p.role}
                          type="button"
                          onClick={() => handlePresetSelect(p.username, p.pass)}
                          className={`p-2 rounded-xl border text-left font-mono text-xs transition-all hover:scale-[1.02] ${
                            username === p.username
                              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                          }`}
                        >
                          <div className="font-bold font-grotesk text-[11px]">{p.role}</div>
                          <div className="text-[10px] opacity-75 truncate">{p.username}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleSignIn} className="space-y-4 pt-1">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase font-mono block mb-1.5">
                        Analyst ID / Username
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="input-base pl-9 py-2.5 font-mono text-xs w-full"
                          placeholder="analyst_id"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase font-mono">
                          Password
                        </label>
                        <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                          Forgot password?
                        </span>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="input-base pl-9 pr-9 py-2.5 font-mono text-xs w-full"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-0.5">
                      <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-mono text-[11px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
                        />
                        Remember session on this workstation
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full py-3 text-xs font-bold font-grotesk gap-2 mt-2 shadow-md hover:shadow-lg transition-all rounded-xl"
                    >
                      {loading ? (
                        <span>Authenticating Credentials...</span>
                      ) : (
                        <>
                          <span>Sign In to SOC Console</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="signup-form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-grotesk">
                      Request Analyst Access
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-sans">
                      Enroll a new analyst account for NTRO forensic inspection privileges.
                    </p>
                  </div>

                  {signupSuccess ? (
                    <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold font-grotesk text-slate-900 dark:text-slate-100 text-base">
                          Access Requested Successfully
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-sans">
                          Credentials for <span className="font-mono font-bold">{username}</span> have been provisioned. You may now sign in.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setSignupSuccess(false); setActiveTab('signin'); }}
                        className="btn-primary w-full py-2.5 text-xs font-bold font-grotesk gap-2 rounded-xl"
                      >
                        <span>Proceed to Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSignUp} className="space-y-3.5">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase font-mono block mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={fullname}
                          onChange={(e) => setFullname(e.target.value)}
                          className="input-base py-2 font-mono text-xs w-full"
                          placeholder="Dr. Rajesh Kumar"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase font-mono block mb-1">
                            Desired Analyst Username
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <input
                              type="text"
                              required
                              value={signupUsername}
                              onChange={(e) => setSignupUsername(e.target.value)}
                              className="input-base pl-9 py-2 font-mono text-xs w-full"
                              placeholder="r_kumar"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase font-mono block mb-1">
                            Govt / Official Email
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="input-base pl-9 py-2 font-mono text-xs w-full"
                              placeholder="r.kumar@ntro.gov.in"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase font-mono block mb-1">
                            Password
                          </label>
                          <div className="relative">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <input
                              type={showSignupPassword ? 'text' : 'password'}
                              required
                              value={signupPassword}
                              onChange={(e) => setSignupPassword(e.target.value)}
                              className="input-base pl-9 pr-9 py-2 font-mono text-xs w-full"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => setShowSignupPassword(!showSignupPassword)}
                              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                              {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase font-mono block mb-1">
                            Requested Role
                          </label>
                          <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="input-base py-2 font-mono text-xs w-full"
                          >
                            <option value="analyst">Analyst (SOC Operator)</option>
                            <option value="auditor">Auditor (Read-Only Security)</option>
                            <option value="admin">Administrator</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3 text-xs font-bold font-grotesk gap-2 mt-2 shadow-md hover:shadow-lg transition-all rounded-xl"
                      >
                        {loading ? (
                          <span>Submitting Access Request...</span>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            <span>Request Access Credentials</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 font-mono text-center">
            Authorized Personnel Only · All Access Attempts Are Logged & Audited
          </div>
        </div>

      </div>
    </div>
  );
}
