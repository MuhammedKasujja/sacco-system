import {
  fetchLoanTransactions,
  LoanTransactionEntity,
} from '@/actions/transactions'
import { DataTable } from '@/components/data-table-old'
import { formatDate, formatMoney } from '@/lib/formatting'
import { createFileRoute } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'

export const Route = createFileRoute('/_app/transactions/')({
  component: RouteComponent,
  loader: () => fetchLoanTransactions(),
})

function RouteComponent() {
  const transactions = Route.useLoaderData()
  return <DataTable columns={columns} data={transactions} />
}

const columns: ColumnDef<LoanTransactionEntity>[] = [
  {
    id: 'loan_number',
    header: 'Loan',
    cell: ({ row }) => <div>{row.original.loans.number}</div>,
  },
  {
    id: 'member',
    header: 'Member',
    cell: ({ row }) => (
      <div>
        {row.original.members?.firstName} {row.original.members?.lastName}
      </div>
    ),
  },
  {
    id: 'amount',
    header: 'Amount',
    cell: ({ row }) => (
      <div>{formatMoney(row.original.transactions.amount)}</div>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => <div>{row.original.loans.status}</div>,
  },
  {
    accessorKey: 'transactions.createdAt',
    header: 'Date',
    cell: ({ row }) => (
      <div>{formatDate(row.original.transactions.createdAt)}</div>
    ),
  },
]
