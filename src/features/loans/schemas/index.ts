import z from "zod";

export const LoanIdSchema = z.object({
  loanId: z.string().min(1, { error: 'Loan Id is required' }),
})