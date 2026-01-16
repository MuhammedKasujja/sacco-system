import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/reports/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Button asChild>
      <Link to={'/reports/audit'}>View Audit Logs</Link>
    </Button>
  )
}
