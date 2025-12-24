import { db } from '@/db'
import { createServerFn } from '@tanstack/react-start'

export type LoanEntity = Awaited<ReturnType<typeof fetchLoans>>[0]

export const fetchLoans = createServerFn().handler(() => {
  return db.query.loans.findMany({
    with: {
      member: true,
    },
  })
})
