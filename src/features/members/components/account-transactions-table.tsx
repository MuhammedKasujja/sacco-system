import { DataTable } from '@/components/data-table-old'
import { Button } from '@/components/ui/button'
import { getAccountTransactionsByMemberId } from '@/features/accounts/queries'
import { formatDate, formatMoney } from '@/lib/formatting'
import { ColumnDef } from '@tanstack/react-table'
import { ViewIcon } from 'lucide-react'

type AccountTransactionEntity = Awaited<
  ReturnType<typeof getAccountTransactionsByMemberId>
>[number]

type MemberSavingTransactionsTableProps = {
  transactions: AccountTransactionEntity[]
}

export function MemberAccountTransactionsTable({
  transactions,
}: MemberSavingTransactionsTableProps) {
  const columns = getMemberSavingTransactionsTableColumns()
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

function getMemberSavingTransactionsTableColumns(): ColumnDef<AccountTransactionEntity>[] {
  return [
    {
      id: 'account',
      header: 'Account',
      cell: ({ row }) => (
        <div>{row.original.savings_accounts.accountNumber}</div>
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
      header: 'Repayment Date',
      cell: ({ row }) => (
        <div>{formatDate(row.original.savings_transactions.createdAt)}</div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <Button size={'icon-sm'}>
            <ViewIcon />
          </Button>
        )
      },
    },
  ]
}
