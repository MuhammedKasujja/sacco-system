import { db } from '@/db'
import { loanProducts } from '@/db/schema'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

export const CreateLoanProductSchema = z.object({
  productName: z.string(),
  description: z.string().optional().default(''),
  repaymentPeriodMonths: z.coerce.number(),
  interestRate: z.coerce.number(),
  minAmount: z.coerce.number(),
  maxAmount: z.coerce.number(),
})

export type LoanProductEntity = Awaited<ReturnType<typeof fetchLoanProducts>>[0]

export const fetchLoanProducts = createServerFn().handler(() => {
  return db.query.loanProducts.findMany()
})

export const createLoanProductFn = createServerFn({ method: 'POST' })
  .inputValidator((data) => CreateLoanProductSchema.parse(data))
  .handler(async ({ data }) => {
    const loanProduct = await db
      .insert(loanProducts)
      .values({
        productName: data.productName,
        description: data.description,
        repaymentPeriodMonths: data.repaymentPeriodMonths,
        interestRate: data.productName,
        minAmount: data.productName,
        maxAmount: data.productName,
      })
      .returning()

    return loanProduct[0]
  })
