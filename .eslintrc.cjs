module.exports = {
  extends: ['@the1812/eslint-config/vue'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['vite.*.ts', '*.config.*'],
      },
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
