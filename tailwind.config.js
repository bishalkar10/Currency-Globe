/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        shake: {
          "5%, 15%, 25%, 35%, 45%, 55%, 65%, 75%, 85%, 95%": {
            transform: "rotate(-2deg)",
          },
          "10%, 20%, 30%, 40%, 50%, 60%, 70%, 80%, 90%": {
            transform: "rotate(2deg)",
          },
          "0%, 100%": {
            transform: "rotate(0)",
            borderColor: "red",
            color: "red",
          },
        },
      },
      animation: {
        shake: "shake 0.5s ease-in-out forwards",
      },
      screens: {
        sm2: { min: "680px" },
      },
      fontFamily: {
        Roboto: ["Roboto", "sans"],
        Inter: ["Inter", "sans"],
      },
    },
  },
  plugins: [],
};
