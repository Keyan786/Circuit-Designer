/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,css}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f8ff',
          100: '#e9efff',
          200: '#cfdcff',
          300: '#a8beff',
          400: '#7c9aff',
          500: '#597bff',
          600: '#3a5fff',
          700: '#2747e6',
          800: '#1f39b3',
          900: '#1b3291',
        },
        surface: {
          base: '#ffffff',
          subtle: '#fafafa',
          muted: '#f4f4f5',
        },
        border: {
          subtle: '#e5e7eb',
          strong: '#d1d5db',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.06), 0 1px 1px rgba(0,0,0,0.04)',
      },
      borderRadius: {
        xl: '0.75rem',
      },
    },
  },
}


