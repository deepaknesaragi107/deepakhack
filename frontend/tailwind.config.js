/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#090d16',
          surface: '#0f172a',
          card: '#131e36',
          border: '#1e293b',
          accent: '#06b6d4',
          accentHover: '#0891b2',
          glow: 'rgba(6, 182, 212, 0.15)',
        },
        risk: {
          safe: '#10b981',
          safeBg: 'rgba(16, 185, 129, 0.1)',
          suspicious: '#f59e0b',
          suspiciousBg: 'rgba(245, 158, 11, 0.1)',
          danger: '#ef4444',
          dangerBg: 'rgba(239, 68, 68, 0.1)',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'cyber-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.25)',
        'cyber-danger': '0 0 20px -3px rgba(239, 68, 68, 0.25)',
        'cyber-safe': '0 0 20px -3px rgba(16, 185, 129, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radar 4s linear infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}

