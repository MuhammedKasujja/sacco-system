import { db } from '@/db'
import { transactions } from '@/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { isNotNull } from 'drizzle-orm'

export const fetchLoanTransactions = createServerFn().handler(() => {
  return db.select().from(transactions).where(isNotNull(transactions.loanId))
})

export const fetchSavingTransactions = createServerFn().handler(() => {
  return db.select().from(transactions).where(isNotNull(transactions.accountId))
})
