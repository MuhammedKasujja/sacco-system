import { faker } from '@faker-js/faker'
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
import { db } from '.'
import {
  AuditLogEntity,
  LoanEntity,
  LoanProductEntity,
  LoanRepaymentEntity,
  MemberEntity,
  SavingAccountEntity,
  SavingProductEntity,
  TransactionEntity,
  UserEntity,
} from './entities'
import { getTableConfig } from 'drizzle-orm/pg-core'
import type { Table } from 'drizzle-orm'

/// Row counts for test data per table
const USERS_COUNT = 20
const MEMBERS_COUNT = 50
const LOANS_COUNT = 30
const LOAN_PRODUCTS_COUNT = 10
const LOAN_REPAYMENTS_COUNT = 400
const SAVING_ACCOUNTS_COUNT = 20
const SAVING_PRODUCTS_COUNT = 5
const LOAN_TRANSACTIONS_COUNT = 500
const SAVING_TRANSACTIONS_COUNT = 600
const AUDIT_LOGS_COUNT = 1_000

export class DatabaseSeeder {
  private mockUsers: UserEntity[] = []
  private mockMembers: MemberEntity[] = []
  private mockLoans: LoanEntity[] = []
  private mockLoanProducts: LoanProductEntity[] = []
  private mockLoanRepayments: LoanRepaymentEntity[] = []
  private mockSavingAccounts: SavingAccountEntity[] = []
  private mockSavingProducts: SavingProductEntity[] = []
  private mockLoanTransactions: TransactionEntity[] = []
  private mockSavingTransactions: TransactionEntity[] = []

  private async generateUsers() {
    for (let i = 0; i < USERS_COUNT; i++) {
      const name = faker.person.fullName()
      const email = faker.internet.email({
        firstName: name.split(' ')[0].toLowerCase(),
      })

      const user = await db
        .insert(users)
        .values({
          name,
          age: faker.number.int({ min: 18, max: 70 }),
          email,
          password: faker.internet.password({ length: 12 }), // In real app: hash this!
        })
        .returning()

      this.mockUsers.push(user[0])
    }
    console.log(`👥 Created ${USERS_COUNT} users`)
    return USERS_COUNT
  }

  private async generateLoans() {
    // Generate fake loans for random members
    for (let i = 0; i < LOANS_COUNT; i++) {
      const member: MemberEntity = faker.helpers.arrayElement(this.mockMembers)
      const newloan = await db
        .insert(loans)
        .values({
          memberId: member.id,
          number: faker.string.uuid(),
          interestRate: faker.finance.amount({ min: 5, max: 45, dec: 2 }),
          principalAmount: faker.finance.amount({
            min: 5_000,
            max: 500_000,
            dec: 2,
          }),
          status: faker.helpers.arrayElement([
            'pending',
            'approved',
            'rejected',
            'repaid',
          ]),
          createdAt: faker.date.recent({ days: 90 }),
          // Add more fields as needed
        })
        .returning()

      this.mockLoans.push(newloan[0])
    }
    return this.mockLoans
  }

  private async generateMembers() {
    // Generate fake members
    for (let i = 0; i < MEMBERS_COUNT; i++) {
      const firstName = faker.person.firstName()
      const email = faker.internet.email({ firstName })

      const newMember = await db
        .insert(members)
        .values({
          idNumber: faker.string.uuid(),
          firstName: firstName,
          lastName: faker.person.lastName(),
          email: email,
          password: faker.internet.password({ length: 12 }),
          phone: faker.phone.number({ style: 'international' }),
        })
        .returning()

      this.mockMembers.push(newMember[0])
    }
    console.log(`👥 Created ${this.mockMembers.length} members`)
    return this.mockMembers
  }

  private async generateLoanTransactions() {
    // Generate fake loan transactions
    for (let i = 0; i < LOAN_TRANSACTIONS_COUNT; i++) {
      const member: MemberEntity = faker.helpers.arrayElement(this.mockMembers)
      const loan: LoanEntity = faker.helpers.arrayElement(this.mockLoans)
      const newTransaction = await db
        .insert(transactions)
        .values({
          loanId: loan.id,
          memberId: member.id,
          date: faker.date.past().toISOString(),
          transactionType: faker.finance.transactionType(),
          description: faker.finance.transactionDescription(),
          amount: faker.finance.amount({ min: 5000, max: 500000, dec: 2 }),
        })
        .returning()

      this.mockLoanTransactions.push(newTransaction[0])
    }
    console.log(`👥 Created ${LOAN_TRANSACTIONS_COUNT} transactions`)
    return LOAN_TRANSACTIONS_COUNT
  }

  private async generateSavingTransactions() {
    // Generate fake saving transactions
    for (let i = 0; i < SAVING_TRANSACTIONS_COUNT; i++) {
      const member: MemberEntity = faker.helpers.arrayElement(this.mockMembers)
      const account: SavingAccountEntity = faker.helpers.arrayElement(
        this.mockSavingAccounts,
      )
      const newTransaction = await db
        .insert(transactions)
        .values({
          accountId: account.accountId,
          memberId: member.id,
          date: faker.date.past().toISOString(),
          transactionType: faker.finance.transactionType(),
          description: faker.finance.transactionDescription(),
          amount: faker.finance.amount({ min: 10_000, max: 200_000, dec: 2 }),
        })
        .returning()

      this.mockSavingTransactions.push(newTransaction[0])
    }
    console.log(
      `👥 Created ${this.mockSavingTransactions.length} saving transactions`,
    )
    return this.mockSavingTransactions
  }

