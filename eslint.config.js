import { extendNamingConvention } from '@the1812/eslint-config/utils'
import config from '@the1812/eslint-config/vue'

/** @type import('eslint').Linter.Config */
export default [
  ...config,
  {
    files: ['api/**/*.ts', 'api-support/**/*.ts'],
    rules: {
      'import/no-default-export': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        ...extendNamingConvention({ allowedPatterns: ['^[a-zA-Z_]+$'] }),
      ],
    },
  },
]
