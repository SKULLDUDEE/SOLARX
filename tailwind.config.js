/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#fff0e0',
          100: '#ffebdc',
          500: '#ff8c00',
          600: '#ff5e00',
          700: '#e04d00',
        },
      },
    },
  },
  plugins: [],
}