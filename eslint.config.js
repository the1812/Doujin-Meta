import config from '@the1812/eslint-config/vue'

/** @type import('eslint').Linter.Config */
export default [
  ...config,
  {
    files: ['api/**/*.ts'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
]
