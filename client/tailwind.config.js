/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#edf5f1',
          100: '#d5e5de',
          200: '#bad1c7',
          300: '#88a99c',
          400: '#5e8274',
          500: '#102c26',
          600: '#0d241f',
          700: '#0a1d18',
          800: '#081612',
          900: '#050f0c',
          950: '#020806',
        },
        accent: {
          50: '#fffbf5',
          100: '#fdf4e7',
          200: '#f7e7ce',
          300: '#edd7b1',
          400: '#e2c392',
          500: '#cda875',
          600: '#b28858',
        },
        dark: {
          50: '#fffaf2',
          100: '#f7e7ce',
          200: '#ead8be',
          300: '#ccb89d',
          400: '#a99780',
          500: '#7f7462',
          600: '#53625d',
          700: '#30453f',
          800: '#1d3732',
          850: '#162c27',
          900: '#102c26',
          950: '#081815',
        },
        success: '#88a99c',
        warning: '#cda875',
        danger: '#b8674f',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'score-fill': 'scoreFill 1.5s ease-out forwards',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 18px rgba(226, 195, 146, 0.18)' },
          '50%': { boxShadow: '0 0 36px rgba(226, 195, 146, 0.34)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        scoreFill: {
          '0%': { strokeDashoffset: '283' },
          '100%': { strokeDashoffset: 'var(--score-offset)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
