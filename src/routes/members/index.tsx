import { fetchMembers, MemberEntity } from '@/actions/members'
import { DataTable } from '@/components/data-table'
import { createFileRoute } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'

export const Route = createFileRoute('/members/')({
  component: RouteComponent,
  loader: () => fetchMembers(),
})

function RouteComponent() {
  const members = Route.useLoaderData()
  return (
    <div className="p-5">
      <DataTable columns={columns} data={members} />
    </div>
  )
}

const columns: ColumnDef<MemberEntity>[] = [
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
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },

  {
    accessorKey: 'joinDate',
    header: 'Joined On',
  },
]
