const AUDIT_EVENTS = {
  auth: ['AUTH_LOGGED_IN', 'AUTH_CHANGED_PASSWORD', 'AUTH_LOGOUT'],
  loans: [
    'LOAN_CREATED',
    'LOAN_APPROVED',
    'LOAN_REPAYMENT',
    'LOAN_PAID',
    'LOAN_DISBURSED',
    'LOAN_DENIED', // needs a reason in audit logs metadata
    'LOAN_CANCELLED',
  ],
  members: [
    'MEMBER_CREATED',
    'MEMBER_APPROVED',
    'MEMBER_DEACTIVATED',
    'MEMBER_UPDATED',
  ],
  transactions: [
    'TRANSACTION_CREATED',
    'TRANSACTION_UPDATED',
    'TRANSACTION_DELETED',
    'TRANSACTION_REVERSED',
  ],
  users: [
    'USER_CREATED',
    'USER_UPDATED',
  ],
  accounts: [
    'ACCOUNT_CREATED',
    'ACCOUNT_UPDATED',
    'ACCOUNT_REACTIVATED',
    'ACCOUNT_DEACTIVATED',
    'ACCOUNT_DEPOSITED',
    'ACCOUNT_WITHDRAWAL',
    'ACCOUNT_REVERSAL',
  ],
} as const

type AuditEntityName = keyof typeof AUDIT_EVENTS

type AuditEventType = (typeof AUDIT_EVENTS)[AuditEntityName][number]

export type AuditEvent = {
  entity: AuditEntityName
  entityId: string
  // loggedInUserId: string
  eventType: AuditEventType
  description?: string
  metadata?: Record<string, unknown>
  oldValues?: Record<string, unknown>
  newValues?: Record<string, unknown>
  isSystem?: boolean
}

type CreateAuditLogEvent = Omit<AuditEvent, 'entity'>

/// Loans
export type LoanAuditEvent = CreateAuditLogEvent & {
  eventType: (typeof AUDIT_EVENTS)['loans'][number]
}

/// Members
export type MemberAuditEvent = CreateAuditLogEvent & {
  eventType: (typeof AUDIT_EVENTS)['members'][number]
}

/// auth
export type AuthAuditEvent = CreateAuditLogEvent & {
  eventType: (typeof AUDIT_EVENTS)['auth'][number]
}

/// transactions
export type TransactionAuditEvent = CreateAuditLogEvent & {
  eventType: (typeof AUDIT_EVENTS)['transactions'][number]
}

/// users
export type UserAuditEvent = CreateAuditLogEvent & {
  eventType: (typeof AUDIT_EVENTS)['users'][number]
}

/// accounts
export type AccountAuditEvent = CreateAuditLogEvent & {
  eventType: (typeof AUDIT_EVENTS)['accounts'][number]
}
