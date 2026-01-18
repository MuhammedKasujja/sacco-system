import { createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface HistoryState {
    activeEntityId?: string
    entityLabel?: string
    extraData?: Record<string, unknown>
    memberId?: string
    accountId?: string
    loanId?: string
    userId?: string
  }
}
