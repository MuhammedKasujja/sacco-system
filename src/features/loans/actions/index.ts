import { db } from '@/db'
import { loans } from '@/db/schema'
import { generateLoanRepayments } from '@/features/loan_repayments/actions'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import z from 'zod/v3'

export const EditLoanSchema = z.object({
  id: z.string().optional(),
  principalAmount: z.coerce.number(),
  memberId: z.string(),
  loanProductId: z.string(),
  interestRate: z.coerce.number(),
  repaymentPeriodInMonths: z.coerce.number().min(1),
})

export const createLoanFn = createServerFn({ method: 'POST' })
  .inputValidator(EditLoanSchema.parse)
  .handler(async ({ data }) => {
    const loanNumber = await generateNextLoanNumber()
    const [latestLoan] = await db
      .insert(loans)
      .values({
        memberId: data.memberId,
        loanProductId: data.loanProductId,
        principalAmount: data.principalAmount.toString(),
        interestRate: data.interestRate.toString(),
        number: loanNumber,
        status: 'pending',
      })
      .returning()
    await generateLoanRepayments({
      loanId: latestLoan.id,
      principalAmount: Number(latestLoan.principalAmount),
      interestRate: Number(latestLoan.interestRate),
      installmentCount: data.repaymentPeriodInMonths,
      installmentType: 'month',
    })
    return { message: 'Successfully created loan' }
  })

export const updateLoanFn = createServerFn({ method: 'POST' })
  .inputValidator(EditLoanSchema.parse)
  .handler(async ({ data }) => {
    if (!data.id) return { error: 'Loan id is required' }

    const loan = await db.query.loans.findFirst({
      where: eq(loans.id, data.id),
    })

    if (!loan) {
      return { error: 'Loan details not found' }
    }

    await db
      .insert(loans)
      .values({
        id: loan.id,
        memberId: data.memberId,
        loanProductId: data.loanProductId,
        principalAmount: data.principalAmount.toString(),
      })
      .returning()
    return { message: 'Successfully updated loan' }
  })

async function generateNextLoanNumber() {
  const totalLoans = await db.select({ id: loans.id }).from(loans)
  const count = (totalLoans.length + 1).toString().padStart(4, '0')

  return `LN-${count}`
}
