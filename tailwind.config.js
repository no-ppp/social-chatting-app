/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'discord-gray-light': '#36393f',
        'discord-gray': '#36393f',
        'discord-dark': '#202225',
        'discord-sidebar': '#2f3136',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}
