import { db } from '@/db'
import { loans, members, transactions } from '@/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { eq, isNotNull } from 'drizzle-orm'

export type LoanTransactionEntity = Awaited<
  ReturnType<typeof fetchLoanTransactions>
>[0]

export const fetchLoanTransactions = createServerFn().handler(() => {
  return db
    .select()
    .from(transactions)
    .where(isNotNull(transactions.loanId))
    .innerJoin(members, eq(transactions.memberId, members.id))
    .innerJoin(loans, eq(loans.id, transactions.loanId))
})

export const fetchSavingTransactions = createServerFn().handler(() => {
  return db.select().from(transactions).where(isNotNull(transactions.accountId))
})
