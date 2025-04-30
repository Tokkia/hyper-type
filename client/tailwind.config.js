/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#26282A',
        overlay: '#323437',
        accent: '#8C95AA',
        accentText: '#ECEFF2'
      }
    },
    fontFamily: {
      mono: ['"Roboto Mono"', 'monospace'],
    },
    
  },
  plugins: [],
}