import { fetchLoans, LoanEntity } from '@/actions/loans'
import { DataTable } from '@/components/data-table-old'
import { Button } from '@/components/ui/button'
import { formatDate, formatMoney } from '@/lib/formatting'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/_app/loans/')({
  component: RouteComponent,
  loader: () => fetchLoans(),
})

function RouteComponent() {
  const loans = Route.useLoaderData()
  return (
    <DataTable
      columns={columns}
      data={loans}
      tableActions={() => (
        <Button>
          <Link
            to={'/loans/create'}
            className="inline-flex items-center gap-0.5"
          >
            <span>
              <Plus />
            </span>
            New Loan
          </Link>
        </Button>
      )}
    />
  )
}

const columns: ColumnDef<LoanEntity>[] = [
  {
    id: 'loan_number',
    header: 'Loan No.',
    cell: ({ row }) => <div>{row.original.number}</div>,
  },
  {
    id: 'member',
    header: 'Member',
    cell: ({ row }) => (
      <div>
        {row.original.member?.firstName} {row.original.member?.lastName}
      </div>
    ),
  },
  {
    id: 'principalAmount',
    header: 'Principal',
    cell: ({ row }) => <div>{formatMoney(row.original.principalAmount!)}</div>,
  },
  {
    id: 'interestRate',
    header: 'Interest Rate',
    cell: ({ row }) => <div>{row.original.interestRate}%</div>,
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => <div>{row.original.status}</div>,
  },
  {
    id: 'createdAt',
    header: 'Date',
    cell: ({ row }) => <div>{formatDate(row.original.createdAt)}</div>,
  },
]

// const columnHelper = createColumnHelper<UserEntity>();

// const columns: ColumnDef<UserEntity>[] = [
//   columnHelper.accessor('id', {
//     header: 'ID',
//   }),
//   columnHelper.accessor('firstName', {
//     header: 'First Name',
//   }),
//   columnHelper.accessor('lastName', {
//     header: 'Last name',
//   }),
//   columnHelper.accessor('email', {
//     header: 'Email',
//   }),
//   columnHelper.accessor('createdAt', {
//     header: 'Joined On',
//   }),
// ];
