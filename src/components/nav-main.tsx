import { type LucideIcon } from 'lucide-react'

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import type { FileRoutesByTo } from '@/routeTree.gen'
import { Link } from '@tanstack/react-router'

type RoutePath = keyof FileRoutesByTo

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: RoutePath
    icon?: LucideIcon
    isActive?: boolean
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton tooltip={item.title} asChild>
              <Link
                to={item.url}
                activeProps={{
                  className: 'bg-primary text-primary-foreground',
                }}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
