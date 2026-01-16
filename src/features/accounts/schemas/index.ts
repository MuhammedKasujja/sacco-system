import z from "zod";

export const WithdrawalMoneySchema = z.object({
    amount: z.number(),
    memberId: z.string().min(2),
    accountId: z.string().min(2),
    purpose: z.string().optional(),
})

export const DepositMoneySchema = z.object({
    amount: z.number(),
    memberId: z.string().min(2),
    accountId: z.string().min(2),
    purpose: z.string().optional(),
})