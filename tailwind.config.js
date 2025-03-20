// tailwind.config.js
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html",
    ],
    theme: {
      extend: {
        colors: {
          orange: {
            500: '#cb7f1d',
          },
          cyan: {
            500: '#53acb2',
          }
        }
      },
    },
    plugins: [],
  }