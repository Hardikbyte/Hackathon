/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // High-contrast accessibility palette (WCAG AA)
        accent: { DEFAULT: '#2563eb', dark: '#1d4ed8' },
        surface: '#0f172a',
        surfaceLight: '#1e293b',
        textPrimary: '#f8fafc',
        textMuted: '#94a3b8',
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'accessibility-lg': ['1.25rem', { lineHeight: '1.6' }],
        'accessibility-xl': ['1.5rem', { lineHeight: '1.5' }],
      },
    },
  },
  plugins: [],
};
