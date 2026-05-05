/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      colors: {
        cream: "#FEFAE0",
        forest: {
          DEFAULT: "#2D6A4F",
          dark: "#1e5038",
          light: "#52B788",
          tint: "#D8F3DC",
        },
        clay: {
          DEFAULT: "#774936",
          tint: "#f5ede8",
        },
        ink: "#1B1B1B",
        muted: "#7A7A6E",
      },
    },
  },
  plugins: [],
}
