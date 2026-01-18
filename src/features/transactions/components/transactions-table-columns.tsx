import { TransactionEntity } from '@/actions/transactions'
import { Button } from '@/components/ui/button'
import { MemberDetailsLink } from '@/features/members/components/member-details-link'
import { formatDate, formatMoney } from '@/lib/formatting'
import { Link } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'

export function getTransactionsTableColumns(): ColumnDef<TransactionEntity>[] {
  return [
    {
      id: 'loan_number',
      header: 'Loan',
      cell: ({ row }) => (
        <Button asChild variant={'link'}>
          <Link
            className="font-semibold"
            to={'/loans/$loanId'}
            params={{ loanId: row.original.loans.id }}
          >
            {row.original.loans.number}
          </Link>
        </Button>
      ),
    },
    {
      id: 'member',
      header: 'Member',
      cell: ({ row }) => (
        <Button asChild variant={'link'}>
          <MemberDetailsLink
            memberId={row.original.members.id}
            maskLabel={`${row.original.members.firstName} ${row.original.members.lastName}`}
          >
            {row.original.members?.firstName} {row.original.members?.lastName}
          </MemberDetailsLink>
        </Button>
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
}
