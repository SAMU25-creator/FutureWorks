import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f0f4ff",
          100: "#e0e9ff",
          200: "#c7d6fe",
          300: "#a5b8fc",
          400: "#8191f8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        accent: {
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
        },
        success: {
          400: "#4ade80",
          500: "#22c55e",
        },
        warning: {
          400: "#facc15",
          500: "#eab308",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
