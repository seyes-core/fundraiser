/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        stone: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
        },
        ink: "#1a1a1a",
        lead: "#3d3d3d",
        mist: "#f7f7f5",
        rule: "#e4e2de",
        accent: "#2563eb",
        "accent-light": "#eff6ff",
        success: "#16a34a",
        "success-light": "#f0fdf4",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        mono: ["var(--font-jetbrains)", "Menlo", "monospace"],
      },
      maxWidth: {
        prose: "68ch",
        content: "1100px",
      },
      spacing: {
        section: "5rem",
      },
    },
  },
  plugins: [],
};
