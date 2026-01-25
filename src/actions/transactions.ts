import { db } from '@/db'
import { loans, members, transactions } from '@/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { eq, isNotNull, desc } from 'drizzle-orm'

export type TransactionEntity = Awaited<
  ReturnType<typeof getTransactions>
>[0]

export const getTransactions = createServerFn().handler(() => {
  return db
    .select()
    .from(transactions)
    .where(isNotNull(transactions.loanId))
    .innerJoin(members, eq(transactions.memberId, members.id))
    .innerJoin(loans, eq(loans.id, transactions.loanId))
    .orderBy(desc(transactions.createdAt))
})

export const fetchSavingTransactions = createServerFn().handler(() => {
  return db.select().from(transactions).where(isNotNull(transactions.accountId))
})
