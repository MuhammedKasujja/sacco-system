import { db } from '@/db'
import { createServerFn } from '@tanstack/react-start'

export type MemberEntity = Omit<Awaited<ReturnType<typeof fetchMembers>>[0], "password">

export const fetchMembers = createServerFn().handler(() => {
  return db.query.members.findMany()
})
