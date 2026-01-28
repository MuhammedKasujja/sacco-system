import { getTransactions } from '@/actions/transactions'
import { DataTable } from '@/components/data-table-old'
import { TransactionsSkeleton } from '@/features/transactions/components/transactions-skelton'
import { getTransactionsTableColumns } from '@/features/transactions/components/transactions-table-columns'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/transactions/')({
  component: RouteComponent,
  loader: () => getTransactions(),
  pendingComponent: () => <TransactionsSkeleton />,
})

function RouteComponent() {
  const transactions = Route.useLoaderData()
  const columns = getTransactionsTableColumns()
  return <DataTable columns={columns} data={transactions} />
}
