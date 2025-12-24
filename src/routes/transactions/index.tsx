import {
  fetchLoanTransactions,
  LoanTransactionEntity,
} from '@/actions/transactions'
import { DataTable } from '@/components/data-table'
import { formatDate, formatMoney } from '@/lib/formatting'
import { createFileRoute } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'

export const Route = createFileRoute('/transactions/')({
  component: RouteComponent,
  loader: () => fetchLoanTransactions(),
})

function RouteComponent() {
  const transactions = Route.useLoaderData()
  return (
    <div className="p-5">
      <DataTable columns={columns} data={transactions} />
    </div>
  )
}

const columns: ColumnDef<LoanTransactionEntity>[] = [
  {
    id: 'loan_number',
    header: 'ID',
    cell: ({ row }) => <div>{row.original.transactions.id}</div>,
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
    id: 'principalAmount',
    header: 'Principal',
    cell: ({ row }) => (
      <div>{formatMoney(row.original.loans.principalAmount!)}</div>
    ),
  },
  {
    id: 'interestRate',
    header: 'Interest Rate',
    cell: ({ row }) => <div>{row.original.loans.interestRate}%</div>,
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
