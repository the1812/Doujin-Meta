const { extendNamingConvention } = require('@the1812/eslint-config/utils')

module.exports = {
  extends: ['@the1812/eslint-config/vue'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['vite.*.ts', '*.config.*'],
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      ...extendNamingConvention({ allowedPatterns: ['zhCN', 'enUS', 'DEFAULT'] }),
    ],
  },
  overrides: [
    {
      files: ['api/**/*.ts'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
}
