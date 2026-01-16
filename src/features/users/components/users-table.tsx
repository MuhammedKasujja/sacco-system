import { UserEntity } from '@/actions/users'
import { DataTable } from '@/components/data-table-old'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { getUserTableColunms } from './users-table-coulmns'
import { useMemo } from 'react'

type UsersTableProps = {
  data: UserEntity[]
}

export function UsersTable({ data }: UsersTableProps) {
  function handleSearch(query?: string) {
    console.log('Search query', query)
  }
  const columns = useMemo(() => getUserTableColunms(), [])

  return (
    <DataTable
      columns={columns}
      data={data}
      onSearch={handleSearch}
      tableActions={() => (
        <Button>
          <Link to={'/users/edit'} className="inline-flex items-center gap-0.5">
            <span>
              <Plus />
            </span>
            New User
          </Link>
        </Button>
      )}
    />
  )
}
