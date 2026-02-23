import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Force light mode only
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand palette – earthy eco tones
        forest: {
          50:  "#f2f7f2",
          100: "#e0ede0",
          200: "#c2dbc2",
          300: "#96c096",
          400: "#639f63",
          500: "#3e7d3e",
          600: "#2e6130",
          700: "#264f28",
          800: "#1f3f21",
          900: "#19331b",
        },
        earth: {
          50:  "#faf6f0",
          100: "#f2e9d8",
          200: "#e4d0b0",
          300: "#d2b07f",
          400: "#c09055",
          500: "#a87438",
          600: "#8a5c2c",
          700: "#6e4724",
          800: "#57381d",
          900: "#452d17",
        },
        cream: "#fdfaf5",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
