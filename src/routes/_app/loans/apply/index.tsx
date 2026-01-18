import { fetchLoanProducts } from '@/actions/loan_products'
import { fetchMembers } from '@/actions/members'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldGroup } from '@/components/ui/field'
import {
  AutoCompleteField,
  HiddenField,
  NumberField,
} from '@/components/ui/form-fields'
import { createLoanFn, EditLoanSchema } from '@/features/loans/actions'
import { formatMoney } from '@/lib/formatting'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, useRouterState } from '@tanstack/react-router'
import { Activity, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod/v3'

export const Route = createFileRoute('/_app/loans/apply/')({
  loader: async () => ({
    loanProducts: await fetchLoanProducts(),
    members: await fetchMembers(),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const state = useRouterState({ select: (s) => s.location.state })

  const { loanProducts, members } = Route.useLoaderData()
  const [minAmount, setMinAmount] = useState(0)
  const [maxAmount, setMaxAmount] = useState(0)

  const form = useForm<z.infer<typeof EditLoanSchema>>({
    resolver: zodResolver(EditLoanSchema),
    defaultValues: {
      memberId: state.memberId || '',
    },
  })

  const selectedLoanProductId = form.watch('loanProductId')
  const currentPrincipalAmount = form.watch('principalAmount')

  useEffect(() => {
    const activeLoanProduct = loanProducts.find(
      (ele) => ele.id === selectedLoanProductId,
    )
    if (activeLoanProduct) {
      form.setValue('interestRate', Number(activeLoanProduct.interestRate))
      setMinAmount(Number(activeLoanProduct.minAmount))
      setMaxAmount(Number(activeLoanProduct.maxAmount))
    } else {
      form.setValue('interestRate', 0)
      setMinAmount(0)
      setMaxAmount(0)
    }
  }, [selectedLoanProductId, loanProducts])

  useEffect(() => {
    if (currentPrincipalAmount < minAmount) {
      form.setError(
        'principalAmount',
        { type: 'min', message: 'Principal should be above minimum Amount' },
        { shouldFocus: true },
      )
      console.log('principalAmount', 'min', currentPrincipalAmount)
    } else if (currentPrincipalAmount > maxAmount) {
      form.setError(
        'principalAmount',
        { type: 'max', message: 'Principal should be below maximum Amount' },
        { shouldFocus: true },
      )
      console.log('principalAmount', 'max', currentPrincipalAmount)
    } else {
      form.clearErrors('principalAmount')
    }
  }, [minAmount, maxAmount, currentPrincipalAmount])

  async function onSubmit(data: z.infer<typeof EditLoanSchema>) {
    try {
      const { message } = await createLoanFn({ data })
      toast.message(message)
    } catch (error) {
      toast.error(error as any)
    }
  }

  return (
    <Card>
      <CardContent>
        <form id="form-edit-loan" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <HiddenField control={form.control} name={'id'} />
            <AutoCompleteField
              label="Member"
              control={form.control}
              name={'memberId'}
              placeholder="Select Member"
              emptyPlaceholder="No members found"
              options={members.map((member) => ({
                label: `${member.firstName} ${member.lastName}`,
                value: member.id,
              }))}
            />
            <AutoCompleteField
              label="Loan Product"
              control={form.control}
              name={'loanProductId'}
              placeholder="Select Loan Product"
              emptyPlaceholder="No Loan Product found"
              options={loanProducts.map((product) => ({
                label: product.productName,
                value: product.id,
              }))}
            />
            <Activity mode={minAmount > 0 ? 'visible' : 'hidden'}>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{formatMoney(minAmount)}</CardTitle>
                    <CardDescription>Minimum Loan Amount</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>{formatMoney(maxAmount)}</CardTitle>
                    <CardDescription>Maximum Loan Amount</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </Activity>
            <NumberField
              label="Principal Amount"
              control={form.control}
              name={'principalAmount'}
            />
            <NumberField
              label="Repayment Months"
              control={form.control}
              name={'repaymentPeriodInMonths'}
            />
            <NumberField
              label="Interest"
              control={form.control}
              name={'interestRate'}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-edit-loan">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
