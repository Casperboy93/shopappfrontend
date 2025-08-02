/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './index.html',
      './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          'sans': ['MPLUS Rounded 1c', 'sans-serif'], // Set as default
          'cairo': ['Cairo', 'sans-serif'],
          'mplus': ['MPLUS Rounded 1c', 'sans-serif'],
          'primary': ['MPLUS Rounded 1c', 'sans-serif'],
          'arabic': ['Cairo', 'sans-serif'],
        },
        colors: {
          'golden': {
            50: '#fffdf7',
            100: '#fffaeb',
            200: '#fff3c4',
            300: '#ffe888',
            400: '#ffd43b',
            500: '#ffbe0b',
            600: '#e8a317',
            700: '#d18700',
            800: '#a86f00',
            900: '#8b5a00',
          },
          'emerald-custom': {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
          },
        },
        backgroundImage: {
          'gradient-golden': 'linear-gradient(135deg, #ffbe0b 0%, #d18700 100%)',
          'gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          'gradient-emerald': 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
        }
      },
    },
    plugins: [],
  }

  