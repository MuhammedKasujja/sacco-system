import { db } from '@/db'
import { savingsAccounts } from '@/db/schema'
import { AuditSevice } from '@/server/services/audit_service'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

export const CreateMemberAccountSchema = z.object({
  memberId: z.string(),
})

export type AccountEntity = Awaited<ReturnType<typeof fetchAccounts>>[0]

export const fetchAccounts = createServerFn().handler(() => {
  return db.query.savingsAccounts.findMany({
    with: {
      member: { columns: { id: true, firstName: true, lastName: true } },
    },
  })
})

export const createMemberAccountFn = createServerFn()
  .inputValidator(CreateMemberAccountSchema.parse)
  .handler(async ({ data }) => {
    const [account] = await db
      .insert(savingsAccounts)
      .values({
        memberId: data.memberId,
        accountNumber: 'ACC 890089',
        openedDate: new Date().toISOString(),
        balance: '0',
      })
      .returning()
    AuditSevice.createAccountAuditLog({
      eventType: 'ACCOUNT_CREATED',
      entityId: account.id,
      isSystem: true,
    })
    return account
  })
