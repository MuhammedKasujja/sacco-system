import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useLocation,
} from '@tanstack/react-router'
import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { BellDot } from 'lucide-react'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/theme-toggle'
import { getCurrentUserFn } from '@/actions/auth'
import { AuthProvider } from '@/contexts/auth'
import React from 'react'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    const user = await getCurrentUserFn()
    if (!user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
    // Pass user to child routes
    return { user }
  },
})

function RouteComponent() {
  const currentPath = useLocation({ select: (loc) => loc.pathname })
  // console.log(currentPath.trim().split('/'))
  console.log(currentPath.trim())
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                      <Link to={'/'}>Dashboard</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {currentPath.trim().split('/').map((path) => (
                    <React.Fragment key={path}>
                      <BreadcrumbSeparator className="block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="capitalize">
                          {path}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-2 px-4">
              <div className="bg-accent p-1.5 rounded-sm">
                <BellDot className="size-5" />
              </div>
              <ThemeToggle />
              <Link to={'/logout'}>
                <Avatar>
                  <AvatarImage src={'tanstack-circle-logo.png'} />
                </Avatar>
              </Link>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  )
}
