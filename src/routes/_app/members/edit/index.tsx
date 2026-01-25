import { createMemberFn, EditMemberSchema } from '@/actions/members'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
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
  EmailField,
  TextField,
  PasswordField,
} from '@/components/ui/form-fields'
import { Field, FieldGroup } from '@/components/ui/field'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_app/members/edit/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof EditMemberSchema>>({
    resolver: zodResolver(EditMemberSchema),
    defaultValues: {},
  })

  async function onSubmit(data: z.infer<typeof EditMemberSchema>) {
    const { status, message, data: response } = await createMemberFn({ data })
    if (status == 'success') {
      toast.success(message)
      form.reset()
      // delayedFn(() => {
        navigate({
          to: '/members/$memberId',
          params: { memberId: response.memberId },
        })
      // })
    } else {
      toast.error('Failed to create member')
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Register Member</CardTitle>
        <CardDescription>Add Members to create their account</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="form-member-registration"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <TextField
              label="First name"
              name={'firstName'}
              control={form.control}
              placeholder=""
            />
            <TextField
              label="Last name"
              name={'lastName'}
              control={form.control}
              placeholder=""
            />
            <TextField
              label="Phone"
              name={'phone'}
              type={'phone'}
              control={form.control}
              placeholder=""
            />
            <TextField
              label="Address"
              name={'address'}
              control={form.control}
              required={false}
            />
            <EmailField
              label="Email"
              name={'email'}
              control={form.control}
              placeholder="user@mail.com"
            />
            <PasswordField
              label="Password"
              name={'password'}
              control={form.control}
              placeholder="********"
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-member-registration">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
