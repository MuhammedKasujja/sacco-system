import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { DepositMoneySchema } from '../../schemas'
import z from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup } from '@/components/ui/field'
import {
  AutoCompleteField,
  NumberField,
  TextareaField,
} from '@/components/ui/form-fields'
import { Button } from '@/components/ui/button'
import { depositMoneyFn } from '../../actions'
import { toast } from 'sonner'
import {
  MemberAccount,
  MembersWithAccountsType,
} from '@/features/members/queries'
import { useEffect, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'

type DepositMoneyFormProps = {
  members: MembersWithAccountsType[]
}

export function DepositMoneyForm({ members }: DepositMoneyFormProps) {
  const [memberAccounts, setMemberAccounts] = useState<MemberAccount[]>([])
  const state = useRouterState({ select: (s) => s.location.state })

  const form = useForm<z.infer<typeof DepositMoneySchema>>({
    resolver: zodResolver(DepositMoneySchema),
    defaultValues: {
      memberId: state.memberId || '',
      accountId: state.accountId || '',
    },
  })

  const selectedMemberId = form.watch('memberId')

  async function onSubmit(data: z.infer<typeof DepositMoneySchema>) {
    try {
      await depositMoneyFn({ data })
      toast.success('Deposit was successfully')
    } catch (error) {
      toast.error(`${error}`)
    }
  }

  useEffect(() => {
    form.setValue('accountId', '')
    if (selectedMemberId) {
      const accounts = members.find(
        (member) => member.id === selectedMemberId,
      )?.accounts
      if (accounts) {
        setMemberAccounts(accounts)
      } else {
        setMemberAccounts([])
      }
    } else {
      setMemberAccounts([])
    }
  }, [selectedMemberId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deposit Money</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <form id="form-withdrawal-money" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
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
              label="Account"
              control={form.control}
              name={'accountId'}
              placeholder="Select Deposit Account"
              emptyPlaceholder="No Account found"
              options={memberAccounts.map((account) => ({
                label: account.accountNumber ?? '',
                value: account.id,
              }))}
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
