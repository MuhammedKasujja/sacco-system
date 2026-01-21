import { createFileRoute } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import z from 'zod'
import {
  NumberField,
  TextareaField,
  TextField,
} from '@/components/ui/form-fields'
import { Field, FieldGroup } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import {
  createLoanProductFn,
  CreateLoanProductSchema,
} from '@/actions/loan_products'

export const Route = createFileRoute('/_app/loan-products/edit/')({
  component: RouteComponent,
})

function RouteComponent() {
  const form = useForm<z.infer<typeof CreateLoanProductSchema>>({
    resolver: zodResolver(CreateLoanProductSchema),
    defaultValues: {},
  })

  async function onSubmit(data: z.infer<typeof CreateLoanProductSchema>) {
    const { status, message } = await createLoanProductFn({ data })
    if (status == 'success') {
      toast.success(message)
    } else {
      toast.error('Failed to create loan product')
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Loan Product</CardTitle>
        <CardDescription>Add new loan product</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="form-member-registration"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <TextField
              label="Product Name"
              name={'productName'}
              control={form.control}
              placeholder=""
            />
            <NumberField
              label="Min Amount"
              name={'minAmount'}
              control={form.control}
              placeholder=""
            />
            <NumberField
              label="Max Amount"
              name={'maxAmount'}
              control={form.control}
              placeholder=""
            />
            <NumberField
              label="Interest Rate"
              name={'interestRate'}
              control={form.control}
              placeholder=""
            />
            <NumberField
              label="Repayment Period Months"
              name={'repaymentPeriodMonths'}
              control={form.control}
            />
            <TextareaField
              label="Description"
              name={'description'}
              control={form.control}
              required={false}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button
            type="submit"
            form="form-member-registration"
            disabled={form.formState.isSubmitting}
          >
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
