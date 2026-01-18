import { getDashboardStatistics } from '@/actions/dashboard-statistics'
import { DataTable } from '@/components/data-table-old'
import { Button } from '@/components/ui/button'
import { MemberDetailsLink } from '@/features/members/components/member-details-link'
import { formatDate, formatMoney } from '@/lib/formatting'
import { Link } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import { ViewIcon } from 'lucide-react'

type RecentAccountTransactionEntity = Awaited<
  ReturnType<typeof getDashboardStatistics>
>['recentSavings'][number]

type RecentSavingTransactionsTableProps = {
  transactions: RecentAccountTransactionEntity[]
}

export function RecentTransactionsTable({
  transactions,
}: RecentSavingTransactionsTableProps) {
  const columns = getRecentTransactionsTableColumns()
  return (
    <DataTable
      showPagination={false}
      columns={columns}
      data={transactions}
      // onSearch={(query) => {
      //   console.log('query: ', query)
      // }}
    />
  )
}

function getRecentTransactionsTableColumns(): ColumnDef<RecentAccountTransactionEntity>[] {
  return [
    {
      id: 'member',
      header: 'Member',
      cell: ({ row }) => (
        <MemberDetailsLink
          className='font-normal'
          memberId={row.original.savings_accounts.memberId}        >
          {row.original.members.firstName} {row.original.members.lastName}
        </MemberDetailsLink>
      ),
    },
    {
      id: 'account',
      header: 'Account',
      cell: ({ row }) => (
        <Link
          to="/accounts/$accountId"
          params={{ accountId: row.original.savings_accounts.id }}
        >
          {row.original.savings_accounts.accountNumber}
        </Link>
      ),
    },
    {
      id: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <div>{formatMoney(row.original.savings_transactions.amount)}</div>
      ),
    },
    {
      id: 'type',
      header: 'Operation',
      cell: ({ row }) => (
        <div>{row.original.savings_transactions.transactionType}</div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => <div>{row.original.savings_transactions.status}</div>,
    },
    {
      id: 'createdAt',
      header: 'Date',
      cell: ({ row }) => (
        <div>{formatDate(row.original.savings_transactions.createdAt)}</div>
      ),
    },
    {
      id: 'actions',
      cell: ({}) => {
        return (
          <Button size={'icon-sm'}>
            <ViewIcon />
          </Button>
        )
      },
    },
  ]
}
