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
      },
      animation: {
        'pulse-border': 'pulse 1.5s infinite',
      },
      keyframes: {
        pulse: {
          '0%': { borderColor: 'rgba(255, 255, 255, 0.5)' },
          '50%': { borderColor: 'rgba(255, 255, 255, 1)' },
          '100%': { borderColor: 'rgba(255, 255, 255, 0.5)' },
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}
