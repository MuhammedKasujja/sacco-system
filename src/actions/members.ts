import { db } from '@/db'
import { members } from '@/db/schema'
import { hashPassword } from '@/lib/utils'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { createMemberAccountFn } from './accounts'
import { addDays } from 'date-fns'

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

export const createMemberFn = createServerFn({ method: 'POST' })
  .inputValidator(EditMemberSchema.parse)
  .handler(async ({ data }) => {
    const encryptedPassword = await hashPassword(data.password)

    const idNumber = 'M-002'
    const number = await generateNextMemberNumber()
    const joinedDate = addDays(Date.now(), 0);

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
        joinDate: joinedDate.toUTCString(),
        number,
      })
      .returning()

    // const account =
    await createMemberAccountFn({ data: { memberId: createdMember.id } })

    return { status: 'success', message: 'Member created successfully' }
  })

async function generateNextMemberNumber() {
  const totalMembers = await db.select({ id: members.id }).from(members)
  const count = (totalMembers.length + 1).toString().padStart(4, '0')

  return `M-${count}`
}
