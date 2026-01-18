import { db } from '@/db'
import { createServerFn } from '@tanstack/react-start'

export const fetchLoanSchedules = createServerFn().handler(() => {
  return db.query.loanSchedules.findMany()
})