/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Це вказує Tailwind шукати класи в усіх JS/TS файлах
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
