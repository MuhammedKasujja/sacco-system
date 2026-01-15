import { db } from '@/db'
import { loans, members } from '@/db/schema'
import { LoanIdSchema } from '@/features/loans/schemas'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'

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
      throw new Error('Member not found')
    }

    return firstMember.members
  })
