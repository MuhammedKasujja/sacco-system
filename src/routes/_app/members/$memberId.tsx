import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getAccountTransactionsByMemberId } from '@/features/accounts/queries'
import { MemberAccountTransactionsTable } from '@/features/members/components/account-transactions-table'
import { MemberLoanRepaymentsTransactionsTable } from '@/features/members/components/loan-repayments-transactions-table'
import { getMemberDetailsById } from '@/features/members/queries'
import { getLoanTransactionsByMemberId } from '@/features/transactions/actions/loans'
import { formatMoney } from '@/lib/formatting'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/members/$memberId')({
  component: RouteComponent,
  loader: async ({ params }) => ({
    member: await getMemberDetailsById({ data: { memberId: params.memberId } }),
    accountTransactions: await getAccountTransactionsByMemberId({
      data: { memberId: params.memberId },
    }),
    loanTransactions: await getLoanTransactionsByMemberId({
      data: { memberId: params.memberId },
    }),
  }),
  // errorComponent: (props) => {
  //   return <DefaultCatchBoundary {...props} />
  // },
})

function RouteComponent() {
  const { member, accountTransactions, loanTransactions } =
    Route.useLoaderData()
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-medium">Overview</h2>
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
                  <Link to={'/loans/apply'} state={{ activeEntityId: member.id }}>
                    Apply
                  </Link>
                </Button>
              )}
            </CardAction>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </div>
      <h2 className="text-lg font-medium">Accounts</h2>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {member.accounts.map((account) => (
          <Link to={'/accounts/$accountId'} params={{ accountId: account.id }}>
            <Card key={account.id}>
              <CardHeader>
                <CardTitle>{account.accountNumber}</CardTitle>
                <CardDescription>
                  Balance: {formatMoney(account.balance)}
                </CardDescription>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <h2 className="text-lg font-medium">Latest Transactions</h2>
      <Tabs defaultValue="savings">
        <TabsList>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="repayments">Loan Repayments</TabsTrigger>
        </TabsList>
        <TabsContent value="savings">
          <MemberAccountTransactionsTable transactions={accountTransactions} />
        </TabsContent>
        <TabsContent value="repayments">
          <MemberLoanRepaymentsTransactionsTable
            transactions={loanTransactions}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
