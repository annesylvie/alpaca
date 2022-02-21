module.exports = {
  content: ['./src/**/*.{html,js,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'blue': {
        500: "#2F549D",
        600: "#2a4b8d",
        700: "#26437e",
        800: "#1d3461",
      },
      'blueGray': {
        600: "#475E8C"
      },
      'gold': '#ffa630',
      'orange': "#F79256",
      'cream': '#f0f7ee',
    },
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ]
}
