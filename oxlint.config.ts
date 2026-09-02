import config from '@the1812/oxc-config/oxlint'
import { defineConfig } from 'oxlint'

export default defineConfig({
  extends: [config],
  categories: {
    correctness: 'off',
  },
  options: {
    typeAware: true,
    typeCheck: true,
  },
  ignorePatterns: ['.output/', 'node_modules/', 'public/data/'],
  overrides: [
    {
      files: ['server/routes/**/*.ts'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
})
