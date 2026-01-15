import { db } from '@/db'
import { loans } from '@/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { LoanIdSchema } from '../schemas'

export type LoanRepaymentEntitty = Awaited<
  ReturnType<typeof getLoanDetailsFn>
>['repayments'][0]

export const getLoanDetailsFn = createServerFn({ method: 'POST' })
  .inputValidator(LoanIdSchema.parse)
  .handler(async ({ data }) => {
    const loanDetails = await db.query.loans.findFirst({
      where: eq(loans.id, data.loanId),
      with: {
        member: true,
        repayments: true,
        loanProduct: true,
      },
    })
    if (!loanDetails) {
      throw new Error('Loan not found')
    }
    return loanDetails
    // const [loanDetails] = await db
    //   .select()
    //   .from(loans)
    //   .where(eq(loans.id, data.loanId))
    //   .(loanRepayments, eq(loans.id, loanRepayments.loanId))
    //   .innerJoin(members, eq(loans.memberId, members.id))
    // return loanDetails
  })
