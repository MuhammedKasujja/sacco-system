import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { useAppSession } from '@/lib/session'
import { getUserByEmailPassword, getUserById } from './users'
import z from 'zod'

const loginSchema = z.object({
  email: z.email().max(255),
  password: z.string().min(8).max(100),
})

// Login server function
export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator((data) => loginSchema.parse(data))
  .handler(async ({ data }) => {
    const user = await getUserByEmailPassword({
      data: { email: data.email, password: data.password },
    })

    if (!user) {
      return { error: 'Invalid credentials' }
    }

    // Create session
    const session = await useAppSession()
    await session.update({
      userId: user.id,
      email: user.email,
    })

    // Redirect to protected area
    throw redirect({ to: '/' })
  })

// Logout server function
export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await useAppSession()
  await session.clear()
  throw redirect({ to: '/' })
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
