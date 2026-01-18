import { AccountEntity, fetchAccounts } from '@/actions/accounts'
import { DataTable } from '@/components/data-table-old'
import { Button } from '@/components/ui/button'
import { MemberDetailsLink } from '@/features/members/components/member-details-link'
import { formatMoney } from '@/lib/formatting'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/_app/accounts/')({
  component: RouteComponent,
  loader: () => fetchAccounts(),
})

function RouteComponent() {
  const members = Route.useLoaderData()
  return (
    <DataTable
      columns={columns}
      data={members}
      tableActions={() => (
        <div className="space-x-2">
          <Button>
            <Link
              to={'/accounts/deposit'}
              className="inline-flex items-center gap-0.5"
            >
              <span>
                <Plus />
              </span>
              Deposit
            </Link>
          </Button>
          <Button>
            <Link
              to={'/accounts/withdrawal'}
              className="inline-flex items-center gap-0.5"
            >
              <span>
                <Plus />
              </span>
              Withdrawal
            </Link>
          </Button>
        </div>
      )}
      onSearch={(query) => {
        console.log('query: ', query)
      }}
    />
  )
}

const columns: ColumnDef<AccountEntity>[] = [
  // {
  //   accessorKey: 'id',
  //   header: 'ID',
  // },
  {
    id: 'number',
    header: 'Acc Number',
    cell: ({ row }) => (
      <Link
        className="font-semibold"
        to={'/accounts/$accountId'}
        params={{ accountId: row.original.id }}
      >
        {row.original.accountNumber}
      </Link>
    ),
  },
  {
    id: 'member',
    header: 'Member',
    cell: ({ row }) => (
      <MemberDetailsLink
        className="font-normal"
        memberId={row.original.member.id}
        maskLabel={`${row.original.member.firstName} ${row.original.member.lastName}`}
      >
        {row.original.member.firstName} {row.original.member.lastName}
      </MemberDetailsLink>
    ),
  },
  {
    id: 'balance',
    header: 'Balance',
    cell: ({ row }) => <div>{formatMoney(row.original.balance!)}</div>,
  },
  {
    id: 'openDate',
    header: 'Opened On',
    cell: ({ row }) => <div>{row.original.openedDate}</div>,
  },
]
