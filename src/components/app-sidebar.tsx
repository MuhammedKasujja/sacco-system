import * as React from 'react'
import {
  AudioWaveform,
  BookOpen,
  Bot,
  CreditCard,
  Users2,
  GalleryVerticalEnd,
  Settings,
  LayoutDashboard,
  Building2,
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
  app: {
    name: 'Sacco',
    logo: Building2,
  },
  navMain: [
    {
      title: 'Dashboard',
      url: DashboardRoute.to,
      icon: LayoutDashboard,
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
      icon: CreditCard,
    },
    {
      title: 'Loan Products',
      url: LoanProductsRoute.to,
      icon: BookOpen,
    },
    {
      title: 'Users',
      url: UsersRoute.to,
      icon: Users2,
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
    icon: Settings,
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-mutted text-mutted-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <data.app.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{data.app.name}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={data.settings.title} asChild>
              <Link
                to={data.settings.url}
                activeProps={{
                  className:
                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                }}
              >
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
