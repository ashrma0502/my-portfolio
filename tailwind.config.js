/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#050816',
          secondary: '#0B1026',
          tertiary: '#121826',
        },
        primary: {
          DEFAULT: '#8B5CF6',
          light: '#A855F7',
        },
        accent: {
          cyan: '#06B6D4',
          cyanLight: '#22D3EE',
          pink: '#EC4899',
          green: '#22C55E'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}
