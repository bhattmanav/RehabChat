/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        borderColor: "#1f2937",
        buttonColor: "#3078af",
      },
    },
  },
  plugins: [],
};
