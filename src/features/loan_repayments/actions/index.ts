import { db } from '@/db'
import { loanRepayments } from '@/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { addDays } from 'date-fns'
import z from 'zod'

export const CreateLoanRepaymentsRequest = z.object({
  loanId: z.string(),
  principalAmount: z.number(),
  interestRate: z.number(),
  installmentCount: z.number(),
  installmentType: z.enum(['month', 'week']).default('month'),
})

type RepaymentStruct = {
  loanId: string
  repaymentDate: string
  amountPaid: string
  interestPaid: string
  status: string
}

export const generateLoanRepayments = async (
  data: z.infer<typeof CreateLoanRepaymentsRequest>,
) => {
  const {
    loanId,
    principalAmount,
    installmentCount,
    installmentType,
    interestRate,
  } = data

  const date = Date.now()

  const installment = (principalAmount * interestRate) / installmentCount

  const repayments: RepaymentStruct[] = []

  for (let count = 1; count <= installmentCount; count++) {
    if (installmentType === 'month') {
      repayments.push({
        loanId: loanId,
        repaymentDate: addDays(date, 30 * count).toUTCString(),
        amountPaid: installment.toString(),
        interestPaid: interestRate.toString(),
        status: 'pending',
      })
    }
  }
  return await db.insert(loanRepayments).values(repayments).returning()
}

export const generateLoanRepaymentsFn = createServerFn({ method: 'POST' })
  .inputValidator(CreateLoanRepaymentsRequest.parse)
  .handler(async ({ data }) => {
    const {
      loanId,
      principalAmount,
      installmentCount,
      installmentType,
      interestRate,
    } = data

    const date = Date.now()

    const installment = (principalAmount * interestRate) / installmentCount

    const repayments: RepaymentStruct[] = []

    for (let count = 1; count <= installmentCount; count++) {
      if (installmentType === 'month') {
        repayments.push({
          loanId: loanId,
          repaymentDate: addDays(date, 30 * count).toUTCString(),
          amountPaid: installment.toString(),
          interestPaid: interestRate.toString(),
          status: 'pending',
        })
      }
    }
    return await db.insert(loanRepayments).values(repayments).returning()
  })
