import z from 'zod/v3'
import { EditLoanRepaymentTransactionSchema } from '../../schemas'
import { db } from '@/db'
import { createServerFn } from '@tanstack/react-start'
import { transactions } from '@/db/schema'
import { getCurrentUserFn } from '@/actions/auth'
import { getCurrentTime } from '@/lib/utils'
import { getMemberByLoanIdFn } from '@/features/members/queries'

const makeLoanRepaymentTransaction = async (
  data: z.infer<typeof EditLoanRepaymentTransactionSchema>,
) => {
  const { loanId, amount, payeeName, payeeTelephone } = data

  const loggedInUser = await getCurrentUserFn()
  const loanMember = await getMemberByLoanIdFn()

  await db
    .insert(transactions)
    .values({
      loanId,
      amount: amount.toString(),
      transactionType: 'loan_repayment',
      date: getCurrentTime(),
      payeeName,
      payeeTelephone,
      memberId: loanMember.id,
      recordedBy: loggedInUser?.id,
    })
    .returning()
}

export const makeLoanRepaymentTransactionFn = createServerFn({ method: 'POST' })
  .inputValidator(EditLoanRepaymentTransactionSchema.parse)
  .handler(async ({ data }) => {
    return makeLoanRepaymentTransaction({ ...data })
  })
