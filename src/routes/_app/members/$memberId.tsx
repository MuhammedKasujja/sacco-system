import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/members/$memberId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/members/$memberId"!</div>
}
