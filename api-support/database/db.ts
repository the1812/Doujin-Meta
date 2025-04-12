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
  if (process.env.IS_LOCAL === '1') {
    console.log('db type', 'local')
    return getRequiredEnv('POSTGRES_LOCAL_URL')
  }
  if (process.env.IS_PREVIEW === '1') {
    console.log('db type', 'development')
    return getRequiredEnv('POSTGRES_DEVELOPMENT_URL')
  }
  console.log('db type', 'production')
  return getRequiredEnv('POSTGRES_URL')
}

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: getDatabaseUrl(),
    ssl: process.env.IS_LOCAL === undefined,
  }),
})

export const db = new Kysely<Database>({
  dialect,
  log: ['query', 'error'],
})
