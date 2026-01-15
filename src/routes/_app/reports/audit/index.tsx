import { DataTable } from '@/components/data-table-old'
import {
  getSystemAuditLogsFn,
  SystemAuditLogEntity,
} from '@/features/audit-logs/queries'
import { formatDate } from '@/lib/formatting'
import { createFileRoute } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'

export const Route = createFileRoute('/_app/reports/audit/')({
  component: RouteComponent,
  loader: () => getSystemAuditLogsFn(),
})

function RouteComponent() {
  const auditLogs = Route.useLoaderData()

  return (
    <DataTable
      columns={columns}
      data={auditLogs}
      onSearch={(query) => {
        console.log('query: ', query)
      }}
    />
  )
}

const columns: ColumnDef<SystemAuditLogEntity>[] = [
  {
    id: 'number',
    header: 'ID',
    cell: ({ row }) => <div>{row.original.entityId}</div>,
  },
  {
    id: 'entity',
    header: 'Entity',
    cell: ({ row }) => <div>{row.original.entityType}</div>,
  },
  {
    id: 'operation',
    header: 'Operation',
    cell: ({ row }) => <div>{row.original.eventType}</div>,
  },
  {
    id: 'user',
    header: 'User',
    cell: ({ row }) => (
      <div>
        {row.original.user?.firstName} {row.original.user?.lastName}
      </div>
    ),
  },
  {
    id: 'createdAt',
    header: 'Date',
    cell: ({ row }) => <div>{formatDate(row.original.createdAt)}</div>,
  },
]
