import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { DepositMoneySchema } from '../../schemas'
import z from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup } from '@/components/ui/field'
import {
  NumberField,
  TextareaField,
  TextField,
} from '@/components/ui/form-fields'
import { Button } from '@/components/ui/button'

export function DepositMoneyForm() {
  const form = useForm<z.infer<typeof DepositMoneySchema>>({
    resolver: zodResolver(DepositMoneySchema),
  })

  function onSubmit(data: z.infer<typeof DepositMoneySchema>) {}

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deposit Money</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <form
          id="form-withdrawal-money"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <TextField
              label="Member"
              name={'memberId'}
              control={form.control}
            />
            <TextField
              label="Account"
              name={'accountId'}
              control={form.control}
            />
            <NumberField
              label="Amount"
              name={'amount'}
              control={form.control}
            />
            <TextareaField
              label="Purpose"
              name={'purpose'}
              required={false}
              control={form.control}
            />
          </FieldGroup>
        </form>
        <Field>
          <Button type="submit" form="form-withdrawal-money">
            Submit
          </Button>
        </Field>
      </CardContent>
    </Card>
  )
}
