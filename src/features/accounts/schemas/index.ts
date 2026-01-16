import z from "zod/v3";

export const AccountIdSchema = z.object({
    accountId: z.string()
})

export const AccountWithMemberSchema = z.object({
    accountId: z.string(),
    memberId: z.string()
})

export const WithdrawalMoneySchema = z.object({
    amount: z.coerce.number(),
    memberId: z.string().min(2),
    accountId: z.string().min(2),
    purpose: z.string().optional(),
})

export const DepositMoneySchema = z.object({
    amount: z.coerce.number(),
    memberId: z.string().min(2),
    accountId: z.string().min(2),
    purpose: z.string().optional(),
})