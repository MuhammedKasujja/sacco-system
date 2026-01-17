import { DataTable } from '@/components/data-table-old'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { MakeLoanRepayment } from '@/features/loan-schedules/components/make-loan-repayment'
import {
  getLoanDetailsFn,
  LoanRepaymentEntitty,
} from '@/features/loans/queries'
import { formatDate, formatMoney } from '@/lib/formatting'
import { createFileRoute } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'

export const Route = createFileRoute('/_app/loans/$loanId')({
  component: RouteComponent,
  loader: ({ params }) =>
    getLoanDetailsFn({
      data: { loanId: params.loanId },
    }),
})

function RouteComponent() {
  const loan = Route.useLoaderData()
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>{loan.number}</CardTitle>
            <CardDescription>
              {formatMoney(loan.principalAmount)}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            {loan.installmentCount} {loan.installmentType}
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              {loan.member.firstName} {loan.member.lastName}
            </CardTitle>
            <CardDescription>{loan.member.phone}</CardDescription>
          </CardHeader>
        </Card>
      </div>
      <DataTable
        showPagination={false}
        data={loan.repayments}
        columns={getLoanRemaymentColumns({ loanNumber: loan.number! })}
      />
    </div>
  )
}

function getLoanRemaymentColumns({
  loanNumber,
}: {
  loanNumber: string
}): ColumnDef<LoanRepaymentEntitty>[] {
  return [
    {
      id: 'aamount',
      header: 'Amount',
      cell: ({ row }) => <div>{formatMoney(row.original.amountPaid)}</div>,
    },
    {
      id: 'interestRate',
      header: 'Interest Rate',
      cell: ({ row }) => <div>{row.original.interestPaid}%</div>,
    },
    {
      id: 'createdAt',
      header: 'Repayment Date',
      cell: ({ row }) => <div>{formatDate(row.original.repaymentDate)}</div>,
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => <div>{row.original.status}</div>,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const repayment = row.original
        return (
          <MakeLoanRepayment repayment={repayment} loanNumber={loanNumber} />
        )
      },
    },
  ]
}
