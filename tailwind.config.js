/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      primary: "#3b5998",
      socialBlue: "#00acee",
      complementaryLight: "#ff4500",
      complementaryDark: "#7fc15e",
      neutral: "#f5f5f5",
      neutralDark: "#333333",
    },
  },
  plugins: [],
};
