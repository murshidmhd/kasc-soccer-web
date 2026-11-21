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
        // Liquid Glass Purple Palette (Gem AI Obsidian Black & Electric Violet)
        // #030006: Pure Obsidian Pitch Black Base
        // #080310: Deep Obsidian Surface
        // #0E071D: Dark Card Surface
        // #7C3AED: Vibrant Electric Violet
        // #8B5CF6: Luminous Amethyst Glow Accent
        // #C4B5FD: Soft Frost Lilac Highlight
        // #1D1530: Deep Slate Purple Neutral
        navy: {
          950: '#030006',
          900: '#080310',
          850: '#0B0516',
          800: '#0E071D',
          750: '#150A2A',
          700: '#231242',
          600: '#7C3AED',
          500: '#8B5CF6',
        },
        purple: {
          950: '#030006',
          900: '#080310',
          800: '#0E071D',
          700: '#1B0E36',
          600: '#2D1554',
          500: '#7C3AED',
          400: '#8B5CF6',
          300: '#A78BFA',
          200: '#C4B5FD',
          100: '#EDE9FE',
          50: '#F5F3FF',
        },
        royal: '#7C3AED', // Luxury electric neon purple (#7C3AED)
        sky: '#8B5CF6',   // Luminous soft lilac accent (#8B5CF6)
        frost: '#C4B5FD', // Frost lavender highlight (#C4B5FD)
        slatePurple: '#1D1530', // Slate purple neutral (#1D1530)
        gold: '#F5B301',  // Single golden accent
        'text-on-navy': '#FFFFFF',
        'muted-on-navy': '#C4B5FD',
        surface: {
          light: '#F8F6FF',
          card: '#FFFFFF',
          border: '#C4B5FD',
        },
        liquid: {
          obsidian: '#030006',
          deep: '#080310',
          royal: '#7C3AED',
          lavender: '#8B5CF6',
          frost: '#C4B5FD',
          slate: '#1D1530',
        },
        brand: {
          dark: '#030006',
          navy: '#080310',
          card: '#0E071D',
          border: '#231242',
          neon: '#8B5CF6',
          electric: '#7C3AED',
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
        'card': '20px',
        'inner': '14px',
        'btn': '14px',
        'pill': '9999px',
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(14, 11, 29, 0.08), 0 1px 3px 0 rgba(14, 11, 29, 0.05)',
        'card-hover': '0 10px 28px -4px rgba(14, 11, 29, 0.12), 0 2px 6px -2px rgba(14, 11, 29, 0.06)',
        'liquid-card': '0 16px 40px -12px rgba(14, 11, 29, 0.7), inset 0 1px 1px 0 rgba(201, 194, 227, 0.22)',
        'liquid-pill': '0 6px 20px -2px rgba(14, 11, 29, 0.45), inset 0 1px 0 rgba(201, 194, 227, 0.35)',
        'glow-royal': '0 0 24px -2px rgba(90, 59, 140, 0.55)',
        'glow-lavender': '0 0 20px -2px rgba(139, 124, 199, 0.45)',
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
