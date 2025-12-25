import * as React from 'react'
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Frame,
  GalleryVerticalEnd,
  Settings2,
  PersonStanding,
  SquareTerminal,
} from 'lucide-react'
import { Route as DashboardRoute } from '@/routes/_app'
import { Route as AccountsRoute } from '@/routes/_app/accounts'
import { Route as MembersRoute } from '@/routes/_app/members'
import { Route as LoansRoute } from '@/routes/_app/loans'
import { Route as TransactionsRoute } from '@/routes/_app/transactions'
import { Route as LoanProductsRoute } from '@/routes/_app/loan-products'
import { Route as UsersRoute } from '@/routes/_app/users'
import { Route as ReportsRoute } from '@/routes/_app/reports'
import { Route as SettingsRoute } from '@/routes/_app/settings'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavMain } from './nav-main'
import { Link } from '@tanstack/react-router'

// This is sample data.
const data = {
  user: {
    name: 'kasujja musa',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: DashboardRoute.to,
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: 'Accounts',
      url: AccountsRoute.to,
      icon: GalleryVerticalEnd,
    },
    {
      title: 'Members',
      url: MembersRoute.to,
      icon: Bot,
    },
    {
      title: 'Loans',
      url: LoansRoute.to,
      icon: BookOpen,
    },
    {
      title: 'Transactions',
      url: TransactionsRoute.to,
      icon: Frame,
    },
    {
      title: 'Loan Products',
      url: LoanProductsRoute.to,
      icon: BookOpen,
    },
    {
      title: 'Users',
      url: UsersRoute.to,
      icon: PersonStanding,
    },
    {
      title: 'Reports',
      url: ReportsRoute.to,
      icon: AudioWaveform,
    },
  ],
  settings: {
    title: 'Settings',
    url: SettingsRoute.to,
    icon: Settings2,
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={data.settings.title} asChild>
              <Link to={data.settings.url}>
                <data.settings.icon />
                <span>{data.settings.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
