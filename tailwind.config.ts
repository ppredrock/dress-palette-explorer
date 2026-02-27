import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — true pinks, fashion-luxury
        brand: {
          50: "#FFF0F6",
          100: "#FFE3EF",
          200: "#FFBAD8",
          300: "#FF8EBE",
          400: "#F760A4",
          500: "#E8368B",
          600: "#C92076",
          700: "#A3185E",
          800: "#821649",
          900: "#671238",
          950: "#3D0A21",
        },
        blush: {
          50: "#FFF5FA",
          100: "#FFE8F4",
          200: "#FFD0E8",
          300: "#FFB0D4",
          400: "#FF85B8",
          500: "#FF5C9C",
          600: "#E8387D",
          700: "#C22767",
          800: "#9C1E52",
          900: "#7A173F",
        },
        rose: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
          950: "#4c0519",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "pink-sm": "0 1px 3px 0 rgb(232 54 139 / 0.12)",
        "pink-md": "0 4px 16px 0 rgb(232 54 139 / 0.16)",
        "pink-lg": "0 8px 32px 0 rgb(232 54 139 / 0.20)",
        "pink-xl": "0 16px 48px 0 rgb(232 54 139 / 0.24)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
