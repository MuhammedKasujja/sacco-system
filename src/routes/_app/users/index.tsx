import { fetchUsers } from '@/actions/users'
import { createFileRoute } from '@tanstack/react-router'
import { UsersTable } from '@/features/users/components/users-table'

export const Route = createFileRoute('/_app/users/')({
  component: RouteComponent,
  loader: () => fetchUsers(),
})

function RouteComponent() {
  const users = Route.useLoaderData()
  return <UsersTable data={users} />
}
