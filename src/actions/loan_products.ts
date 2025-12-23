import { db } from '@/db'
import { createServerFn } from '@tanstack/react-start'

export const fetchLoanProducts = createServerFn().handler(() => {
  return db.query.loanProducts.findMany()
})