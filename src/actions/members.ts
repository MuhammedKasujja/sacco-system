import { db } from '@/db'
import { loans, members } from '@/db/schema'
import { generateRandomString, getCurrentTime, hashPassword } from '@/lib/utils'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { createMemberAccountFn } from './accounts'
import { AuditSevice } from '@/server/services/audit_service'
import { and, eq, isNull, ne, or } from 'drizzle-orm'
import { MemberIdSchema } from '@/features/members/schemas'
import { MemberHasOutstandingLoanException } from '@/server/execptions'

export const EditMemberSchema = z.object({
  id: z.string().optional(),
  idNumber: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  phone: z.string(),
  password: z.string(),
  joinDate: z.date().optional(),
  address: z.string().optional(),
})

export type MemberEntity = Awaited<ReturnType<typeof fetchMembers>>[0]

export const fetchMembers = createServerFn().handler(() => {
  return db.query.members.findMany({
    columns: {
      id: true,
      idNumber: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      phone: true,
      joinDate: true,
      status: true,
      address: true,
    },
  })
})

export const fetchMembersEligibleForLoanFn = createServerFn().handler(
  async () => {
    return await db
      .selectDistinct({
        id: members.id,
        idNumber: members.idNumber,
        firstName: members.firstName,
        lastName: members.lastName,
        email: members.email,
        phone: members.phone,
      })
      .from(members)
      .leftJoin(loans, eq(members.id, loans.memberId))
      .where(or(isNull(loans.id), eq(loans.status, 'repaid')))
      .orderBy(members.id)
  },
)

export const createMemberFn = createServerFn({ method: 'POST' })
  .inputValidator(EditMemberSchema.parse)
  .handler(async ({ data }) => {
    const encryptedPassword = await hashPassword(data.password)

    const idNumber = generateRandomString(8)
    const number = await generateNextMemberNumber()

    const [createdMember] = await db
      .insert(members)
      .values({
        idNumber: idNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        password: encryptedPassword,
        joinDate: getCurrentTime(),
        number,
      })
      .returning()
    await AuditSevice.createMemberAuditLog({
      eventType: data.id ? 'MEMBER_UPDATED' : 'MEMBER_CREATED',
      entityId: createdMember.id,
    })
    // const account =
    await createMemberAccountFn({ data: { memberId: createdMember.id } })

    return {
      status: 'success',
      message: 'Member created successfully',
      data: { memberId: createdMember.id },
    }
  })

async function generateNextMemberNumber() {
  const totalMembers = await db.select({ id: members.id }).from(members)
  const count = (totalMembers.length + 1).toString().padStart(4, '0')

  return `M-${count}`
}

export const checkIfMemberEligibleForLoan = createServerFn()
  .inputValidator(MemberIdSchema.parse)
  .handler(async ({ data }) => {
    try {
      const [outstandingLoan] = await db
        .selectDistinct({
          id: members.id,
        })
        .from(members)
        .leftJoin(loans, eq(members.id, loans.memberId))
        .where(and(ne(loans.status, 'repaid'), eq(members.id, data.memberId)))
        .orderBy(members.id)
        .limit(1)
      // if member has an outstanding loan, do not proceed
      if (outstandingLoan) {
        throw new MemberHasOutstandingLoanException()
      }
    } catch (error) {
      throw new MemberHasOutstandingLoanException()
    }
  })
