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
        // Brand — deep sophisticated rose (luxury Indian fashion)
        brand: {
          50:  "#FBF0F5",
          100: "#F5DCEC",
          200: "#EABCD6",
          300: "#D98DB7",
          400: "#C95E92",
          500: "#B8336A",
          600: "#96265A",
          700: "#7B1A4A",
          800: "#5F1238",
          900: "#3F0B24",
          950: "#240517",
        },
        // Blush — warm nude/champagne (soft backgrounds)
        blush: {
          50:  "#FDF8F5",
          100: "#FAF0E8",
          200: "#F5DDD0",
          300: "#EDCABB",
          400: "#E2B09A",
          500: "#D4967A",
          600: "#B87558",
          700: "#8F5640",
          800: "#6B3F2D",
          900: "#4A2C1D",
        },
        // Gold — luxury accent
        gold: {
          50:  "#FDFAF0",
          100: "#FAF2D3",
          200: "#F3E2A0",
          300: "#E8CC6A",
          400: "#DAB545",
          500: "#C9A030",
          600: "#A07D22",
          700: "#7D6019",
          800: "#5A4512",
          900: "#38290B",
        },
        rose: {
          50:  "#fff1f2",
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
        // Luxury warm-neutral shadows
        "warm-sm": "0 1px 3px 0 rgb(26 10 15 / 0.08)",
        "warm-md": "0 4px 16px 0 rgb(26 10 15 / 0.10)",
        "warm-lg": "0 8px 32px 0 rgb(26 10 15 / 0.14)",
        "warm-xl": "0 16px 48px 0 rgb(26 10 15 / 0.18)",
        "gold-glow": "0 4px 24px 0 rgb(201 160 48 / 0.30)",
        // Keep pink tokens for backward compatibility
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
