import { WithdrawalMoneyForm } from '@/features/accounts/components/forms/widthdrawal-money-form'
import { getMembersWithAccounts } from '@/features/members/queries'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/accounts/withdrawal')({
  component: RouteComponent,
  loader: () => getMembersWithAccounts(),
})

function RouteComponent() {
  const members = Route.useLoaderData()
  return <WithdrawalMoneyForm members={members} />
}
