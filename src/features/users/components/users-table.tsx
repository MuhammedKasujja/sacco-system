import { UserEntity } from '@/actions/users'
import { DataTable } from '@/components/data-table-old'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { getUserTableColunms } from './users-table-coulmns'
import { useMemo } from 'react'
import { EditUserFormDialog } from './forms/edit-user-form-dialog'

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
        <EditUserFormDialog>
          <Button>
            <span>
              <Plus />
            </span>
            New User
          </Button>
        </EditUserFormDialog>
      )}
    />
  )
}
