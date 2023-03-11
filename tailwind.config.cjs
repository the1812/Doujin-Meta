const plugin = require('tailwindcss/plugin')

const getColor = (value) => {
  return typeof value === 'string' ? value : value.DEFAULT
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'thb-wiki-pink': {
          light: '#fd91ec',
          DEFAULT: '#fd77e8',
        },
        'thb-wiki-orange': {
          light: '#ffb12b',
          DEFAULT: '#ffa814',
        },
        'dizzylab-orange': {
          light: '#Ff723e',
          DEFAULT: '#ff601c',
        },
      },
    },
  },
  plugins: [
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'shadow-border': value => ({
            boxShadow: `0 0 0 ${getColor(value)} rgba(0,0,0,0.05)`,
          }),
        },
        {
          values: theme('borderWidth'),
        },
      )
      matchUtilities(
        {
          'button-border': value => ({
            boxShadow: `0 0 0 2px #ffffff, 0 0 0 4px ${getColor(value)}, 0 1px 2px 0 rgba(0, 0, 0, 0)`,
          }),
        },
        {
          values: theme('backgroundColor'),
        },
      )
    }),
  ],
}
