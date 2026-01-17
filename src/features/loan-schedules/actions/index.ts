import { db } from '@/db'
import { loanSchedules } from '@/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { addDays } from 'date-fns'
import z from 'zod'
import { CreateLoanSchedulesRequest } from '../schemas'

type LoanScheduleStruct = {
  loanId: string
  repaymentDate: string
  amountPaid: string
  balanceAfter: string,
  amount: string,
  interestPaid: string
  status: string
}

const generateLoanSchedules = async (
  data: z.infer<typeof CreateLoanSchedulesRequest>,
) => {
  const {
    loanId,
    principalAmount,
    installmentCount,
    installmentType,
    interestRate,
  } = data

  const date = Date.now()

  const interest = (principalAmount * (interestRate / 100)) / installmentCount
  const installment = interest + principalAmount / installmentCount

  const schedules: LoanScheduleStruct[] = []

  for (let count = 1; count <= installmentCount; count++) {
    if (installmentType === 'month') {
      schedules.push({
        loanId: loanId,
        repaymentDate: addDays(date, 30 * count).toUTCString(),
        amountPaid: '0',
        interestPaid: interestRate.toString(),
        balanceAfter: installment.toString(),
        amount: installment.toString(),
        status: 'pending',
      })
    }
  }
  return await db.insert(loanSchedules).values(schedules).returning()
}

export const generateLoanSchedulessFn = createServerFn({ method: 'POST' })
  .inputValidator(CreateLoanSchedulesRequest.parse)
  .handler(async ({ data }) => {
    return generateLoanSchedules({ ...data })
  })
