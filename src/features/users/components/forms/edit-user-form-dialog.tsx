import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { FieldGroup } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  EmailField,
  TextField,
  PasswordField,
  HiddenField,
} from '@/components/ui/form-fields'
import { editUserFn, EditUserSchema } from '@/actions/users'
import React, { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useRouter } from '@tanstack/react-router'

type EditUserFormProps = {
  userId?: string
  children: React.ReactNode
}

export function EditUserFormDialog({ userId, children }: EditUserFormProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
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
      toast.success('User created successfully')
      setOpen(false)
      router.invalidate()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form id="form-user-registration" onSubmit={form.handleSubmit(onSubmit)}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="w-full sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{userId ? 'Edit User' : 'Register user'}</DialogTitle>
            <DialogDescription>
              {userId
                ? 'Change user information'
                : 'Add users who can access the system.'}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <HiddenField control={form.control} name={'id'} />
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
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="form-user-registration">
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
