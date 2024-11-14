/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        
      },
    },
  },
  plugins: [],
}



// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}", // Adjust paths if necessary
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         inter: ["Inter", "sans-serif"],
//         gelasio: ["Gelasio", "serif"],
//       },
//       colors: {
//         purple: "#A855F7",
//         grey: "#D1D5DB",
//         "dark-grey": "#6B7280",
//       },
//     },
//   },
//   plugins: [],
// };
