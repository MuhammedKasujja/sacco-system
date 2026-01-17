import { createServerFn } from '@tanstack/react-start'
import { AccountIdSchema, AccountWithMemberSchema } from '../schemas'
import { db } from '@/db'
import { members, savingsAccounts } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { AccountNotFoundException } from '@/server/execptions'

export const getAccountById = createServerFn()
  .inputValidator(AccountIdSchema.parse)
  .handler(async ({ data }) => {
    try {
      const accounts = await db
        .select()
        .from(savingsAccounts)
        .where(eq(savingsAccounts.id, data.accountId))
      if (accounts.length <= 0) {
        throw new AccountNotFoundException()
      }
      return accounts[0]
    } catch (error) {
      throw new AccountNotFoundException()
    }
  })

export const getAccountByIdAndMemberId = createServerFn()
  .inputValidator(AccountWithMemberSchema.parse)
  .handler(async ({ data }) => {
    try {
      const accounts = await db
        .select()
        .from(savingsAccounts)
        .innerJoin(members, eq(savingsAccounts.memberId, members.id))
        .where(
          and(
            eq(savingsAccounts.id, data.accountId),
            eq(members.id, data.memberId),
          ),
        )
      if (accounts.length <= 0) {
        throw new AccountNotFoundException()
      }
      return accounts[0].savings_accounts
    } catch (error) {
      throw new AccountNotFoundException()
    }
  })

export const getAccountDetailsFn = createServerFn()
  .inputValidator(AccountIdSchema.parse)
  .handler(async ({ data }) => {
    try {
      const account = await db.query.savingsAccounts.findFirst({
        where: eq(savingsAccounts.id, data.accountId),
        with: {
          member: true,
          transactions: true,
        },
      })
      if (!account) {
        throw new AccountNotFoundException()
      }
      return account
    } catch (error) {
      throw new AccountNotFoundException()
    }
  })
