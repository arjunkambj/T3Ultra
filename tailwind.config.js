import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {},
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              50: "#e6eeff",
              100: "#b3ccff",
              200: "#80aaff",
              300: "#4d88ff",
              400: "#1a66ff",
              500: "#0830ac",
              600: "#062690",
              700: "#051d73",
              800: "#041357",
              900: "#020a3a",
              foreground: "#fff",
              DEFAULT: "#0830ac",
            },
            secondary: {
              DEFAULT: "#ffffff",
            },
            background: "#ffffff",
            foreground: "#000000",
            content1: {
              DEFAULT: "#ffffff",
              foreground: "#000",
            },
            content2: {
              DEFAULT: "#f4f4f5",
              foreground: "#000",
            },
            content3: {
              DEFAULT: "#e4e4e7",
              foreground: "#000",
            },
            content4: {
              DEFAULT: "#d4d4d8",
              foreground: "#000",
            },
            focus: "#0830ac",
            overlay: "#000000",
          },
        },
        dark: {
          colors: {
            primary: {
              50: "#020a3a",
              100: "#041357",
              200: "#051d73",
              300: "#062690",
              400: "#0830ac",
              500: "#1a66ff",
              600: "#4d88ff",
              700: "#80aaff",
              800: "#b3ccff",
              900: "#e6eeff",
              foreground: "#fff",
              DEFAULT: "#0830ac",
            },
            secondary: {
              DEFAULT: "#000000",
            },
            background: "#000000",
            foreground: "#ffffff",
            content1: {
              DEFAULT: "#18181b",
              foreground: "#fff",
            },
            content2: {
              DEFAULT: "#27272a",
              foreground: "#fff",
            },
            content3: {
              DEFAULT: "#3f3f46",
              foreground: "#fff",
            },
            content4: {
              DEFAULT: "#52525b",
              foreground: "#fff",
            },
            focus: "#0830ac",
            overlay: "#ffffff",
          },
        },
      },
      layout: {
        disabledOpacity: "0.5",
      },
    }),
  ],
};

module.exports = config;
