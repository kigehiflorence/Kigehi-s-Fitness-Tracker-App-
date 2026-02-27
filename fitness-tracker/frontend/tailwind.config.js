/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-pink': '#C2185B', 
        'brand-dark': '#1A1A1A', 
        'brand-bg': '#FFF0F5',   
      }
    },
  },
  plugins: [],
}