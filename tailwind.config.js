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
        // Liquid Glass Purple Palette (User reference colors)
        // #0E0B1D: Obsidian Night Base
        // #2A1E4D: Deep Indigo Violet Surface
        // #5A3B8C: Royal Purple / Electric Violet
        // #8B7CC7: Soft Lavender Glow Accent
        // #C9C2E3: Frost Lilac Mist / Specular Highlight
        // #3A3A52: Slate Purple Neutral
        navy: {
          950: '#05020A',
          900: '#0D041A',
          800: '#1A0833',
          750: '#260C4A',
          700: '#361266',
          600: '#701DC9',
        },
        purple: {
          950: '#07020E',
          900: '#150629',
          800: '#280B4D',
          700: '#4C148B',
          600: '#701DC9',
          500: '#9333EA',
          400: '#A855F7',
          300: '#C084FC',
          200: '#E9D5FF',
          100: '#F3E8FF',
          50: '#FAF5FF',
        },
        royal: '#9333EA', // Luxury electric neon purple (#9333EA)
        sky: '#A855F7',   // Luminous soft lilac accent (#A855F7)
        frost: '#E9D5FF', // Frost lavender highlight (#E9D5FF)
        gold: '#F5B301',  // Single golden accent
        'text-on-navy': '#FFFFFF',
        'muted-on-navy': '#C084FC',
        surface: {
          light: '#FAF5FF',
          card: '#FFFFFF',
          border: '#C084FC',
        },
        liquid: {
          obsidian: '#05020A',
          deep: '#150629',
          royal: '#9333EA',
          lavender: '#A855F7',
          frost: '#E9D5FF',
          slate: '#260C4A',
        },
        brand: {
          dark: '#05020A',
          navy: '#150629',
          card: '#1F0A38',
          border: '#A855F7',
          neon: '#C084FC',
          electric: '#9333EA',
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