  private async generateSavingProducts() {
    for (let i = 0; i < SAVING_PRODUCTS_COUNT; i++) {
      const newTransaction = await db
        .insert(savingsProducts)
        .values({
          productName: faker.finance.accountName(),
          description: faker.finance.transactionDescription(),
          interestRate: faker.finance.amount({ min: 2, max: 20, dec: 2 }),
          minimumBalance: faker.finance.amount({
            min: 10_000,
            max: 1_000_000,
            dec: 2,
          }),
        })
        .returning()

      this.mockSavingProducts.push(newTransaction[0])
    }
    console.log(`👥 Created ${SAVING_PRODUCTS_COUNT} saving products`)
    return SAVING_PRODUCTS_COUNT
  }

  private async generateSavingAccounts() {
    for (let i = 0; i < SAVING_ACCOUNTS_COUNT; i++) {
      const member: MemberEntity = faker.helpers.arrayElement(this.mockMembers)
      const product: SavingProductEntity = faker.helpers.arrayElement(
        this.mockSavingProducts,
      )
      const newAccount = await db
        .insert(savingsAccounts)
        .values({
          memberId: member.id,
          productId: product.productId,
          accountNumber: faker.finance.accountNumber(),
          openedDate: faker.date.past().toISOString(),
          balance: faker.finance.amount({
            min: 10_000,
            max: 1_000_000,
            dec: 2,
          }),
        })
        .returning()

      this.mockSavingAccounts.push(newAccount[0])
    }
    console.log(`👥 Created ${this.mockSavingAccounts.length} saving account`)
    return this.mockSavingAccounts
  }

  private async generateLoanProducts() {
    for (let i = 0; i < LOAN_PRODUCTS_COUNT; i++) {
      const newProduct = await db
        .insert(loanProducts)
        .values({
          productName: faker.finance.accountName(),
          description: faker.finance.transactionDescription(),
          repaymentPeriodMonths: faker.number.int({ min: 3, max: 36 }),
          interestRate: faker.finance.amount({ min: 2, max: 20, dec: 2 }),
          minAmount: faker.finance.amount({
            min: 10_000,
            max: 50_000,
            dec: 2,
          }),
          maxAmount: faker.finance.amount({
            min: 100_000,
            max: 1_000_000,
            dec: 2,
          }),
        })
        .returning()

      this.mockLoanProducts.push(newProduct[0])
    }
    console.log(`👥 Created ${LOAN_PRODUCTS_COUNT} loan products`)
    return LOAN_PRODUCTS_COUNT
  }

  private async generateLoanRepayments() {
    for (let i = 0; i < LOAN_REPAYMENTS_COUNT; i++) {
      const loan: LoanEntity = faker.helpers.arrayElement(this.mockLoans)
      const repayment = await db
        .insert(loanRepayments)
        .values({
          loanId: loan.id,
          repaymentDate: faker.date.past().toISOString(),
          amountPaid: faker.finance.amount({ min: 2, max: 20, dec: 2 }),
          principalPaid: faker.finance.amount({ min: 2, max: 20, dec: 2 }),
          interestPaid: faker.finance.amount({
            min: 10,
            max: 20,
            dec: 0,
          }),
          balanceAfter: faker.finance.amount({
            min: 100_000,
            max: 1_000_000,
            dec: 2,
          }),
          status: faker.helpers.arrayElement([
            'pending',
            'approved',
            'rejected',
            'repaid',
          ]),
        })
        .returning()

      this.mockLoanRepayments.push(repayment[0])
    }
    console.log(`👥 Created ${LOAN_REPAYMENTS_COUNT} loan repayments`)
    return LOAN_REPAYMENTS_COUNT
  }

  private async generateAuditLogs() {
    const logs: AuditLogEntity[] = []
    for (let i = 0; i < AUDIT_LOGS_COUNT; i++) {
      const user: UserEntity = faker.helpers.arrayElement(this.mockUsers)
      const record = faker.helpers.arrayElement(this.mockLoanTransactions)
      const newLog = await db
        .insert(auditLogs)
        .values({
          recordId: record.id,
          changedBy: user.id,
          tableName: faker.helpers.arrayElement([
            this.getTableName(transactions),
            this.getTableName(loanRepayments),
            this.getTableName(loans),
            this.getTableName(members),
            this.getTableName(savingsProducts),
            this.getTableName(savingsAccounts),
            this.getTableName(loanProducts),
          ]),
          operation: faker.helpers.arrayElement(['I', 'U', 'D']),
        })
        .returning()

      logs.push(newLog[0])
    }
    console.log(`👥 Created ${AUDIT_LOGS_COUNT} audit logs`)
    return AUDIT_LOGS_COUNT
  }

  /**
   * get the database level table name
   * @param table
   * @returns string
   */
  private getTableName<T extends Table>(table: T): string {
    const config = getTableConfig(table)
    return config.name
  }

  async build() {
    await this.generateUsers()
    await this.generateLoanProducts()
    await this.generateSavingProducts()
    await this.generateMembers()
    await this.generateSavingAccounts()
    await this.generateLoans()
    await this.generateLoanRepayments()
    await this.generateLoanTransactions()
    await this.generateSavingTransactions()
    await this.generateAuditLogs()
  }
}
