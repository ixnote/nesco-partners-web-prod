/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          main: "var(--brand-main)",
          "main-bg": "var(--brand-main-bg)",
          secondary: "var(--brand-secondary)",
          "light-bg": "var(--brand-light-bg)",
          black: "var(--brand-black)",
          white: "var(--brand-white)",
          ash: "var(--brand-ash)",
          "success-bg": "var(--brand-success-bg)",
          "success-text": "var(--brand-success-text)",
          "failed-bg": "var(--brand-failed-bg)",
          "failed-text": "var(--brand-failed-text)",
          "pending-bg": "var(--brand-pending-bg)",
          "pending-text": "var(--brand-pending-text)",
          "border-light": "var(--brand-border-light)",
          "border-dark": "var(--brand-border-dark)",
        },
      },
    },
  },
  plugins: [],
};
