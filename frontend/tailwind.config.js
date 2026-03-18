/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef9f3',
          100: '#d5f0e1',
          200: '#aee0c5',
          300: '#7dcba4',
          400: '#4db082',
          500: '#2e9468',
          600: '#1f7652',
          700: '#185e41',
          800: '#134a34',
          900: '#0e3a28',
        },
        accent: {
          400: '#f6ad55',
          500: '#ed8936',
        }
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 2px 16px 0 rgba(0,0,0,0.07)',
        'card-hover': '0 8px 32px 0 rgba(0,0,0,0.13)',
      }
    },
  },
  plugins: [],
}
