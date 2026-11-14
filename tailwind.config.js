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
          950: '#0f0728',
          900: '#180b38',
          800: '#2e1065',
          750: '#3b137b',
          700: '#4c1d95',
          600: '#6d28d9',
        },
        purple: {
          950: '#0f0728',
          900: '#1e0a3d',
          800: '#2e1065',
          700: '#4c1d95',
          600: '#6d28d9',
          500: '#7c3aed',
          400: '#a78bfa',
          300: '#c4b5fd',
          200: '#ddd6fe',
          100: '#ede9fe',
          50: '#f5f3ff',
        },
        royal: '#7c3aed', // primary vibrant electric violet
        sky: '#a78bfa',   // luminous soft lavender
        frost: '#ddd6fe', // frost lilac specular highlight
        gold: '#F5B301',  // single accent
        'text-on-navy': '#FFFFFF',
        'muted-on-navy': '#ddd6fe',
        surface: {
          light: '#F5F3FF',
          card: '#FFFFFF',
          border: '#ddd6fe',
        },
        liquid: {
          obsidian: '#0f0728',
          deep: '#241042',
          royal: '#7c3aed',
          lavender: '#a78bfa',
          frost: '#ddd6fe',
          slate: '#4c1d95',
        },
        brand: {
          dark: '#0f0728',
          navy: '#2e1065',
          card: '#2e1065',
          border: '#ddd6fe',
          neon: '#a78bfa',
          electric: '#7c3aed',
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
