import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { useAppSession } from '@/lib/session'
import { getUserByEmail, getUserById } from './users'
import z from 'zod'
import { checkPassword } from '@/lib/utils'

const loginSchema = z.object({
  email: z.email().max(255),
  password: z.string().min(8).max(100),
})

// Login server function
export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator((data) => loginSchema.parse(data))
  .handler(async ({ data }) => {
    const user = await getUserByEmail({
      data: { email: data.email },
    })

    if (!user) {
      return { error: 'Invalid credentials' }
    }

    const isValidPassword = await checkPassword(data.password, user.password)

    if (!isValidPassword) {
      return { error: 'Invalid Email or Password' }
    }

    // Create session
    const session = await useAppSession()
    await session.update({
      userId: user.id,
      email: user.email,
    })
  })

// Logout server function
export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await useAppSession()
  await session.clear()
  throw redirect({ href: '/login' })
})

// Get current user
export const getCurrentUserFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await useAppSession()
    const userId = session.data.userId

    if (!userId) {
      return null
    }

    return await getUserById({ data: userId })
  },
)
