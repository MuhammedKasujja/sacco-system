import { db } from '@/db'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/test')({
  server: {
    handlers: {
      GET: async () => {
        const result = await db.execute('select 1')
        return Response.json(result)
      },
    },
  },
})
