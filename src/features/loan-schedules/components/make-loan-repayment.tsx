import { LoanRepaymentEntitty } from '@/features/loans/queries'
import { Button } from '@/components/ui/button'
import { CreditCardIcon } from 'lucide-react'
import { EditLoanRepaymentTransactionSchema } from '@/features/transactions/schemas'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { toast } from 'sonner'
import { makeLoanRepaymentTransactionFn } from '@/features/transactions/actions/loans'
import {
  HiddenField,
  NumberField,
  TextField,
} from '@/components/ui/form-fields'
import { FieldGroup } from '@/components/ui/field'
import { useEffect, useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type MakeLoanRepaymentProps = {
  repayment: LoanRepaymentEntitty
  loanNumber: string
}

export function MakeLoanRepayment({
  repayment,
  loanNumber,
}: MakeLoanRepaymentProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof EditLoanRepaymentTransactionSchema>>({
    resolver: zodResolver(EditLoanRepaymentTransactionSchema),
    defaultValues: {
      amount: Number(repayment.balanceAfter),
      loanId: repayment.loanId,
      scheduleId: repayment.id,
    },
  })

  const amount = form.watch('amount')

  useEffect(() => {
    if (amount > Number(repayment.balanceAfter)) {
      form.setError('amount', {
        type: 'max',
        message: `Amount should not exceed balance of ${repayment.balanceAfter}`,
      })
    } else {
      form.clearErrors('amount')
    }
  }, [amount])

  async function onSubmit(
    data: z.infer<typeof EditLoanRepaymentTransactionSchema>,
  ) {
    try {
      await makeLoanRepaymentTransactionFn({ data })
      toast.message('Payment created successfully')
      setOpen(false)
      form.reset()
      router.invalidate()
    } catch (error) {
      toast.error(`${error}`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'outline'} size={'sm'}>
          <CreditCardIcon data-icon="inline-start" />
          Pay
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Make Payment - {loanNumber}</DialogTitle>
          <DialogDescription className="w-full" asChild>
            <form
              id="form-edit-repayment"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup className="space-y-2">
                <HiddenField control={form.control} name={'id'} />
                <NumberField
                  label="Amount"
                  control={form.control}
                  name={'amount'}
                />
                <TextField
                  label="Paid By"
                  control={form.control}
                  name={'payeeName'}
                />
                <TextField
                  label="Payer Telephone"
                  control={form.control}
                  required={false}
                  name={'payeeTelephone'}
                />
              </FieldGroup>
            </form>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'}>Cancel</Button>
          </DialogClose>
          <Button type="submit" form="form-edit-repayment">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  //   return (
  //     <Drawer direction={isMobile ? "bottom" : "right"}>
  //       <DrawerTrigger asChild>
  //         <Button variant="link" className="text-foreground w-fit px-0 text-left">
  //           {item.header}
  //         </Button>
  //       </DrawerTrigger>
  //       <DrawerContent>
  //         <DrawerHeader className="gap-1">
  //           <DrawerTitle>{item.header}</DrawerTitle>
  //           <DrawerDescription>
  //             Showing total visitors for the last 6 months
  //           </DrawerDescription>
  //         </DrawerHeader>
  //         <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
  //           {!isMobile && (
  //             <>
  //               <ChartContainer config={chartConfig}>
  //                 <AreaChart
  //                   accessibilityLayer
  //                   data={chartData}
  //                   margin={{
  //                     left: 0,
  //                     right: 10,
  //                   }}
  //                 >
  //                   <CartesianGrid vertical={false} />
  //                   <XAxis
  //                     dataKey="month"
  //                     tickLine={false}
  //                     axisLine={false}
  //                     tickMargin={8}
  //                     tickFormatter={(value) => value.slice(0, 3)}
  //                     hide
  //                   />
  //                   <ChartTooltip
  //                     cursor={false}
  //                     content={<ChartTooltipContent indicator="dot" />}
  //                   />
  //                   <Area
  //                     dataKey="mobile"
  //                     type="natural"
  //                     fill="var(--color-mobile)"
  //                     fillOpacity={0.6}
  //                     stroke="var(--color-mobile)"
  //                     stackId="a"
  //                   />
  //                   <Area
  //                     dataKey="desktop"
  //                     type="natural"
  //                     fill="var(--color-desktop)"
  //                     fillOpacity={0.4}
  //                     stroke="var(--color-desktop)"
  //                     stackId="a"
  //                   />
  //                 </AreaChart>
  //               </ChartContainer>
  //               <Separator />
  //               <div className="grid gap-2">
  //                 <div className="flex gap-2 leading-none font-medium">
  //                   Trending up by 5.2% this month{" "}
  //                   <IconTrendingUp className="size-4" />
  //                 </div>
  //                 <div className="text-muted-foreground">
  //                   Showing total visitors for the last 6 months. This is just
  //                   some random text to test the layout. It spans multiple lines
  //                   and should wrap around.
  //                 </div>
  //               </div>
  //               <Separator />
  //             </>
  //           )}
  //           <form className="flex flex-col gap-4">
  //             <div className="flex flex-col gap-3">
  //               <Label htmlFor="header">Header</Label>
  //               <Input id="header" defaultValue={item.header} />
  //             </div>
  //             <div className="grid grid-cols-2 gap-4">
  //               <div className="flex flex-col gap-3">
  //                 <Label htmlFor="type">Type</Label>
  //                 <Select defaultValue={item.type}>
  //                   <SelectTrigger id="type" className="w-full">
  //                     <SelectValue placeholder="Select a type" />
  //                   </SelectTrigger>
  //                   <SelectContent>
  //                     <SelectItem value="Table of Contents">
  //                       Table of Contents
  //                     </SelectItem>
  //                     <SelectItem value="Executive Summary">
  //                       Executive Summary
  //                     </SelectItem>
  //                     <SelectItem value="Technical Approach">
  //                       Technical Approach
  //                     </SelectItem>
  //                     <SelectItem value="Design">Design</SelectItem>
  //                     <SelectItem value="Capabilities">Capabilities</SelectItem>
  //                     <SelectItem value="Focus Documents">
  //                       Focus Documents
  //                     </SelectItem>
  //                     <SelectItem value="Narrative">Narrative</SelectItem>
  //                     <SelectItem value="Cover Page">Cover Page</SelectItem>
  //                   </SelectContent>
  //                 </Select>
  //               </div>
  //               <div className="flex flex-col gap-3">
  //                 <Label htmlFor="status">Status</Label>
  //                 <Select defaultValue={item.status}>
  //                   <SelectTrigger id="status" className="w-full">
  //                     <SelectValue placeholder="Select a status" />
  //                   </SelectTrigger>
  //                   <SelectContent>
  //                     <SelectItem value="Done">Done</SelectItem>
  //                     <SelectItem value="In Progress">In Progress</SelectItem>
  //                     <SelectItem value="Not Started">Not Started</SelectItem>
  //                   </SelectContent>
  //                 </Select>
  //               </div>
  //             </div>
  //             <div className="grid grid-cols-2 gap-4">
  //               <div className="flex flex-col gap-3">
  //                 <Label htmlFor="target">Target</Label>
  //                 <Input id="target" defaultValue={item.target} />
  //               </div>
  //               <div className="flex flex-col gap-3">
  //                 <Label htmlFor="limit">Limit</Label>
  //                 <Input id="limit" defaultValue={item.limit} />
  //               </div>
  //             </div>
  //             <div className="flex flex-col gap-3">
  //               <Label htmlFor="reviewer">Reviewer</Label>
  //               <Select defaultValue={item.reviewer}>
  //                 <SelectTrigger id="reviewer" className="w-full">
  //                   <SelectValue placeholder="Select a reviewer" />
  //                 </SelectTrigger>
  //                 <SelectContent>
  //                   <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
  //                   <SelectItem value="Jamik Tashpulatov">
  //                     Jamik Tashpulatov
  //                   </SelectItem>
  //                   <SelectItem value="Emily Whalen">Emily Whalen</SelectItem>
  //                 </SelectContent>
  //               </Select>
  //             </div>
  //           </form>
  //         </div>
  //         <DrawerFooter>
  //           <Button>Submit</Button>
  //           <DrawerClose asChild>
  //             <Button variant="outline">Done</Button>
  //           </DrawerClose>
  //         </DrawerFooter>
  //       </DrawerContent>
  //     </Drawer>
  //   );
}
