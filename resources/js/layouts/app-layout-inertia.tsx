import { Head } from '@inertiajs/react'
import { AppShell } from '@/components/app-shell'
import { AppSidebar } from '@/components/app-sidebar'
import { AppContent } from '@/components/app-content'
import { AppSidebarHeader } from '@/components/app-sidebar-header'
import { type BreadcrumbItem } from '@/types'

interface AppLayoutProps {
  children: React.ReactNode
  title?: string
  breadcrumbs?: BreadcrumbItem[]
  user: {
    name: string
    role: string
  }
}

export default function AppLayoutInertia({ 
  children, 
  title = 'Vital Red', 
  breadcrumbs = [],
  user 
}: AppLayoutProps) {
  return (
    <>
      <Head title={title} />
      
      <AppShell variant="sidebar">
        <AppSidebar />
        <AppContent variant="sidebar" className="overflow-x-hidden">
          <AppSidebarHeader breadcrumbs={breadcrumbs} />
          {children}
        </AppContent>
      </AppShell>
    </>
  )
}