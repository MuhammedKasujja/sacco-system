import { fetchMembers, MemberEntity } from '@/actions/members'
import { DataTable } from '@/components/data-table'
import { createFileRoute } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'

export const Route = createFileRoute('/_app/members/')({
  component: RouteComponent,
  loader: () => fetchMembers(),
})

function RouteComponent() {
  const members = Route.useLoaderData()
  return <DataTable columns={columns} data={members} />
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
      <div className='font-semibold'>
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
