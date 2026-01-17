import { DataTable } from '@/components/data-table-old'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  getSystemAuditLogsFn,
  SystemAuditLogEntity,
  getAuthLogsFn,
} from '@/features/audit-logs/queries'
import { formatDate } from '@/lib/formatting'
import { createFileRoute } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'

export const Route = createFileRoute('/_app/reports/audit/')({
  component: RouteComponent,
  loader: async () => ({
    systemLogs: await getSystemAuditLogsFn(),
    authLogs: await getAuthLogsFn(),
  }),
})

function RouteComponent() {
  const { systemLogs, authLogs } = Route.useLoaderData()

  return (
    <Tabs defaultValue="general">
      <TabsList>
        <TabsTrigger value="general">General Logs</TabsTrigger>
        <TabsTrigger value="auth">Auth Logs</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <DataTable
          columns={columns}
          data={systemLogs}
          onSearch={(query) => {
            console.log('query: ', query)
          }}
        />
      </TabsContent>
      <TabsContent value="auth">
        <DataTable
          columns={columns}
          data={authLogs}
          onSearch={(query) => {
            console.log('query: ', query)
          }}
        />
      </TabsContent>
    </Tabs>
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
