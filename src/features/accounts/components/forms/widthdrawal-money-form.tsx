import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { WithdrawalMoneySchema } from '../../schemas'
import z from 'zod/v3'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup } from '@/components/ui/field'
import {
  NumberField,
  TextareaField,
  TextField,
} from '@/components/ui/form-fields'
import { Button } from '@/components/ui/button'
import { withdrawalMoneyFn } from '../../actions'
import { toast } from 'sonner'
import { MembersWithAccountsType } from '@/features/members/queries'

type WithdrawalMoneyFormProps = {
  members: MembersWithAccountsType[]
}

export function WithdrawalMoneyForm({ members }: WithdrawalMoneyFormProps) {
  const form = useForm<z.infer<typeof WithdrawalMoneySchema>>({
    resolver: zodResolver(WithdrawalMoneySchema),
  })

  async function onSubmit(data: z.infer<typeof WithdrawalMoneySchema>) {
    try {
      await withdrawalMoneyFn({ data })
      toast.success('Withdrawal was successfully')
    } catch (error) {
      toast.error(`${error}`)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdrawal Money</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <FieldGroup>
          <form
            id="form-withdrawal-money"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
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
          </form>
        </FieldGroup>
        <Field>
          <Button type="submit" form="form-withdrawal-money">
            Submit
          </Button>
        </Field>
      </CardContent>
    </Card>
  )
}
