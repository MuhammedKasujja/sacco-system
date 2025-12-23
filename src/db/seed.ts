// make sure to load env variables
import 'dotenv/config'
/////////////////////////////////////
import {
  auditLogs,
  loanProducts,
  loanRepayments,
  loans,
  members,
  savingsAccounts,
  savingsProducts,
  transactions,
  users,
} from './schema'
import { db } from '.'
import { DatabaseSeeder } from './database_seeder'

async function resetDb() {
  try {
    // console.log('Current Env:', process.env)
    // const result = await db.execute(sql`SELECT current_database()`)
    // console.log('Connected to database:', result.rows)

    /// clear data base
    await db.delete(loans)
    await db.delete(loanProducts)
    await db.delete(loanRepayments)
    await db.delete(savingsAccounts)
    await db.delete(savingsProducts)
    await db.delete(auditLogs)
    await db.delete(transactions)
    await db.delete(users)
    await db.delete(members)

    console.log('🗑️  Cleared existing data')
  } catch (error) {
    console.warn('⚠️  Some tables might not exist yet — continuing', error)
  }
}

const main = async () => {
  console.log('\n\nSeeding data ...')

  await resetDb()

  await new DatabaseSeeder().build()
}

main().finally(async () => {
  // imediately terminate the connection after seeding data
  console.log('*** Seeding successfully ***\n')
  await db.$client.end()
})
