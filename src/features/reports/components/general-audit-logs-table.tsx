import { DataTable } from "@/components/data-table-old";
import { SystemAuditLogEntity } from "@/features/audit-logs/queries";
import { formatDate } from "@/lib/formatting";
import { ColumnDef } from "@tanstack/react-table";

type GeneralAuditLogsTableProps = {
  auditLogs: SystemAuditLogEntity[]
}

export function GeneralAuditLogsTable({ auditLogs }: GeneralAuditLogsTableProps) {
  return (
    <DataTable
      columns={getGeneralAuditLogsTableColumns()}
      data={auditLogs}
      onSearch={(query) => {
        console.log('query: ', query)
      }}
    />
  )
}

function getGeneralAuditLogsTableColumns(): ColumnDef<SystemAuditLogEntity>[] {
  return [
    {
      id: 'number',
      header: 'No.',
      cell: ({ row }) => <div>{row.index + 1}</div>,
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
}
