import { db } from '@/db'
import { createServerFn } from '@tanstack/react-start'

export const fetchLoans = createServerFn().handler(() => {
  return db.query.loans.findMany()
})
