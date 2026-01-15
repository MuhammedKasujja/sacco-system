import { relations } from 'drizzle-orm'
import {
  char,
  date,
  decimal,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

const createdAt = timestamp('created_at', { withTimezone: true })
  .defaultNow()
  .notNull()

const updatedAt = timestamp('updated_at', { withTimezone: true })
  .defaultNow()
  .notNull()
  .$onUpdate(() => new Date())

const deletedAt = timestamp('deleted_at', { withTimezone: true })

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password').notNull(),
  createdAt,
  updatedAt,
  deletedAt,
})

export const members = pgTable('members', {
  id: uuid('id').primaryKey().defaultRandom(),
  number: varchar('member_number', { length: 20 }).unique(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  idNumber: varchar('id_number', { length: 50 }).notNull().unique(),
  phone: varchar({ length: 20 }).notNull().unique(),
  password: varchar('password').notNull(),
  email: varchar({ length: 100 }).unique(),
  address: text('address'),
  joinDate: date('join_date'),
  status: varchar('status', { length: 20 }),
  createdAt,
  updatedAt,
  deletedAt,
})

export const savingsProducts = pgTable('savings_products', {
  id: uuid('id').primaryKey().defaultRandom(),
  productName: varchar('product_name', { length: 200 }).notNull(),
  description: text('description'),
  interestRate: decimal('interest_rate').notNull(),
  minimumBalance: decimal('minimum_balance').notNull(),
  createdAt,
  updatedAt,
  deletedAt,
})

export const savingsAccounts = pgTable('savings_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  memberId: uuid('member_id')
    .notNull()
    .references(() => members.id, {
      onDelete: 'cascade',
    }),
  productId: uuid('product_id').references(() => savingsProducts.id, {
    onDelete: 'cascade',
  }),
  accountNumber: varchar('account_number', { length: 30 }),
  balance: decimal(),
  openedDate: date('opened_date').notNull(),
  createdAt,
  updatedAt,
  deletedAt,
})

export const loanProducts = pgTable('loan_products', {
  id: uuid('id').primaryKey().defaultRandom(),
  productName: varchar('product_name', { length: 200 }).notNull(),
  minAmount: decimal('min_amount'),
  maxAmount: decimal('max_amount'),
  interestRate: decimal('interest_rate').notNull(),
  repaymentPeriodMonths: integer('repayment_period_months'),
  description: text(),
  createdAt,
  updatedAt,
  deletedAt,
})

const enums = pgEnum('installment_type', ['month', 'week', 'year'])

export const loans = pgTable('loans', {
  id: uuid('id').primaryKey().defaultRandom(),
  loanProductId: uuid('loan_product_id').references(() => loanProducts.id, {
    onDelete: 'cascade',
  }),
  memberId: uuid('member_id')
    .references(() => members.id, {
      onDelete: 'set null',
    })
    .notNull(),
  number: varchar('loan_number', { length: 50 }).unique(),
  principalAmount: decimal('principal_amount'),
  interestRate: decimal('interest_rate'),
  totalAmount: decimal('total_amount'),
  installmentCount: decimal('installment_count'),
  // installmentType: enums,
  installmentType: varchar('installment_type').default('month'),
  disbursementDate: date('disbursement_date'),
  status: varchar('status', { length: 20 }),
  approvedBy: uuid('approved_by').references(() => users.id, {
    onDelete: 'cascade',
  }),
  createdAt,
  updatedAt,
  deletedAt,
})

// -- Loan Repayments: Scheduled or actual repayments
export const loanRepayments = pgTable('loan_repayments', {
  id: uuid('id').primaryKey().defaultRandom(),
  loanId: uuid('loan_id')
    .notNull()
    .references(() => loans.id, {
      onDelete: 'cascade',
    }),
  repaymentDate: date('repayment_date').notNull(),
  amountPaid: decimal('amount_paid').notNull(),
  principalPaid: decimal('principal_paid'),
  interestPaid: decimal('interest_paid'),
  balanceAfter: decimal('balance_after'),
  status: varchar('status', { length: 20 }),
  createdAt,
  updatedAt,
  deletedAt,
})

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  date: date('date').notNull(),
  memberId: uuid('member_id')
    .notNull()
    .references(() => members.id, {
      onDelete: 'cascade',
    }),
  accountId: uuid('account_id').references(() => savingsAccounts.id, {
    onDelete: 'cascade',
  }), // -- For savings transactions
  loanId: uuid('loan_id').references(() => loans.id, {
    onDelete: 'cascade',
  }),
  transactionType: varchar('transaction_type', { length: 50 }), // deposit, withdrawal, loan_disbursement, loan_repayment, share_purchase
  amount: decimal('amount').notNull(),
  recordedBy: uuid('recorded_by').references(() => users.id, {
    onDelete: 'cascade',
  }),
  payeeName: varchar(),
  payeeTelephone: varchar(),
  description: text('description'),
  createdAt,
  updatedAt,
  deletedAt,
})

// -- Audit Logs Table: Tracks all changes to important tables
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  tableName: varchar('table_name', { length: 50 }),
  recordId: uuid('record_id').notNull(),
  operation: char('operation', { length: 1 }).notNull(),
  oldValues: json('old_values'),
  newValues: json('new_values'),
  changedBy: uuid('changed_by')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  changedAt: timestamp('changed_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  description: text('description'),
  createdAt,
})

export const membersRelations = relations(members, ({ many }) => ({
  transactions: many(transactions),
  loans: many(loans),
  accounts: many(savingsAccounts), // TODO: check can members have multiple accounts??
}))

export const userRelations = relations(users, ({ many }) => ({
  auditLogs: many(auditLogs),
}))

export const loansRelations = relations(loans, ({ many, one }) => ({
  member: one(members, {
    fields: [loans.memberId],
    references: [members.id],
  }),
  loanProduct: one(loanProducts, {
    fields: [loans.loanProductId],
    references: [loanProducts.id],
  }),
  repayments: many(loanRepayments),
}))

export const savingsAccountsRelations = relations(
  savingsAccounts,
  ({ one }) => ({
    member: one(members, {
      fields: [savingsAccounts.memberId],
      references: [members.id],
    }),
    loanProduct: one(loanProducts, {
      fields: [savingsAccounts.productId],
      references: [loanProducts.id],
    }),
  }),
)

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.changedBy],
    references: [users.id],
  }),
}))

export const loanRepaymentsRelations = relations(loanRepayments, ({ one }) => ({
  loan: one(loans, {
    fields: [loanRepayments.loanId],
    references: [loans.id],
  }),
}))

export const transactionsRelations = relations(transactions, ({ one }) => ({
  loan: one(loans, {
    fields: [transactions.loanId],
    references: [loans.id],
  }),
  member: one(members, {
    fields: [transactions.memberId],
    references: [members.id],
  }),
  account: one(savingsAccounts, {
    fields: [transactions.accountId],
    references: [savingsAccounts.id],
  }),
}))
