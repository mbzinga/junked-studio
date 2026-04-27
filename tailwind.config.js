/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFFDD0',
        surface: '#fff8f8',
        'surface-low': '#fdf1f3',
        'surface-container': '#f7ebee',
        primary: '#864c6a',
        'primary-container': '#ffb6d9',
        secondary: '#b6005a',
        'secondary-container': '#de1d72',
        'on-surface': '#201a1c',
        outline: '#827379',
        'outline-variant': '#d4c2c8',
      },
      fontFamily: { sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
