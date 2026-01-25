import { UserEntity } from '@/actions/users'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/formatting'
import { ColumnDef } from '@tanstack/react-table'
import { Edit2Icon } from 'lucide-react'
import { EditUserFormDialog } from './forms/edit-user-form-dialog'

export function getUserTableColunms(): ColumnDef<UserEntity>[] {
  return [
    // {
    //   accessorKey: 'id',
    //   header: 'ID',
    // },
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
    {
      id: 'actions',
      cell: ({}) => (
        <EditUserFormDialog>
          <Button size={'icon-sm'} variant={'secondary'}>
            <Edit2Icon />
          </Button>
        </EditUserFormDialog>
      ),
    },
  ]
}
