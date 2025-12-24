import { AccountEntity, fetchAccounts } from '@/actions/accounts'
import { DataTable } from '@/components/data-table'
import { formatMoney } from '@/lib/formatting'
import { createFileRoute } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'

export const Route = createFileRoute('/accounts/')({
  component: RouteComponent,
  loader: () => fetchAccounts(),
})

function RouteComponent() {
  const members = Route.useLoaderData()
  return (
    <div className="p-5">
      <DataTable columns={columns} data={members} />
    </div>
  )
}

const columns: ColumnDef<AccountEntity>[] = [
  {
    accessorKey: 'accountId',
    header: 'ID',
  },
  {
    id: 'number',
    header: 'Acc Number',
    cell: ({ row }) => <div>{row.original.accountNumber}</div>,
  },
  {
    id: 'member',
    header: 'Member',
    cell: ({ row }) => (
      <div>
        {row.original.member.firstName} {row.original.member.lastName}
      </div>
    ),
  },
  {
    id: 'balance',
    header: 'Balance',
    cell: ({ row }) => <div>{formatMoney(row.original.balance!)}</div>,
  },
  {
    id: 'openDate',
    header: 'Opened On',
    cell: ({ row }) => <div>{row.original.openedDate}</div>,
  },
]
