/** @type {import("tailwindcss").Config} */

module.exports = {
  content: ["src/**/*.{html,js,jsx,ts,tsx}", "index.html"],
  theme: {
    extend: {
      colors: {
        expresscash: {
          yellow: "#FCD34D",
          black: "#111827",
          textos: "#575757",
          skyBlue: "#8CC63F",
          white: "#FFF",
          gray: "#AAA",
          gray2: "#C4C4C4",
          gray3: "#F9F9F9",
          red: "#ED1A00",
          green: "#05B922",
          blue: "#00A5E7",
        },
      },
      fontFamily: {
        light: ["Gotham Light", "sans-serif"],
        regular: ["Gotham Regular", "sans-serif"],
        medium: ["Gotham Medium", "sans-serif"],
        bold: ["Gotham Bold", "sans-serif"],
        normal: ["Gotham Medium", "sans-serif"],
        book: ["Gotham Book", "sans-serif"],
      },
      keyframes: {
        "rotate-clockwise": {
          from: {
            transform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(360deg)",
          },
        },
        "rotate-counterclockwise": {
          from: {
            transform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(-360deg)",
          },
        },
        bounce: {
          "0%, 100%": {
            transform: "translateY(-250%)",
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(0)",
            "animation-timing-function": "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        padelinkInput: {
          "0%": {
            transform: "scale(1)",
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
          "100%": {
            transform: "scale(1000)",
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
        },
      },
      animation: {
        rotateClockwise: "rotate-clockwise 2s infinite linear",
        rotateCounterClockwise: "rotate-counterclockwise 2s infinite linear",
        bounce: "bounce 1s ease-out infinite",
        padelinkInput: "padelinkInput 1s ease-in-out forwards",
      },
    },
  },
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    require("@tailwindcss/forms"),
  ],
};
