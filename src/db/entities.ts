import { InferSelectModel } from 'drizzle-orm'
import {
  auditLogs,
  loanProducts,
  loanRepayments,
  loans,
  members,
  savingsAccounts,
  savingsProducts,
  transactions,
  users,
} from './schema'

export type UserEntity = InferSelectModel<typeof users>
export type LoanEntity = InferSelectModel<typeof loans>
export type MemberEntity = InferSelectModel<typeof members>
export type AuditLogEntity = InferSelectModel<typeof auditLogs>
export type LoanRepaymentEntity = InferSelectModel<typeof loanRepayments>
export type TransactionEntity = InferSelectModel<typeof transactions>
export type SavingAccountEntity = InferSelectModel<typeof savingsAccounts>
export type SavingProductEntity = InferSelectModel<typeof savingsProducts>
export type LoanProductEntity = InferSelectModel<typeof loanProducts>
