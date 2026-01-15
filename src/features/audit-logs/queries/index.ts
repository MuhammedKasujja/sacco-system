import { db } from '@/db'
import { createServerFn } from '@tanstack/react-start'

export type SystemAuditLogEntity = Awaited<ReturnType<typeof getSystemAuditLogsFn>>[0]

export const getSystemAuditLogsFn = createServerFn().handler(async () => {
  return await db.query.auditLogs.findMany({
    columns: {
      id: true,
      entityId: true,
      entityType: true,
      eventType: true,
      description: true,
      createdAt: true,
    },
    with: {
      user: {
        columns: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  })
})
