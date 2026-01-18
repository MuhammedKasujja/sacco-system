import { DataTable } from '@/components/data-table-old'
import { Button } from '@/components/ui/button'
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
import { MemberDetailsLink } from '@/features/members/components/member-details-link'
import { formatMoney } from '@/lib/formatting'
import { createFileRoute, Link } from '@tanstack/react-router'
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
            <CardDescription>{formatMoney(account.balance)}</CardDescription>
          </CardHeader>
          <CardFooter className="gap-4">
            <Button variant={'outline'} asChild>
              <Link
                to={'/accounts/deposit'}
                params={{ accountId: account.id }}
                state={{ memberId: account.member.id, accountId: account.id }}
              >
                Deposit
              </Link>
            </Button>
            <Button variant={'outline'} asChild>
              <Link
                to={'/accounts/withdrawal'}
                params={{ accountId: account.id }}
                state={{ memberId: account.member.id, accountId: account.id }}
              >
                Withdrawal
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <Button asChild variant={'link'}>
                <MemberDetailsLink
                  className="font-medium"
                  memberId={account.member.id}
                  maskLabel={`${account.member.firstName} ${account.member.lastName}`}
                >
                  {account.member.firstName} {account.member.lastName}
                </MemberDetailsLink>
              </Button>
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
