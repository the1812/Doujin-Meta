import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette'

const getColor = (value: string | { DEFAULT: string }) => {
  return typeof value === 'string' ? value : value.DEFAULT
}

export const config: Config = {
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
        'github-black': {
          light: '#31363c',
          DEFAULT: '#24292e',
        },
      },
    },
  },
  plugins: [
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'shadow-border': (value: string) => ({
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
            boxShadow: `0 0 0 2px #ffffff, 0 0 0 4px ${getColor(value)}`,
          }),
        },
        {
          values: flattenColorPalette(theme('colors')),
        },
      )
    }),
  ],
}
export default config
