import { db } from '@/db'
import { loans, members, savingsAccounts, transactions } from '@/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { sum } from 'drizzle-orm'

export const getDashboardStatistics = createServerFn().handler(async () => {
  const memberCount = await db.$count(members)

  //   const loanCount = await db.$count(loans)
  const loansTotal = await db
    .select({
      total: sum(loans.principalAmount),
    })
    .from(loans)

  const savingsTotal = await db
    .select({
      total: sum(savingsAccounts.balance),
    })
    .from(savingsAccounts)

  const loanRepaymentCount = await db.$count(transactions)

  return {
    totalMembers: memberCount,
    totalLoanAmount: loansTotal[0].total ?? 0,
    totalSavingsAmount: savingsTotal[0].total ?? 0,
    totalLoanRepayments: loanRepaymentCount,
  }
})
