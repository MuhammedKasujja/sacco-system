import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import * as schema from './schema.ts'
import { Table } from 'drizzle-orm'
import { getTableConfig } from 'drizzle-orm/pg-core'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
})
export const db = drizzle(pool, { schema })

export function getDbTableNames<T extends Record<string, Table>>(tables: T) {
  return Object.fromEntries(
    Object.entries(tables).map(([key, table]) => [
      key,
      getDbTableName(table as Table),
    ]),
  ) as { [K in keyof T]: string }
}

// Usage
// const tableNames = getTableNames({ users, posts });
// console.log(tableNames);
// → { users: 'users', posts: 'app_posts' }

/**
 * get the database level table name
 * @param table
 * @returns string
 */
export function getDbTableName<T extends Table>(table: T): string {
  const config = getTableConfig(table)
  return config.name
}
