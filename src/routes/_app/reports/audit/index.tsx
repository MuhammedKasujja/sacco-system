import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  getSystemAuditLogsFn,
  getAuthLogsFn,
} from '@/features/audit-logs/queries'
import { AuthAuditLogsTable } from '@/features/reports/components/auth-audit-logs-table'
import { GeneralAuditLogsTable } from '@/features/reports/components/general-audit-logs-table'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/reports/audit/')({
  component: RouteComponent,
  loader: async () => ({
    systemLogs: await getSystemAuditLogsFn(),
    authLogs: await getAuthLogsFn(),
  }),
})

function RouteComponent() {
  const { systemLogs, authLogs } = Route.useLoaderData()

  return (
    <Tabs defaultValue="general">
      <TabsList>
        <TabsTrigger value="general">Activity Logs</TabsTrigger>
        <TabsTrigger value="auth">Auth Logs</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <GeneralAuditLogsTable auditLogs={systemLogs} />
      </TabsContent>
      <TabsContent value="auth">
        <AuthAuditLogsTable authLogs={authLogs} />
      </TabsContent>
    </Tabs>
  )
}
