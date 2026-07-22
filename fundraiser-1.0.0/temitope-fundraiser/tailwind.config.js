/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        /* Surfaces */
        canvas: "#FAFAF8",
        surface: "#FFFFFF",
        subtle: "#F3F2EF",
        mist: "#F7F7F5",

        /* Lines */
        rule: "#E4E2DE",
        line: "#E8E6E1",

        /* Text */
        ink: "#1A1917",
        lead: "#3D3D3D",
        muted: "#6B6860",
        faint: "#9C9A95",

        /* Structural brand (headers, tints, quote panels, dark sections) */
        navy: {
          DEFAULT: "#1B3A5C",
          deep: "#122A45",
          light: "#EEF3F8",
          border: "#C8D8E8",
        },

        /* CTA-only accent — never used for anything but primary actions */
        accent: {
          DEFAULT: "#B4770E",
          hover: "#96620C",
          light: "#FDF4E4",
          border: "#E8C97A",
        },

        amber: {
          DEFAULT: "#C8861A",
          light: "#FDF4E4",
          border: "#E8C97A",
        },
        success: { DEFAULT: "#2D6A4F", light: "#EAF5EE" },
      },
      fontFamily: {
        display: ["'Lora'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      fontSize: {
        /* Fluid type scale — headlines stay large on mobile (never shrink >35-40%) */
        h1: ["clamp(2.125rem, 7vw, 3.25rem)", { lineHeight: "1.08", letterSpacing: "-0.025em" }],
        h2: ["clamp(1.625rem, 5vw, 2.25rem)", { lineHeight: "1.12", letterSpacing: "-0.02em" }],
        h3: ["clamp(1.185rem, 4vw, 1.375rem)", { lineHeight: "1.25" }],
      },
      borderRadius: {
        card: "14px",
        modal: "20px",
      },
      boxShadow: {
        modal: "0 24px 64px rgba(0,0,0,0.18)",
        card: "0 1px 4px rgba(0,0,0,0.06)",
        header: "0 1px 12px rgba(0,0,0,0.07)",
      },
      maxWidth: {
        content: "1060px",
        prose: "68ch",
      },
      minHeight: {
        tap: "44px",
      },
    },
  },
  plugins: [],
};
