import { getDashboardStatistics } from '@/actions/dashboard-statistics'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card className="bg-muted/50">
          <CardHeader>
            <CardDescription>Total Members</CardDescription>
            <CardTitle>{statistics.totalMembers}</CardTitle>
            <CardAction>
              <Button variant={'secondary'} size={'sm'} asChild>
                <Link to="/members">
                  <ArrowUpRight />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="bg-muted/50">
          <CardHeader>
            <CardDescription>Loans</CardDescription>
            <CardTitle>{formatMoney(statistics.totalLoanAmount)}</CardTitle>
            <CardAction>
              <Button variant={'secondary'} size={'sm'} asChild>
                <Link to="/loans">
                  <ArrowUpRight />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="bg-muted/50">
          <CardHeader>
            <CardDescription>Total Savings</CardDescription>
            <CardTitle>{formatMoney(statistics.totalSavingsAmount)}</CardTitle>
          </CardHeader>
        </Card>
        {/* <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" /> */}
      </div>
      <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
    </>
  )
}
