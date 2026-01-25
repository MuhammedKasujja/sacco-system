import { db } from '@/db'
import { createServerFn } from '@tanstack/react-start'

export const fetchSavingProducts = createServerFn().handler(() => {
  return db.query.savingsProducts.findMany()
})
