import { createContext, useContext, ReactNode } from 'react'
import { UserEntity } from '@/actions/users'
import { useRouteContext } from '@tanstack/react-router'

type AuthContextType = {
  user: UserEntity | null | undefined
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // TODO: use tanstack-start without react-query
  // const { data: user, isLoading, refetch } = useServerFn(getCurrentUserFn)

  const { user } = useRouteContext({ from: '/_app' })

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
