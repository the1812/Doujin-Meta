import config from '@the1812/oxc-config/oxfmt'
import { defineConfig } from 'oxfmt'

export default defineConfig({
  ...config,
  ignorePatterns: [...(config.ignorePatterns ?? []), '.output/', 'server-dist/', 'public/data/'],
})
