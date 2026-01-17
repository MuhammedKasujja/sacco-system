import { DataTable } from '@/components/data-table-old'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { getAccountTransactionsTableColumns } from '@/features/accounts/components/account-transactions-table-columns'
import { getAccountDetailsFn } from '@/features/accounts/queries'
import { formatMoney } from '@/lib/formatting'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'

export const Route = createFileRoute('/_app/accounts/$accountId')({
  component: RouteComponent,
  loader: ({ params }) =>
    getAccountDetailsFn({ data: { accountId: params.accountId } }),
})

function RouteComponent() {
  const account = Route.useLoaderData()
  const columns = useMemo(() => getAccountTransactionsTableColumns(), [])
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>{account.accountNumber}</CardTitle>
          </CardHeader>
          <CardFooter>{formatMoney(account.balance)}</CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              {account.member.firstName} {account.member.lastName}
            </CardTitle>
            <CardDescription>{account.member.phone}</CardDescription>
          </CardHeader>
        </Card>
      </div>
      <Label>Transactions</Label>
      <DataTable data={account.transactions} columns={columns} />
    </div>
  )
}
