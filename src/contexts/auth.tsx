import { createContext, useContext, ReactNode } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { useQuery } from '@tanstack/react-query'
import { getCurrentUserFn } from '@/actions/auth'
import { UserEntity } from '@/actions/users'

type AuthContextType = {
  user: UserEntity | null | undefined
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // TODO: use tanstack-start without react-query
  // const { data: user, isLoading, refetch } = useServerFn(getCurrentUserFn)

  const queryFn = useServerFn(getCurrentUserFn)

  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => queryFn(), // call the bound function
    staleTime: Infinity, // optional: keep user logged in across refreshes
  })

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
