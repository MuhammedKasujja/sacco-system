import { getDashboardStatistics } from '@/actions/dashboard-statistics'
import { DataTable } from '@/components/data-table-old'
import { Button } from '@/components/ui/button'
import { formatDate, formatMoney } from '@/lib/formatting'
import { Link } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import { ViewIcon } from 'lucide-react'

type RecentLoanRepaymentTransactionEntity = Awaited<
  ReturnType<typeof getDashboardStatistics>
>['recentLoanPayments'][number]

type RecentLoanRepaymentsTransactionsTableProps = {
  transactions: RecentLoanRepaymentTransactionEntity[]
}

export function RecentLoanRepaymentsTransactionsTable({
  transactions,
}: RecentLoanRepaymentsTransactionsTableProps) {
  const columns = getLoanRepaymentsTableColumns()
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

export function getLoanRepaymentsTableColumns(): ColumnDef<RecentLoanRepaymentTransactionEntity>[] {
  return [
    {
      id: 'loan',
      header: 'Loan',
      cell: ({ row }) => (
        <Link to={'/loans/$loanId'} params={{ loanId: row.original.loanId! }}>
          {row.original.loan?.number}
        </Link>
      ),
    },
    {
      id: 'amount',
      header: 'Amount',
      cell: ({ row }) => <div>{formatMoney(row.original.amount)}</div>,
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => <div>{row.original.status}</div>,
    },
    {
      id: 'createdAt',
      header: 'Repayment Date',
      cell: ({ row }) => <div>{formatDate(row.original.createdAt)}</div>,
    },
    {
      id: 'actions',
      cell: () => {
        return (
          <Button size={'icon-sm'}>
            <ViewIcon />
          </Button>
        )
      },
    },
  ]
}
