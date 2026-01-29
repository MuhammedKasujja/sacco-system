import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { createFileRoute } from '@tanstack/react-router'
import { InfoIcon } from 'lucide-react'

export const Route = createFileRoute('/_app/settings/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant={'icon'}>
          <InfoIcon/>
        </EmptyMedia>
        <EmptyTitle>Coming Soon.....</EmptyTitle>
      </EmptyHeader>
    </Empty>
  )
}
