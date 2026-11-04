/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#071433',
          800: '#0B1F4D',
          700: '#12306E',
        },
        royal: '#1D4ED8',
        sky: '#3B82F6',
        gold: '#F5B301',
        'text-on-navy': '#FFFFFF',
        'muted-on-navy': '#B7C4E0',
        surface: {
          light: '#EAEFF6',
          card: '#F4F7FA',
          border: '#CDD7E6',
        },
        brand: {
          dark: '#071433',
          navy: '#0B1F4D',
          card: '#12306E',
          border: '#D9E2F2',
          neon: '#3B82F6',
          electric: '#1D4ED8',
          gold: '#F5B301',
          crimson: '#ef4444'
        }
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
      borderRadius: {
        'card': '16px',
        'inner': '12px',
        'btn': '12px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Anek Malayalam', 'system-ui', 'sans-serif'],
        sports: ['Oswald', 'sans-serif'],
        malayalam: ['Anek Malayalam', 'Noto Sans Malayalam', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
