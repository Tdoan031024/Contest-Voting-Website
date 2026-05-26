/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        adminBg: "#0F172A",
        adminSidebar: "#1E293B",
        adminPrimary: "#3B82F6",
      }
    },
  },
  plugins: [],
}
