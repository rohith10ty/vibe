/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        fashion: {
          red: '#ff1100',
          dark: '#0a0a0a',
          light: '#f9f9f9',
          accent: '#e63946'
        }
      }
    },
  },
  plugins: [],
}
