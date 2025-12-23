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
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  age: integer('age').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export const members = pgTable('members', {
  id: serial('id').primaryKey(),
  number: varchar('member_number', { length: 20 }).unique(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  idNumber: varchar('id_number', { length: 20 }).notNull().unique(),
  phone: varchar({ length: 20 }).notNull().unique(),
  email: varchar({ length: 20 }).unique(),
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
})

export const savingsAccounts = pgTable('savings_accounts', {
  accountId: serial('account_id').primaryKey(),
  memberId: integer('member_id')
    .notNull()
    .references(() => members.id),
  productId: integer('product_id').references(() => savingsProducts.productId),
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
})

export const loans = pgTable('loans', {
  id: serial('id').primaryKey(),
  loanProductId: integer('loan_product_id').references(
    () => loanProducts.productId,
  ),
  number: varchar('loan_number', { length: 20 }).unique(),
  principalAmount: decimal('principal_amount'),
  interestAmount: decimal('interest_amount'),
  totalAmount: decimal('total_amount'),
  disbursementDate: date('disbursement_date'),
  status: varchar('status', { length: 20 }),
  approvedBy: integer('approved_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

// -- Loan Repayments: Scheduled or actual repayments
export const loanRepayments = pgTable('loan_repayments', {
  id: serial('id').primaryKey(),
  loanId: integer('loan_id')
    .notNull()
    .references(() => loans.id),
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
})

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  date: date('date'),
  memberId: integer('member_id')
    .notNull()
    .references(() => members.id),
  accountId: integer('account_id').references(() => savingsAccounts.accountId), // -- For savings transactions
  loanId: integer('loan_id').references(() => loans.id),
  transactionType: varchar('transaction_type', { length: 20 }), // deposit, withdrawal, loan_disbursement, loan_repayment, share_purchase
  amount: decimal('amount'),
  recordedBy: integer('recorded_by'),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
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
    .references(() => users.id),
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
  member: one(members),
  loanProduct: one(loanProducts, {
    fields: [loans.loanProductId],
    references: [loanProducts.productId],
  }),
  repayments: many(loanRepayments),
}))

export const savingsAccountsRelations = relations(
  savingsAccounts,
  ({ one }) => ({
    member: one(members),
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
  member: one(members),
  account: one(savingsAccounts, {
    fields: [transactions.accountId],
    references: [savingsAccounts.accountId],
  }),
}))
