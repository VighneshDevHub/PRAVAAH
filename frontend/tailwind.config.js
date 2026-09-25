/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'sans-serif'],
        grotesk: ['Outfit', 'Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
        inter:   ['Inter', 'ui-sans-serif', 'sans-serif'],
      },

      colors: {
        /* ── Semantic tokens (CSS var-backed) ── */
        bg:       'var(--bg)',
        surface:  'var(--surface)',
        card:     'var(--card)',
        border:   'var(--border)',
        borderBright: 'var(--border-bright)',

        primary: {
          DEFAULT: 'var(--primary)',
          hover:   'var(--primary-hover)',
          dim:     'var(--primary-dim)',
          border:  'var(--primary-border)',
          /* static fallbacks for use without CSS vars */
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        teal: {
          DEFAULT: 'var(--teal)',
          400: '#2dd4bf',
          500: '#14b8a6',
        },

        /* severity */
        critical: {
          DEFAULT: 'var(--sev-critical)',
          bg:      'var(--sev-critical-bg)',
          border:  'var(--sev-critical-bd)',
        },
        high: {
          DEFAULT: 'var(--sev-high)',
          bg:      'var(--sev-high-bg)',
          border:  'var(--sev-high-bd)',
        },
        medium: {
          DEFAULT: 'var(--sev-medium)',
          bg:      'var(--sev-medium-bg)',
          border:  'var(--sev-medium-bd)',
        },
        low: {
          DEFAULT: 'var(--sev-low)',
          bg:      'var(--sev-low-bg)',
          border:  'var(--sev-low-bd)',
        },
        info: {
          DEFAULT: 'var(--sev-info)',
          bg:      'var(--sev-info-bg)',
          border:  'var(--sev-info-bd)',
        },
      },

      backgroundImage: {
        'gradient-radial':   'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'primary-gradient':  'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
        'cyber-gradient':    'linear-gradient(135deg, #38bdf8 0%, #4f8ef7 40%, #8b5cf6 100%)',
        'danger-gradient':   'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        'success-gradient':  'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'mesh-gradient':     'linear-gradient(135deg, var(--bg) 0%, var(--surface) 50%, var(--bg-secondary) 100%)',
        'card-shine':        'linear-gradient(135deg, rgba(79,142,247,0.06) 0%, rgba(139,92,246,0.04) 100%)',
        'hero-gradient':     'radial-gradient(ellipse 120% 80% at 50% -20%, rgba(79,142,247,0.15) 0%, transparent 60%)',
      },

      boxShadow: {
        'glow-blue':    '0 0 20px rgba(79,142,247,0.35), 0 0 60px rgba(79,142,247,0.12)',
        'glow-purple':  '0 0 20px rgba(139,92,246,0.35), 0 0 60px rgba(139,92,246,0.12)',
        'glow-teal':    '0 0 20px rgba(20,217,197,0.3),  0 0 60px rgba(20,217,197,0.1)',
        'glow-red':     '0 0 20px rgba(248,113,113,0.35),0 0 60px rgba(248,113,113,0.12)',
        'glow-green':   '0 0 20px rgba(52,211,153,0.3),  0 0 60px rgba(52,211,153,0.1)',
        'glow-amber':   '0 0 20px rgba(251,191,36,0.3),  0 0 60px rgba(251,191,36,0.1)',
        'card':         'var(--shadow-card)',
        'elevated':     'var(--shadow-elevated)',
        'modal':        'var(--shadow-modal)',
        'inner-glow':   'inset 0 1px 0 rgba(255,255,255,0.07)',
        'navbar':       '0 1px 0 var(--border-subtle), 0 4px 24px rgba(0,0,0,0.25)',
        'sidebar':      '1px 0 0 var(--border)',
        'sm':           '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.07)',
        '3d':           '0 20px 60px -12px rgba(0,0,0,0.5), 0 8px 24px -4px rgba(0,0,0,0.3)',
      },

      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      animation: {
        'fade-in':       'fadeIn 0.4s ease-out both',
        'fade-up':       'fadeUp 0.5s ease-out both',
        'fade-up-delay': 'fadeUp 0.5s ease-out 0.15s both',
        'slide-in-right':'slideInRight 0.4s ease-out both',
        'slide-in-left': 'slideInLeft 0.4s ease-out both',
        'scale-in':      'scaleIn 0.3s ease-out both',
        'bounce-in':     'bounceIn 0.6s ease-out both',
        'glow-pulse':    'glowPulse 2.5s ease-in-out infinite',
        'float':         'float 5s ease-in-out infinite',
        'float-slow':    'floatSlow 7s ease-in-out infinite',
        'float-delay':   'float 5s ease-in-out 1.5s infinite',
        'spin-slow':     'spin 10s linear infinite',
        'data-flow':     'dataFlow 2s linear infinite',
        'shimmer':       'shimmer 1.6s linear infinite',
        'pulse-ring':    'pulseRing 2.2s cubic-bezier(0.4,0,0.6,1) infinite',
        'gradient-shift':'gradientShift 4s ease infinite',
        'scan-line':     'scanLine 5s linear infinite',
        'blink':         'blink 1s step-end infinite',
        'typewriter':    'typewriter 1.5s steps(40,end) forwards',
        'orbit':         'orbitSpin 8s linear infinite',
      },

      keyframes: {
        fadeIn:       { from: { opacity: '0' },                              to: { opacity: '1' } },
        fadeUp:       { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { from: { opacity: '0', transform: 'translateX(24px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        slideInLeft:  { from: { opacity: '0', transform: 'translateX(-24px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        scaleIn:      { from: { opacity: '0', transform: 'scale(0.94)' },    to: { opacity: '1', transform: 'scale(1)' } },
        bounceIn:     {
          '0%':   { transform: 'scale(0.3)', opacity: '0' },
          '60%':  { transform: 'scale(1.05)' },
          '80%':  { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 12px rgba(79,142,247,0.2)' },
          '50%':     { boxShadow: '0 0 40px rgba(79,142,247,0.55), 0 0 80px rgba(79,142,247,0.2)' },
        },
        float:     { '0%,100%': { transform: 'translateY(0px)' },        '50%': { transform: 'translateY(-10px)' } },
        floatSlow: { '0%,100%': { transform: 'translateY(0) rotateZ(0deg)' }, '50%': { transform: 'translateY(-16px) rotateZ(1.5deg)' } },
        dataFlow: {
          '0%':   { strokeDashoffset: '200', opacity: '0.3' },
          '50%':  { opacity: '1' },
          '100%': { strokeDashoffset: '0',   opacity: '0.3' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to:   { backgroundPosition: '200% 0' },
        },
        pulseRing: {
          '0%':   { transform: 'scale(0.85)', opacity: '1' },
          '100%': { transform: 'scale(2.2)',  opacity: '0' },
        },
        gradientShift: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
        scanLine: {
          from: { top: '-10%' },
          to:   { top: '110%' },
        },
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
        typewriter: { from: { width: '0' }, to: { width: '100%' } },
        orbitSpin: {
          from: { transform: 'rotate(0deg) translateX(60px) rotate(0deg)' },
          to:   { transform: 'rotate(360deg) translateX(60px) rotate(-360deg)' },
        },
      },

      backdropBlur: {
        xs:    '2px',
        '2xl': '40px',
        '3xl': '60px',
      },

      spacing: {
        '4.5': '1.125rem',
        '13':  '3.25rem',
        '15':  '3.75rem',
        '18':  '4.5rem',
        '22':  '5.5rem',
      },

      fontSize: {
        '2xs': ['10px', { lineHeight: '14px' }],
        'xs':  ['12px', { lineHeight: '16px' }],
        'sm':  ['13px', { lineHeight: '18px' }],
      },

      transitionTimingFunction: {
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth':      'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
