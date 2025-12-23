import { db } from '@/db'
import { auditLogs } from '@/db/schema'
import { createServerFn } from '@tanstack/react-start'

// export const fetchAuditLogs = createServerFn().handler(() => {
//   return db.query.auditLogs.findMany()
// })

export const createAuditLog = createServerFn({method:"POST"}).handler(()=>{
//   return db.insert(auditLogs).values({})
})