import { db } from '@/db'
import { createServerFn } from '@tanstack/react-start'

export type LoanEntity = Awaited<ReturnType<typeof fetchLoans>>[0]

export const fetchLoans = createServerFn().handler(() => {
  return db.query.loans.findMany({
    with: {
      member: {
        columns:{
          id: true,
          idNumber: true,
          firstName: true,
          lastName: true,
          phone: true,
          email: true,
          address: true,
          joinDate: true,
        }
      },
    },
  })
})
