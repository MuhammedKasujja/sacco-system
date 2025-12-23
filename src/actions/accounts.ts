import { db } from '@/db'
import { createServerFn } from '@tanstack/react-start'

export type Account = Awaited<ReturnType<typeof fetchAccounts>>[0]

export const fetchAccounts = createServerFn().handler(() => {
  return db.query.savingsAccounts.findMany()
})
