/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E88E5',
        green: '#43A047',
        red: '#E53935',
        yellow: '#FDD835'
      }
    },
  },
  plugins: [],
}

