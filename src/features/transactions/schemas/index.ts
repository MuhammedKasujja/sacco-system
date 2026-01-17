import z from 'zod'

export const EditLoanRepaymentTransactionSchema = z.object({
  id: z.string().optional(),
  loanId: z.string(),
  scheduleId: z.string(),
  amount: z.number(),
  payeeName: z.string(),
  payeeTelephone: z.string().optional(),
})