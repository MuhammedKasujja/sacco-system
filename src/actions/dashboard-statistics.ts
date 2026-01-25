import { db } from '@/db'
import {
  loans,
  members,
  savingsAccounts,
  savingsTransactions,
  transactions,
} from '@/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { sum, desc, eq } from 'drizzle-orm'

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

  const recentSavings = await db
    .select()
    .from(savingsTransactions)
    .innerJoin(
      savingsAccounts,
      eq(savingsTransactions.accountId, savingsAccounts.id),
    )
    .innerJoin(members, eq(savingsTransactions.memberId, members.id))
    .orderBy(desc(savingsTransactions.createdAt))
    .limit(10)

  const recentLoanPayments = await db.query.transactions.findMany({
    with: {
      loan: true,
      member: true,
    },
    limit: 10,
    orderBy: desc(transactions.createdAt),
  })

  return {
    totalMembers: memberCount,
    totalLoanAmount: loansTotal[0].total ?? 0,
    totalSavingsAmount: savingsTotal[0].total ?? 0,
    totalLoanRepayments: loanRepaymentCount,
    recentSavings,
    recentLoanPayments,
  }
})
