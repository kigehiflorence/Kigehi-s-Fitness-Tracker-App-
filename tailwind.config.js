/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-pink': '#FF69B4', // Hot pink for accents
        'brand-dark': '#1A1A1A', // Soft black for text
        'brand-bg': '#FFF0F5',   // Lavender Blush for background
      }
    },
  },
  plugins: [],
}