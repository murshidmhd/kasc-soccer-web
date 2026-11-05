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
        // Udaya Purple Palette Design Tokens (Task 2)
        navy: {
          900: '#1E0B3F', // purple-900
          800: '#2E1065', // purple-800
          700: '#4C1D95', // purple-700
        },
        purple: {
          950: '#130728',
          900: '#1E0B3F',
          800: '#2E1065',
          700: '#4C1D95',
          600: '#6D28D9',
          500: '#8B5CF6',
          400: '#A78BFA',
          300: '#C4B5FD',
          200: '#DDD6FE',
          100: '#F6F3FF',
          50: '#FAF5FF',
        },
        royal: '#6D28D9', // primary purple
        sky: '#8B5CF6',   // light purple
        gold: '#F5B301',  // single accent
        'text-on-navy': '#FFFFFF',
        'muted-on-navy': '#CFC3EE',
        surface: {
          light: '#F6F3FF',
          card: '#FFFFFF',
          border: '#E4DBFA',
        },
        brand: {
          dark: '#1E0B3F',
          navy: '#2E1065',
          card: '#4C1D95',
          border: '#E4DBFA',
          neon: '#8B5CF6',
          electric: '#6D28D9',
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
