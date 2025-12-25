import { type LucideIcon } from 'lucide-react'

import {
  SidebarGroup,
  SidebarGroupLabel,
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
      <SidebarGroupLabel>Sacco System</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={item.title} asChild>
              <Link to={item.url}>
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
