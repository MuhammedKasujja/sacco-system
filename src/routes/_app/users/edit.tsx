import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { FieldGroup, Field } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { TextField } from '@/components/ui/form-fields'
import { createUserFn, EditUserSchema } from '@/actions/users'

export const Route = createFileRoute('/_app/users/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  const form = useForm<z.infer<typeof EditUserSchema>>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {},
  })

  async function onSubmit(data: z.infer<typeof EditUserSchema>) {
    const { error, message } = await createUserFn({ data })
    if (error) {
      toast.error(message)
    } else {
      toast.success('User created')
    }
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Register user</CardTitle>
        <CardDescription>Add users who can access the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="form-user-registration"
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
              label="Email"
              name={'email'}
              control={form.control}
              placeholder="user@mail.com"
            />
            <TextField
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
          <Button type="submit" form="form-user-registration">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
