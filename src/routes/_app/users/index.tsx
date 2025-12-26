import { fetchUsers, UserEntity } from '@/actions/users'
import { DataTable } from '@/components/data-table'
import { formatDate } from '@/lib/formatting'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/_app/users/')({
  component: RouteComponent,
  loader: () => fetchUsers(),
})

function RouteComponent() {
  const users = Route.useLoaderData()

  function handleSearch(query?: string) {
    console.log('Search query', query)
  }

  return (
    <DataTable
      columns={columns}
      data={users}
      onSearch={handleSearch}
      tableActions={() => (
        <Button>
          <span>
            <Plus />
          </span>
          New User
        </Button>
      )}
    />
  )
}

const columns: ColumnDef<UserEntity>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    id: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div>
        {row.original.firstName} {row.original.lastName}
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    id: 'createdAt',
    header: 'Joined On',
    cell: ({ row }) => <div>{formatDate(row.original.createdAt)}</div>,
  },
]

// const columnHelper = createColumnHelper<UserEntity>();
