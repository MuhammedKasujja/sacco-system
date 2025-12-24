import { useSession } from '@tanstack/react-start/server'

type SessionUser = {
  userEmail: string
}

export function useAppSession() {
  return useSession<SessionUser>({
    password: 'ChangeThisBeforeShippingToProdOrYouWillBeFired',
  })
}
