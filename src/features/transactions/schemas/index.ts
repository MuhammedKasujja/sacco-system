import z from 'zod'

export const EditLoanRepaymentTransactionSchema = z.object({
  id: z.string().optional(),
  loanId: z.string(),
  amount: z.number(),
  payeeName: z.string().min(10),
  payeeTelephone: z.string().optional(),
})