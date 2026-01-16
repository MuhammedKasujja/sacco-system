import z from "zod";

export const MemberIdSchema = z.object({
  memberId: z.string().min(1, { error: 'Member Id is required' }),
})