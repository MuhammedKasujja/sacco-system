import { checkIfMemberEligibleForLoan } from '@/actions/members'
import { db } from '@/db'
import { loans } from '@/db/schema'
import { generateLoanSchedulessFn } from '@/features/loan-schedules/actions'
import { AuditSevice } from '@/server/services/audit_service'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import z from 'zod'

export const EditLoanSchema = z.object({
  id: z.string().optional(),
  principalAmount: z.coerce
    .number<number>({ error: 'Principal amount is required' })
    .min(1, { error: 'Principal is required' }),
  memberId: z.string().min(1, { error: 'Please choose member' }),
  loanProductId: z.string({ error: 'Please select a loan product' }),
  interestRate: z.coerce.number<number>(),
  repaymentPeriodInMonths: z.coerce
    .number<number>({ error: 'Required' })
    .min(1),
})

export const createLoanFn = createServerFn({ method: 'POST' })
  .inputValidator(EditLoanSchema.parse)
  .handler(async ({ data }) => {
    await checkIfMemberEligibleForLoan({ data: { memberId: data.memberId } })
    const loanNumber = await generateNextLoanNumber()
    const [latestLoan] = await db
      .insert(loans)
      .values({
        memberId: data.memberId,
        loanProductId: data.loanProductId,
        principalAmount: data.principalAmount.toString(),
        installmentCount: data.repaymentPeriodInMonths.toString(),
        interestRate: data.interestRate.toString(),
        number: loanNumber,
        status: 'in-review',
        installmentType: 'month',
      })
      .returning()
    await generateLoanSchedulessFn({
      data: {
        loanId: latestLoan.id,
        principalAmount: Number(latestLoan.principalAmount),
        interestRate: Number(latestLoan.interestRate),
        installmentCount: data.repaymentPeriodInMonths,
        installmentType: 'month',
      },
    })
    AuditSevice.createLoanAuditLog({
      eventType: 'LOAN_CREATED',
      entityId: latestLoan.id,
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
        installmentCount: data.repaymentPeriodInMonths.toString(),
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
