import { useSession } from '@tanstack/react-start/server'

type SessionUser = {
  email: string
  userId: number
}

export function useAppSession() {
  return useSession<SessionUser>({
    name: 'sacco-app-session',
    password: 'ChangeThisBeforeShippingToProdOrYouWillBeFired',
    // password: process.env.SESSION_SECRET!,
    // Optional: customize cookie settings
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax',
      httpOnly: true,
    },
  })
}

// // Use secure session configuration
// export function useAppSession() {
//   return useSession({
//     name: 'app-session',
//     password: process.env.SESSION_SECRET!, // 32+ characters
//     cookie: {
//       secure: process.env.NODE_ENV === 'production', // HTTPS only in production
//       sameSite: 'lax', // CSRF protection
//       httpOnly: true, // XSS protection
//       maxAge: 7 * 24 * 60 * 60, // 7 days
//     },
//   })
// }
