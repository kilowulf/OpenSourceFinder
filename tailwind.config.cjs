/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  content: {
    safelist: [],
    files: ["./src/**/*.{vue,js,ts,jsx,tsx}"]
  },
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
};