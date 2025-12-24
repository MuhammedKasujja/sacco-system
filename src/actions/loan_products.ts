import { db } from '@/db'
import { createServerFn } from '@tanstack/react-start'

export type LoanProductEntity = Awaited<ReturnType<typeof fetchLoanProducts>>[0]

export const fetchLoanProducts = createServerFn().handler(() => {
  return db.query.loanProducts.findMany()
})