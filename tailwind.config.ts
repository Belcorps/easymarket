import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#ea580c",
          hover: "#c2410c",
          light: "#f97316",
        },
        sidebar: {
          DEFAULT: "#1e293b",
          hover: "#334155",
        },
      },
    },
  },
  plugins: [],
};
export default config;
