/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,mdx}",
    "./components/**/*.{js,jsx,mdx}",
    "./content/**/*.{md,mdx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: "#0F0F2E",
        primary: "#8B5CF6",
        secondary: "#3B82F6",
      },
    },
  },
  plugins: [],
};
