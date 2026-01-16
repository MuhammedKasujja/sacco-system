import { EditUserForm } from '@/features/users/components/forms/edit-user-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/users/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <EditUserForm />
}
