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
          layout: {},
          colors: {
            default: {
              50: "#fafafa",
              100: "#f2f2f3",
              200: "#ebebec",
              300: "#e3e3e6",
              400: "#dcdcdf",
              500: "#d4d4d8",
              600: "#afafb2",
              700: "#8a8a8c",
              800: "#656567",
              900: "#404041",
              foreground: "#000",
              DEFAULT: "#d4d4d8",
            },
            primary: {
              50: "#dfedfd",
              100: "#b3d4fa",
              200: "#86bbf7",
              300: "#59a1f4",
              400: "#2d88f1",
              500: "#006fee",
              600: "#005cc4",
              700: "#00489b",
              800: "#003571",
              900: "#002147",
              foreground: "#fff",
              DEFAULT: "#ff0000",
            },
            secondary: {
              50: "#eee4f8",
              100: "#d7bfef",
              200: "#bf99e5",
              300: "#a773db",
              400: "#904ed2",
              500: "#7828c8",
              600: "#6321a5",
              700: "#4e1a82",
              800: "#39135f",
              900: "#240c3c",
              foreground: "#fff",
              DEFAULT: "#7828c8",
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
            focus: "#006FEE",
            overlay: "#000000",
          },
        },
        dark: {
          layout: {},
          colors: {
            default: {
              50: "#0A0A0A", /// Sidebar bg color - confirmed
              100: "#1E1E1E", /// Chat Input bg color - confirmed
              200: "#2a2a2a", // User Chat bubble bg color
              300: "#323238",
              400: "#3f3f46",
              500: "#65656b",
              600: "#8c8c90",
              700: "#b2b2b5",
              800: "#d9d9da",
              900: "#ffffff",
              foreground: "#fff",
              DEFAULT: "#0F0F0F",
            },
            primary: {
              50: "#002147",
              100: "#003571",
              200: "#00489b",
              300: "#005cc4",
              400: "#006fee",
              500: "#2d88f1",
              600: "#59a1f4",
              700: "#86bbf7",
              800: "#b3d4fa",
              900: "#dfedfd",
              foreground: "#fff",
              DEFAULT: "#006fee",
            },
            secondary: {
              50: "#240c3c",
              100: "#39135f",
              200: "#4e1a82",
              300: "#6321a5",
              400: "#7828c8",
              500: "#904ed2",
              600: "#a773db",
              700: "#bf99e5",
              800: "#d7bfef",
              900: "#eee4f8",
              foreground: "#fff",
              DEFAULT: "#7828c8",
            },
            background: "#141415",
            foreground: "#ffffff",
            content1: {
              DEFAULT: "#171717", // Sidebar Menu bg color - confirmed
              foreground: "#fff",
            },
            content2: {
              DEFAULT: "#0a0a0a", /// Loading Skeleton bg color - confirmed
              foreground: "#fff",
            },
            content3: {
              DEFAULT: "#0a0a0a",
              foreground: "#fff",
            },
            content4: {
              DEFAULT: "#0a0a0a",
              foreground: "#fff",
            },

            focus: "#006FEE",
            overlay: "#0E0E0E",
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
