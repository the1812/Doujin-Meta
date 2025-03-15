import type { Database } from './types.js'
import pg from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

const { Pool } = pg

const getRequiredEnv = (key: string) => {
  const value = process.env[key]
  if (value === undefined) {
    throw new Error(`required env "${key}" not specified`)
  }
  return value
}

const getDatabaseUrl = () => {
  if (process.env.IS_LOCAL === '1' || process.env.IS_PREVIEW === '1') {
    return getRequiredEnv('POSTGRES_DEVELOPMENT_URL')
  }
  return getRequiredEnv('POSTGRES_URL')
}

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: getDatabaseUrl(),
  }),
})

export const db = new Kysely<Database>({
  dialect,
  log: ['query', 'error'],
})
