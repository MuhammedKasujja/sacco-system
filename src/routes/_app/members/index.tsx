import { fetchMembers, MemberEntity } from '@/actions/members'
import { DataTable } from '@/components/data-table-old'
import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/_app/members/')({
  component: RouteComponent,
  loader: () => fetchMembers(),
})

function RouteComponent() {
  const members = Route.useLoaderData()
  return (
    <DataTable
      columns={columns}
      data={members}
      tableActions={() => (
        <Button>
          <Link to={'/members/edit'} className="inline-flex items-center gap-0.5">
            <span>
              <Plus />
            </span>
            New Member
          </Link>
        </Button>
      )}
    />
  )
}

const columns: ColumnDef<MemberEntity>[] = [
  // {
  //   accessorKey: 'id',
  //   header: 'ID',
  // },
  {
    id: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="font-semibold">
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
