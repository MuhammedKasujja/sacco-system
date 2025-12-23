import { db } from '@/db'
import { createServerFn } from '@tanstack/react-start'

export const fetchLoanRepayments = createServerFn().handler(() => {
  return db.query.loanRepayments.findMany()
})