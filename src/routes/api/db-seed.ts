import { DatabaseSeeder } from '@/db/database_seeder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/db-seed')({
  server: {
    handlers: {
      GET: async () => {
        try {
          new DatabaseSeeder().seed({ includeTestData: false })
          return Response.json({
            success: true,
            message: 'Seeding DB successfully',
          })
        } catch (error) {
          return Response.json({ success: false, error })
        } finally {
          //   await db.$client.end()
        }
      },
    },
  },
})
