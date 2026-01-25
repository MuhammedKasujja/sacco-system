import { DataTable } from '@/components/data-table-old'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
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
import { MemberDetailsLink } from '@/features/members/components/member-details-link'
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
            <CardAction>
              <Badge>{loan.status}</Badge>
            </CardAction>
          </CardHeader>
          <CardFooter>
            {loan.installmentCount} {loan.installmentType}
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <Button asChild variant={'link'}>
                <MemberDetailsLink
                  className="font-medium"
                  memberId={loan.member.id}
                  maskLabel={`${loan.member.firstName} ${loan.member.lastName}`}
                >
                  {loan.member.firstName} {loan.member.lastName}
                </MemberDetailsLink>
              </Button>
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
      id: 'reapymentDate',
      header: 'Repayment Date',
      cell: ({ row }) => <div>{formatDate(row.original.repaymentDate)}</div>,
    },
    {
      id: 'amount',
      header: 'Amount',
      cell: ({ row }) => <div>{formatMoney(row.original.amount)}</div>,
    },
    {
      id: 'paid',
      header: 'Paid',
      cell: ({ row }) => (
        <div>
          {row.original.totalAmountPaid
            ? formatMoney(row.original.totalAmountPaid)
            : '-'}
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => <Badge variant={'outline'}>{row.original.status}</Badge>,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const repayment = row.original
        if (repayment.balanceAfter !== '0') {
          return (
            <MakeLoanRepayment repayment={repayment} loanNumber={loanNumber} />
          )
        }
      },
    },
  ]
}
