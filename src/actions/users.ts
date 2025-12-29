import { db } from '@/db'
import { users } from '@/db/schema'
import { hashPassword } from '@/lib/utils'
import { createServerFn } from '@tanstack/react-start'
import { and, eq, ilike, or } from 'drizzle-orm'
import z from 'zod'

export const EditUserSchema = z.object({
  email: z.email(),
  password: z.string().min(4),
  firstName: z.string().min(4),
  lastName: z.string().min(4),
})

export type UserEntity = Awaited<ReturnType<typeof fetchUsers>>[0]

export type AuthUserEntity = Awaited<ReturnType<typeof getUserById>>

export const fetchUsers = createServerFn({ method: 'GET' })
  .inputValidator((query?: string) => query)
  .handler(async ({ data }) => {
    if (!data?.trim()) {
      return await db.select().from(users)
    }

    // For text columns: partial match with %
    const textConditions = [
      ilike(users.firstName, `%${data}%`),
      ilike(users.lastName, `%${data}%`),
    ]

    // // Optional: if query is numeric, also match age exactly
    // const num = Number(query);
    // if (!isNaN(num)) {
    //   textConditions.push(eq(users.age, num));
    // }

    return await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(or(...textConditions))

    // return db.query.users.findMany()
  })

export const createUserFn = createServerFn({ method: 'POST' })
  .inputValidator((data) => EditUserSchema.parse(data))
  .handler(async ({ data }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    })

    if (existingUser) {
      return { error: true, message: 'User already exists' }
    }

    const encryptedPassword = await hashPassword(data.password)

    const user = await db
      .insert(users)
      .values({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: encryptedPassword,
      })
      .returning()
    return { error: false, data: user[0] }
  })

export const getUserById = createServerFn({ method: 'POST' })
  .inputValidator((userId: string) => userId)
  .handler(async ({ data }) => {
    return await db.query.users.findFirst({
      where: eq(users.id, data),
      columns: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    })
  })

export const getUserByEmail = createServerFn({ method: 'POST' })
  .inputValidator((data: { email: string }) => data)
  .handler(async ({ data }) => {
    const listUsers = await db
      .select()
      .from(users)
      .where(and(eq(users.email, data.email)))
      .limit(1)

    return listUsers.length > 0 ? listUsers[0] : null
  })
