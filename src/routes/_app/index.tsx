import { getDashboardStatistics } from '@/actions/dashboard-statistics'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RecentLoanRepaymentsTransactionsTable } from '@/features/dashboard/components/recent-loan-repayments-table'
import { RecentTransactionsTable } from '@/features/dashboard/components/recent-transactions-table'
import { formatMoney } from '@/lib/formatting'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'

export const Route = createFileRoute('/_app/')({
  component: RouteComponent,
  loader: () => getDashboardStatistics(),
})

function RouteComponent() {
  const statistics = Route.useLoaderData()
  return (
    <div className='space-y-5'>
      {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3"> */}
      <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs md:grid-cols-3'>
        <Card className="bg-muted/50 text-2xl font-semibold">
          <CardHeader>
            <CardDescription>Total Members</CardDescription>
            <CardTitle className='text-2xl font-semibold'>{statistics.totalMembers}</CardTitle>
            <CardAction>
              <Button variant={'secondary'} size={'sm'} className='shadow-sm' asChild>
                <Link to="/members">
                  <ArrowUpRight />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="bg-muted/50 text-2xl font-semibold">
          <CardHeader>
            <CardDescription>Loans</CardDescription>
            <CardTitle className='text-2xl font-semibold'>{formatMoney(statistics.totalLoanAmount)}</CardTitle>
            <CardAction>
              <Button variant={'secondary'} size={'sm'} className='shadow-sm' asChild>
                <Link to="/loans">
                  <ArrowUpRight />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="bg-muted/50 text-2xl font-semibold">
          <CardHeader>
            <CardDescription>Total Savings</CardDescription>
            <CardTitle className='text-2xl font-semibold'>{formatMoney(statistics.totalSavingsAmount)}</CardTitle>
          </CardHeader>
        </Card>
        {/* <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" /> */}
      </div>
      {/* <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" /> */}
      {/* <h2>Recent Savings</h2> */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Savings</CardTitle>
          <CardDescription>
            Latest savings transactions made by members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentTransactionsTable transactions={statistics.recentSavings} />
        </CardContent>
      </Card>
      {/* <RecentTransactionsTable transactions={statistics.recentSavings} /> */}
      <div className="flex justify-between items-center">
        <h2>Recent Loan Repayments</h2>
        <Button variant={'secondary'} size={'sm'} asChild>
          <Link to="/loans">
            View All
            <ArrowUpRight />
          </Link>
        </Button>
      </div>
      <RecentLoanRepaymentsTransactionsTable
        transactions={statistics.recentLoanPayments}
      />
    </div>
  )
}
