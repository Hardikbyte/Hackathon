/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // High-contrast accessibility palette (WCAG AA)
        accent: { DEFAULT: '#2563eb', dark: '#1d4ed8' },
        accentBright: '#3b82f6',
        teal: { DEFAULT: '#0d9488', light: '#5eead4', glow: 'rgba(94, 234, 212, 0.15)' },
        surface: '#0f172a',
        surfaceLight: '#1e293b',
        surfaceCard: '#1e293b',
        textPrimary: '#f8fafc',
        textMuted: '#94a3b8',
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
        purple: '#a855f7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'accessibility-lg': ['1.25rem', { lineHeight: '1.6' }],
        'accessibility-xl': ['1.5rem', { lineHeight: '1.5' }],
      },
      keyframes: {
        'nav-underline': {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
        'step-in': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'bg-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'nav-underline': 'nav-underline 0.25s ease-out',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        'step-in': 'step-in 0.5s ease-out forwards',
        'bg-shift': 'bg-shift 12s ease infinite',
      },
    },
  },
  plugins: [],
};
