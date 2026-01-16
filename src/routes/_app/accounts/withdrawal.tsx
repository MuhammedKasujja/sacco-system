import { WithdrawalMoneyForm } from '@/features/accounts/components/forms/widthdrawal-money-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/accounts/withdrawal')({
  component: RouteComponent,
})

function RouteComponent() {
  return <WithdrawalMoneyForm />
}
