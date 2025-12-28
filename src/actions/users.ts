import { db } from '@/db'
import { users } from '@/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { and, eq, ilike, or } from 'drizzle-orm'

export type UserEntity = Awaited<ReturnType<typeof fetchUsers>>[0]

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

export const createUser = createServerFn({ method: 'POST' }).handler(() => {
  return db.insert(users).values({
    firstName: 'kasujja',
    lastName: 'muhammed',
    email: 'al.kasmud.2@gmail.com',
    password: 'Password2',
  })
})

export const getUserById = createServerFn({ method: 'POST' })
  .inputValidator((userId: number) => userId)
  .handler(async ({ data }) => {
    return await db.query.users.findFirst({
      where: eq(users.id, data),
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
