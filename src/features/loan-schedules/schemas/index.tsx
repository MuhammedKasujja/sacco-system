import z from 'zod'

export const CreateLoanSchedulesRequest = z.object({
  loanId: z.string(),
  principalAmount: z.number(),
  interestRate: z.number(),
  installmentCount: z.number(),
  installmentType: z.enum(['month', 'week']).default('month'),
})
