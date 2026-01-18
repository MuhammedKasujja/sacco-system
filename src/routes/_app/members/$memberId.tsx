import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getMemberDetailsById } from '@/features/members/queries'
import { formatMoney } from '@/lib/formatting'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/members/$memberId')({
  component: RouteComponent,
  loader: ({ params }) =>
    getMemberDetailsById({ data: { memberId: params.memberId } }),
  // errorComponent: (props) => {
  //   return <DefaultCatchBoundary {...props} />
  // },
})

function RouteComponent() {
  const member = Route.useLoaderData()
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold">Overview</h2>
      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              {member.firstName} {member.lastName}
            </CardTitle>
            <CardDescription>{member.phone}</CardDescription>
          </CardHeader>
          <CardContent>{member.email}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Current Loan</CardDescription>
            <CardTitle>
              {member.loans.length > 0
                ? `${formatMoney(member.loans[0].principalAmount)}`
                : 'No active loans'}
            </CardTitle>
            <CardAction>
              {member.loans.length > 0 ? (
                <Button asChild>
                  <Link
                    to={'/loans/$loanId'}
                    params={{ loanId: member.loans[0].id }}
                  >
                    Pay
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link to={'/loans/apply'}>Apply</Link>
                </Button>
              )}
            </CardAction>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </div>
      <h2 className="text-lg font-semibold">Accounts</h2>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {member.accounts.map((account) => (
          <Card key={account.id}>
            <CardHeader>
              <CardTitle>{account.accountNumber}</CardTitle>
              <CardDescription>
                Balance: {formatMoney(account.balance)}
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
