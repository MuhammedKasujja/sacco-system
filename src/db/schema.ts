import { relations } from 'drizzle-orm'
import {
  char,
  date,
  decimal,
  integer,
  json,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
})

export const members = pgTable('members', {
  id: serial('id').primaryKey(),
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
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
})

export const savingsProducts = pgTable('savings_products', {
  productId: serial('product_id').primaryKey(),
  productName: varchar('product_name', { length: 200 }).notNull(),
  description: text('description'),
  interestRate: decimal('interest_rate').notNull(),
  minimumBalance: decimal('minimum_balance').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
})

export const savingsAccounts = pgTable('savings_accounts', {
  accountId: serial('account_id').primaryKey(),
  memberId: integer('member_id')
    .notNull()
    .references(() => members.id, {
      onDelete: 'cascade',
    }),
  productId: integer('product_id').references(() => savingsProducts.productId, {
    onDelete: 'cascade',
  }),
  accountNumber: varchar('account_number', { length: 30 }),
  balance: decimal(),
  openedDate: date('opened_date').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
})

export const loanProducts = pgTable('loan_products', {
  productId: serial('product_id').primaryKey(),
  productName: varchar('product_name', { length: 200 }).notNull(),
  minAmount: decimal('min_amount'),
  maxAmount: decimal('max_amount'),
  interestRate: decimal('interest_rate').notNull(),
  repaymentPeriodMonths: integer('repayment_period_months'),
  description: text(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
})

export const loans = pgTable('loans', {
  id: serial('id').primaryKey(),
  loanProductId: integer('loan_product_id').references(
    () => loanProducts.productId,
    {
      onDelete: 'cascade',
    },
  ),
  memberId: integer('member_id').references(() => members.id, {
    onDelete: 'set null',
  }),
  number: varchar('loan_number', { length: 50 }).unique(),
  principalAmount: decimal('principal_amount'),
  interestRate: decimal('interest_rate'),
  totalAmount: decimal('total_amount'),
  disbursementDate: date('disbursement_date'),
  status: varchar('status', { length: 20 }),
  approvedBy: integer('approved_by').references(() => users.id, {
    onDelete: 'cascade',
  }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
})

// -- Loan Repayments: Scheduled or actual repayments
export const loanRepayments = pgTable('loan_repayments', {
  id: serial('id').primaryKey(),
  loanId: integer('loan_id')
    .notNull()
    .references(() => loans.id, {
      onDelete: 'cascade',
    }),
  repaymentDate: date('repayment_date').notNull(),
  amountPaid: decimal('amount_paid'),
  principalPaid: decimal('principal_paid'),
  interestPaid: decimal('interest_paid'),
  balanceAfter: decimal('balance_after'),
  status: varchar('status', { length: 20 }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
})

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  date: date('date').notNull(),
  memberId: integer('member_id')
    .notNull()
    .references(() => members.id, {
      onDelete: 'cascade',
    }),
  accountId: integer('account_id').references(() => savingsAccounts.accountId, {
    onDelete: 'cascade',
  }), // -- For savings transactions
  loanId: integer('loan_id').references(() => loans.id, {
    onDelete: 'cascade',
  }),
  transactionType: varchar('transaction_type', { length: 50 }), // deposit, withdrawal, loan_disbursement, loan_repayment, share_purchase
  amount: decimal('amount').notNull(),
  recordedBy: integer('recorded_by').references(() => users.id, {
    onDelete: 'cascade',
  }),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
})

// -- Audit Logs Table: Tracks all changes to important tables
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  tableName: varchar('table_name', { length: 50 }),
  recordId: integer('record_id').notNull(),
  operation: char('operation', { length: 1 }).notNull(),
  oldValues: json('old_values'),
  newValues: json('new_values'),
  changedBy: integer('changed_by')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  changedAt: timestamp('changed_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  description: text('description'),
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
    references: [loanProducts.productId],
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
      references: [loanProducts.productId],
    }),
  }),
)

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users),
}))

export const loanRepaymentsRelations = relations(loanRepayments, ({ one }) => ({
  loan: one(loans),
}))

export const transactionsRelations = relations(transactions, ({ one }) => ({
  loan: one(loans),
  member: one(members, {
    fields: [transactions.memberId],
    references: [members.id],
  }),
  account: one(savingsAccounts, {
    fields: [transactions.accountId],
    references: [savingsAccounts.accountId],
  }),
}))
