import { db } from '@/db'
import { createServerFn } from '@tanstack/react-start'

export const fetchMembers = createServerFn().handler(() => {
  return db.query.members.findMany()
})
