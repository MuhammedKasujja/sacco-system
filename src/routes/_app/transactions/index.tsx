import {
  fetchLoanTransactions,
  LoanTransactionEntity,
} from '@/actions/transactions'
import { DataTable } from '@/components/data-table-old'
import { MemberDetailsLink } from '@/features/members/components/member-details-link'
import { formatDate, formatMoney } from '@/lib/formatting'
import { createFileRoute, Link } from '@tanstack/react-router'
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
    cell: ({ row }) => (
      <Link
        className="font-semibold"
        to={'/loans/$loanId'}
        params={{ loanId: row.original.loans.id }}
      >
        {row.original.loans.number}
      </Link>
    ),
  },
  {
    id: 'member',
    header: 'Member',
    cell: ({ row }) => (
      <MemberDetailsLink memberId={row.original.members.id}>
        {row.original.members?.firstName} {row.original.members?.lastName}
      </MemberDetailsLink>
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
    cell: ({ row }) => <div>{row.original.transactions.status}</div>,
  },
  {
    accessorKey: 'transactions.createdAt',
    header: 'Date',
    cell: ({ row }) => (
      <div>{formatDate(row.original.transactions.createdAt)}</div>
    ),
  },
]
