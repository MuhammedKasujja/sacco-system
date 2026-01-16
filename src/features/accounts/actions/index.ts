import { createServerFn } from '@tanstack/react-start'
import { DepositMoneySchema, WithdrawalMoneySchema } from '../schemas'

export const depositMoneyFn = createServerFn()
  .inputValidator(DepositMoneySchema.parse)
  .handler(({ data }) => {})

export const withdrawalMoneyFn = createServerFn()
  .inputValidator(WithdrawalMoneySchema.parse)
  .handler(({ data }) => {})
