import { Button } from '@/components/ui/button'
import { EditUserFormDialog } from '@/features/users/components/forms/edit-user-form-dialog'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/users/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <EditUserFormDialog>
      <Button>New User</Button>
    </EditUserFormDialog>
  )
}
