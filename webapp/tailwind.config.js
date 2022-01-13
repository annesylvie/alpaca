module.exports = {
    content: ['./src/**/*.{html,js,tsx}'],
    theme: {
        extend: {},
    },
    plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
    ]
}
