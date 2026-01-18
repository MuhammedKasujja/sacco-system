import { db } from '@/db'
import { auditLogs } from '@/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { eq, ne } from 'drizzle-orm'

export type SystemAuditLogEntity = Awaited<ReturnType<typeof getSystemAuditLogsFn>>[0]

export const getSystemAuditLogsFn = createServerFn().handler(async () => {
  return await db.query.auditLogs.findMany({
    where: ne(auditLogs.entityType, 'auth'),
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
    orderBy: (auditLogs, { desc }) => [desc(auditLogs.createdAt)],
  })
})

export const getAuthLogsFn = createServerFn().handler(async () => {
  return await db.query.auditLogs.findMany({
    where: eq(auditLogs.entityType, 'auth'),
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
    orderBy: (auditLogs, { desc }) => [desc(auditLogs.createdAt)],
  })
})
