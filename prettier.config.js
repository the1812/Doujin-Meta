import { prettierConfig } from '@the1812/eslint-config/prettier'

/**
 * @type {import("prettier").Config}
 */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  ...prettierConfig,
}

export default config
