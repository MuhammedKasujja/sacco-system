import { db } from '@/db'
import { createServerFn } from '@tanstack/react-start'

export type MemberEntity = Awaited<ReturnType<typeof fetchMembers>>[0]

export const fetchMembers = createServerFn().handler(() => {
  return db.query.members.findMany({
    columns: {
      id: true,
      idNumber: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      phone: true,
      joinDate: true,
    },
  })
})
