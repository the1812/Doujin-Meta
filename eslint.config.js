import config from '@the1812/eslint-config/vue'

/** @type import('eslint').Linter.Config */
export default [
  { ignores: ['dist/**', '.output/**', 'server-dist/**'] },
  ...config,
  {
    files: ['server/routes/**/*.ts'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
]
