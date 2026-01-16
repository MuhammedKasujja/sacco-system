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
import {
  EmailField,
  TextField,
  PasswordField,
} from '@/components/ui/form-fields'
import { editUserFn, EditUserSchema } from '@/actions/users'

type EditUserFormProps = {
  userId?: string
}

export function EditUserForm({ userId }: EditUserFormProps) {
  const schema = EditUserSchema
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: userId,
    },
  })

  async function onSubmit(data: z.infer<typeof schema>) {
    const { error, message } = await editUserFn({ data })
    if (error) {
      toast.error(message)
    } else {
      toast.success('User created')
    }
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>{userId ? 'Edit User' : 'Register user'}</CardTitle>
        <CardDescription>
          {userId
            ? 'Change user information'
            : 'Add users who can access the system.'}
        </CardDescription>
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
          <Button type="submit" form="form-user-registration">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
