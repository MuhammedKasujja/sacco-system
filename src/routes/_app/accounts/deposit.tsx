import { DepositMoneyForm } from '@/features/accounts/components/forms/deposit-money-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/accounts/deposit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DepositMoneyForm/>
}
