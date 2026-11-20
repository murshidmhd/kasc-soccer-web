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
          950: '#0E0B1D',
          900: '#16122C',
          800: '#221A42',
          750: '#2A1E4D',
          700: '#3D2C6E',
          600: '#5A3B8C',
        },
        purple: {
          950: '#0E0B1D',
          900: '#181230',
          800: '#2A1E4D',
          700: '#3E2A68',
          600: '#5A3B8C',
          500: '#754EB5',
          400: '#8B7CC7',
          300: '#A99CD9',
          200: '#C9C2E3',
          100: '#E4DFFA',
          50: '#F5F3FF',
        },
        royal: '#5A3B8C', // Luxury electric neon purple (#5A3B8C)
        sky: '#8B7CC7',   // Luminous soft lilac accent (#8B7CC7)
        frost: '#C9C2E3', // Frost lavender highlight (#C9C2E3)
        slatePurple: '#3A3A52', // Slate purple neutral (#3A3A52)
        gold: '#F5B301',  // Single golden accent
        'text-on-navy': '#FFFFFF',
        'muted-on-navy': '#C9C2E3',
        surface: {
          light: '#F8F6FF',
          card: '#FFFFFF',
          border: '#C9C2E3',
        },
        liquid: {
          obsidian: '#0E0B1D',
          deep: '#2A1E4D',
          royal: '#5A3B8C',
          lavender: '#8B7CC7',
          frost: '#C9C2E3',
          slate: '#3A3A52',
        },
        brand: {
          dark: '#0E0B1D',
          navy: '#181230',
          card: '#2A1E4D',
          border: '#5A3B8C',
          neon: '#8B7CC7',
          electric: '#5A3B8C',
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
