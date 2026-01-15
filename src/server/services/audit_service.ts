import { db } from '@/db'
import { auditLogs } from '@/db/schema'
import {
  AccountAuditEvent,
  AuditEvent,
  AuthAuditEvent,
  LoanAuditEvent,
  MemberAuditEvent,
  TransactionAuditEvent,
  UserAuditEvent,
} from '../types/audit_logs'
import { Prettify } from '../types'
import { getCurrentUserFn } from '@/actions/auth'

export class AuditSevice {
  private static async createAuditLog(log: Prettify<AuditEvent>) {
    try {
      let currentUserId: string | undefined
      /// when the log is not system generated, make sure the user is logged in
      if (!log.isSystem) {
        currentUserId = await AuditSevice.getCurrentUserId()
        if (!currentUserId) {
          throw new Error('Please login first')
        }
      }
      await db.insert(auditLogs).values({
        entityType: log.entity,
        entityId: log.entityId,
        changedBy: currentUserId,
        eventType: log.eventType,
        description: log.description,
        metadata: log.metadata,
        oldValues: log.oldValues,
        newValues: log.newValues,
        isSystem: log.isSystem ?? false,
      })
    } catch (error) {
      console.log(error)
    }
  }

  static async createAuthAuditLog(log: Prettify<AuthAuditEvent>) {
    await AuditSevice.createAuditLog({
      entity: 'auth',
      ...log,
    })
  }

  static async createMemberAuditLog(log: Prettify<MemberAuditEvent>) {
    await AuditSevice.createAuditLog({
      entity: 'members',
      ...log,
    })
  }

  static async createLoanAuditLog(log: Prettify<LoanAuditEvent>) {
    await AuditSevice.createAuditLog({
      entity: 'loans',
      ...log,
    })
  }

  static async createTransactionAuditLog(log: Prettify<TransactionAuditEvent>) {
    await AuditSevice.createAuditLog({
      entity: 'transactions',
      ...log,
    })
  }

  static async createAccountAuditLog(log: Prettify<AccountAuditEvent>) {
    await AuditSevice.createAuditLog({
      entity: 'accounts',
      ...log,
    })
  }

  static async createUserAuditLog(log: Prettify<UserAuditEvent>) {
    await AuditSevice.createAuditLog({
      entity: 'users',
      ...log,
    })
  }

  private static async getCurrentUserId() {
    const user = await getCurrentUserFn()
    return user?.id
  }
}
