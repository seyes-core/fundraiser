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
        canvas: "#FAFAF8",
        surface: "#FFFFFF",
        border: "#E8E6E1",
        subtle: "#F3F2EF",
        ink: "#1A1917",
        muted: "#6B6860",
        faint: "#9C9A95",
        navy: { DEFAULT: "#1B3A5C", light: "#EEF3F8", border: "#C8D8E8" },
        amber: { DEFAULT: "#C8861A", light: "#FDF4E4", border: "#E8C97A" },
        success: { DEFAULT: "#2D6A4F", light: "#EAF5EE" },
      },
      fontFamily: {
        display: ["'Lora'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
        modal: "20px",
      },
      boxShadow: {
        modal: "0 24px 64px rgba(0,0,0,0.18)",
        card: "0 1px 4px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
