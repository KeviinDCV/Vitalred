import { Head } from '@inertiajs/react'
import { AppSidebarInertia } from '@/components/app-sidebar-inertia'
import { type BreadcrumbItem } from '@/types'
import { Breadcrumbs } from '@/components/breadcrumbs'

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
      
      <div className="flex h-screen bg-background">
        <AppSidebarInertia user={user} />
        
        <main className="flex-1 md:ml-[276px] overflow-y-auto">
          <div className="container mx-auto p-6 md:p-8">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="mb-6">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </>
  )
}