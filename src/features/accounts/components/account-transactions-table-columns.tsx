import { Button } from '@/components/ui/button'
import { formatDate, formatMoney } from '@/lib/formatting'
import { ColumnDef } from '@tanstack/react-table'
import { getAccountDetailsFn } from '../queries'
import { ViewIcon } from 'lucide-react'

type AccountTransactionEntity = Awaited<
  ReturnType<typeof getAccountDetailsFn>
>['transactions'][0]

export function getAccountTransactionsTableColumns(): ColumnDef<AccountTransactionEntity>[] {
  return [
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
      id: 'type',
      header: 'Operation',
      cell: ({ row }) => <div>{row.original.transactionType}</div>,
    },
    {
      id: 'createdAt',
      header: 'Repayment Date',
      cell: ({ row }) => <div>{formatDate(row.original.createdAt)}</div>,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return <Button size={'icon-sm'}><ViewIcon/></Button>
      },
    },
  ]
}
