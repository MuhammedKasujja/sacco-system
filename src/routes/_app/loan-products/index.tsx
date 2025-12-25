import { fetchLoanProducts, LoanProductEntity } from '@/actions/loan_products'
import { DataTable } from '@/components/data-table'
import { formatDate, formatMoney } from '@/lib/formatting'
import { createFileRoute } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'

export const Route = createFileRoute('/_app/loan-products/')({
  component: RouteComponent,
  loader: () => fetchLoanProducts(),
})

function RouteComponent() {
  const loanProducts = Route.useLoaderData()
  return <DataTable columns={columns} data={loanProducts} />
}

const columns: ColumnDef<LoanProductEntity>[] = [
  {
    id: 'number',
    header: 'ID',
    cell: ({ row }) => <div>{row.original.productId}</div>,
  },
  {
    id: 'name',
    header: 'Name',
    cell: ({ row }) => <div>{row.original.productName}</div>,
  },
  {
    id: 'min',
    header: 'Min Amount',
    cell: ({ row }) => <div>{formatMoney(row.original.minAmount!)}</div>,
  },
  {
    id: 'max',
    header: 'Max Amount',
    cell: ({ row }) => <div>{formatMoney(row.original.maxAmount!)}</div>,
  },
  {
    accessorKey: 'interestRate',
    header: 'Interest Rate',
    cell: ({ row }) => <div>{row.original.interestRate}%</div>,
  },
  {
    id: 'schedule',
    header: 'Repayment (Months)',
    cell: ({ row }) => <div>{row.original.repaymentPeriodMonths}</div>,
  },
  {
    id: 'createdAt',
    header: 'Date',
    cell: ({ row }) => <div>{formatDate(row.original.createdAt)}</div>,
  },
]
