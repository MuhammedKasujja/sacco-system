import { DepositMoneyForm } from '@/features/accounts/components/forms/deposit-money-form'
import { getMembersWithAccounts } from '@/features/members/queries'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/accounts/deposit')({
  component: RouteComponent,
  loader: () => getMembersWithAccounts(),
})

function RouteComponent() {
  const members = Route.useLoaderData()
  return <DepositMoneyForm members={members} />
}
