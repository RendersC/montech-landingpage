/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#010d1a',
          900: '#022140',
          800: '#0a2d4d',
          700: '#0f3a63',
          600: '#1a4d80',
        },
        teal: {
          700: '#2D5F5D',
          600: '#3D9B99',
          500: '#4FC3C3',
          400: '#7DD3D2',
          300: '#a5e3e2',
        },
        coral: {
          700: '#a83020',
          600: '#C93C2B',
          500: '#E84B3A',
          400: '#F06B5C',
        },
        steel: {
          800: '#1E4258',
          700: '#265077',
          600: '#2D6B9E',
        },
        primary: {
          50: '#f0f9ff',
          100: '#e0f4ff',
          500: '#4FC3C3',
          600: '#3D9B99',
          700: '#2D5F5D',
        },
      },
      fontFamily: {
        sans:    ['Outfit', 'system-ui', 'sans-serif'],
        display: ['"Barlow Condensed"', 'sans-serif'],
      },
      animation: {
        'float':      'float 7s ease-in-out infinite',
        'float-slow': 'floatSlow 11s ease-in-out infinite',
        'fade-in':    'fadeIn 0.6s ease-in-out',
        'slide-up':   'slideUp 0.7s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-16px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%':       { transform: 'translateY(-10px) rotate(3deg)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
