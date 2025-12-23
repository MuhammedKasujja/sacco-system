import { fetchUsers } from '@/actions/users'
import { createFileRoute } from '@tanstack/react-router'
import { Fragment } from 'react/jsx-runtime'

export const Route = createFileRoute('/users/')({
  component: RouteComponent,
  loader: () => fetchUsers(),
})

function RouteComponent() {
  const users = Route.useLoaderData()

  return (
    <div>
      {users.map((user) => (
        <Fragment key={user.id}>
          <p>
            {user.firstName} {user.lastName}
          </p>
          <p>{user.email}</p>
        </Fragment>
      ))}
    </div>
  )
}
