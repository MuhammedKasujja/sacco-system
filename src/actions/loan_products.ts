import { db } from '@/db'
import { loanProducts } from '@/db/schema'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

export const CreateLoanProductSchema = z.object({
  productName: z.string(),
  description: z.string().optional(),
  repaymentPeriodMonths: z.coerce.number<number>(),
  interestRate: z.string(),
  minAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid money format'),
  maxAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid money format'),
})

export type LoanProductEntity = Awaited<ReturnType<typeof fetchLoanProducts>>[0]

export const fetchLoanProducts = createServerFn().handler(() => {
  return db.query.loanProducts.findMany()
})

export const createLoanProductFn = createServerFn({ method: 'POST' })
  .inputValidator((data) => CreateLoanProductSchema.parse(data))
  .handler(async ({ data }) => {
    await db
      .insert(loanProducts)
      .values({
        productName: data.productName,
        description: data.description,
        repaymentPeriodMonths: data.repaymentPeriodMonths,
        interestRate: data.interestRate,
        minAmount: data.minAmount,
        maxAmount: data.maxAmount,
      })
      .returning()

    return { status: 'success', message: 'Loan Product created successfully' }
  })
