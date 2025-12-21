import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/loan-products/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/products/"!</div>
}
