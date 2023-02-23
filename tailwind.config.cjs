const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'shadow-border': value => ({
            boxShadow: `0 0 0 ${value} rgba(0,0,0,0.05)`,
          }),
        },
        {
          values: theme('borderWidth'),
        },
      )
    }),
  ],
}
