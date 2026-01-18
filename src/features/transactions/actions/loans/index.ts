import z from 'zod'
import { EditLoanRepaymentTransactionSchema } from '../../schemas'
import { db } from '@/db'
import { createServerFn } from '@tanstack/react-start'
import { loans, loanSchedules, transactions } from '@/db/schema'
import { getCurrentUserFn } from '@/actions/auth'
import { getCurrentTime } from '@/lib/utils'
import { getMemberByLoanIdFn } from '@/features/members/queries'
import { AuditSevice } from '@/server/services/audit_service'
import { desc, eq } from 'drizzle-orm'
import { LoanScheduleNotFoundException } from '@/server/execptions'
import { MemberIdSchema } from '@/features/members/schemas'

const makeLoanRepaymentTransaction = async (
  data: z.infer<typeof EditLoanRepaymentTransactionSchema>,
) => {
  const { loanId, amount, payeeName, payeeTelephone, scheduleId } = data

  const loggedInUser = await getCurrentUserFn()
  const { member } = await getMemberByLoanIdFn({ data: { loanId } })
  await updateLoanScheduleBalance(scheduleId, amount)

  const [latestTransaction] = await db
    .insert(transactions)
    .values({
      loanId,
      amount: amount.toString(),
      transactionType: 'loan_repayment',
      date: getCurrentTime(),
      payeeName,
      payeeTelephone,
      memberId: member.id,
      recordedBy: loggedInUser?.id,
      status: 'paid',
    })
    .returning()
  // mark the loan as paid if all schedules are paid
  await updateLoanStatus(loanId)

  AuditSevice.createTransactionAuditLog({
    eventType: 'TRANSACTION_CREATED',
    entityId: latestTransaction.id,
  })
}

export const makeLoanRepaymentTransactionFn = createServerFn({ method: 'POST' })
  .inputValidator(EditLoanRepaymentTransactionSchema.parse)
  .handler(async ({ data }) => {
    return makeLoanRepaymentTransaction({ ...data })
  })

const getLoanScheduleById = async (scheduleId: string) => {
  try {
    // await db
    //   .select({
    //     balanceAfter: loanSchedules.balanceAfter
    //   })
    //   .from(loanSchedules)
    //   .where(eq(loanSchedules.id, scheduleId))
    const schedule = await db.query.loanSchedules.findFirst({
      where: eq(loanSchedules.id, scheduleId),
      columns: {
        id: true,
        amount: true,
        balanceAfter: true,
        totalAmountPaid: true,
        status: true,
      },
    })
    if (!schedule) throw new LoanScheduleNotFoundException()
    return schedule
  } catch (error) {
    throw new LoanScheduleNotFoundException()
  }
}

const updateLoanScheduleBalance = async (
  scheduleId: string,
  amountToPay: number,
) => {
  const repaymentSchedule = await getLoanScheduleById(scheduleId)
  const balance = Number(repaymentSchedule.balanceAfter)
  if (balance <= 0) {
    throw new Error('This repayment schedule is already paid')
  }
  let amountPaid = Number(repaymentSchedule.totalAmountPaid)
  const remainingBalance = balance - amountToPay
  let update = false

  if (remainingBalance === 0) {
    repaymentSchedule.status = 'paid'
    repaymentSchedule.totalAmountPaid = repaymentSchedule.amount
    repaymentSchedule.balanceAfter = '0'
    update = true
  } else if (remainingBalance > 0) {
    repaymentSchedule.status = 'partial'
    repaymentSchedule.totalAmountPaid = (amountPaid + amountToPay).toString()
    repaymentSchedule.balanceAfter = (balance - amountToPay).toString()
    update = true
  }
  /// TODO: cater for extra amount to pay ( for negative remainingBalance )
  if (update) {
    const { status, totalAmountPaid, balanceAfter } = repaymentSchedule
    await db
      .update(loanSchedules)
      .set({
        status,
        totalAmountPaid,
        balanceAfter,
      })
      .where(eq(loanSchedules.id, scheduleId))
  }
}

const updateLoanStatus = async (loanId: string) => {
  const pendingSchedules = await db.query.loanSchedules.findMany({
    where: eq(loanSchedules.loanId, loanId),
    columns: {
      id: true,
      status: true,
    },
  })

  const hasPending = pendingSchedules.some(
    (schedule) => schedule.status !== 'paid',
  )

  if (!hasPending) {
    await db.update(loans).set({ status: 'paid' }).where(eq(loans.id, loanId))
  } else {
    await db
      .update(loans)
      .set({ status: 'partial' })
      .where(eq(loans.id, loanId))
  }
}

export const getLoanTransactionsByMemberId = createServerFn()
  .inputValidator(MemberIdSchema.parse)
  .handler(async ({ data }) => {
    const list = await db.query.transactions.findMany({
      where: eq(transactions.memberId, data.memberId),
      with:{
        loan:true 
      },
      limit: 10,
      orderBy: desc(transactions.createdAt),
    })
    return list
  })
