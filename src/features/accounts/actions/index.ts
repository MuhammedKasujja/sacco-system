import { createServerFn } from '@tanstack/react-start'
import { DepositMoneySchema, WithdrawalMoneySchema } from '../schemas'
import { db } from '@/db'
import { savingsAccounts, savingsTransactions } from '@/db/schema'
import { getCurrentTime } from '@/lib/utils'
import { getAccountByIdAndMemberId } from '../queries'
import { eq } from 'drizzle-orm'
import z from 'zod'
import { AuditSevice } from '@/server/services/audit_service'

type TransactionType = 'withdrawal' | 'deposit'

const makeAccountTransaction = async (
  data: z.infer<typeof DepositMoneySchema>,
  transactionType: TransactionType,
) => {
  const { accountId, memberId, amount } = data

  const account = await getAccountByIdAndMemberId({
    data: { accountId, memberId },
  })

  await db.insert(savingsTransactions).values({
    date: getCurrentTime(),
    memberId: memberId,
    accountId: account.id,
    amount: amount.toString(),
    transactionType: transactionType,
    status: 'done',
  })

  let updatedBalance = Number(account.balance)

  if (transactionType === 'deposit') {
    updatedBalance += amount
  }
  if (transactionType === 'withdrawal') {
    updatedBalance -= amount
  }

  const [updatedAccount] = await db
    .update(savingsAccounts)
    .set({
      balance: updatedBalance.toString(),
    })
    .where(eq(savingsAccounts.id, account.id))
    .returning()
  return updatedAccount
}

export const depositMoneyFn = createServerFn()
  .inputValidator(DepositMoneySchema.parse)
  .handler(async ({ data }) => {
    const account = await makeAccountTransaction(data, 'deposit')
    AuditSevice.createAccountAuditLog({
      entityId: account.id,
      eventType: 'ACCOUNT_DEPOSITED',
    })
  })

export const withdrawalMoneyFn = createServerFn()
  .inputValidator(WithdrawalMoneySchema.parse)
  .handler(async ({ data }) => {
    const account = await makeAccountTransaction(data, 'withdrawal')
    AuditSevice.createAccountAuditLog({
      entityId: account.id,
      eventType: 'ACCOUNT_WITHDRAWAL',
    })
  })
