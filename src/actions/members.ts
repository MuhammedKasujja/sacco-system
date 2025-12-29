import { db } from '@/db'
import { members } from '@/db/schema'
import { hashPassword } from '@/lib/utils'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { createMemberAccountFn } from './accounts'

export const EditMemberSchema = z.object({
  id: z.number().optional(),
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

    const idNumber = 'M-001'

    const createdMember = await db
      .insert(members)
      .values({
        idNumber: idNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        password: encryptedPassword,
      })
      .returning()

    // const account =
    await createMemberAccountFn({ data: { memberId: createdMember[0].id } })

    return { status: "success", message: 'Member created successfully' }
  })
