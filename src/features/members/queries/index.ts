import { db } from '@/db'
import { loans, members } from '@/db/schema'
import { LoanIdSchema } from '@/features/loans/schemas'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { MemberIdSchema } from '../schemas'
import { MemberNotFoundException } from '@/server/execptions'

export type MembersWithAccountsType = Awaited<
  ReturnType<typeof getMembersWithAccounts>
>[0]

export type MemberAccount = Awaited<
  ReturnType<typeof getMembersWithAccounts>
>[0]['accounts'][0]

export const getMemberByLoanIdFn = createServerFn({ method: 'POST' })
  .inputValidator(LoanIdSchema.parse)
  .handler(async ({ data }) => {
    const selectedMember = await db
      .select()
      .from(loans)
      .where(eq(loans.id, data.loanId))
      .innerJoin(members, eq(loans.memberId, members.id))
      .limit(1)

    const firstMember = selectedMember.at(0)

    if (!firstMember) {
      throw new MemberNotFoundException()
    }

    return firstMember.members
  })

export const getMemberById = createServerFn()
  .inputValidator(MemberIdSchema.parse)
  .handler(async ({ data }) => {
    try {
      const accounts = await db
        .select()
        .from(members)
        .where(eq(members.id, data.memberId))
      if (accounts.length === 0) {
        throw new MemberNotFoundException()
      }
      return accounts[0]
    } catch (error) {
      throw new MemberNotFoundException()
    }
  })

export const getMembersWithAccounts = createServerFn().handler(async () => {
  return db.query.members.findMany({
    with: {
      accounts: true,
    },
  })
})
