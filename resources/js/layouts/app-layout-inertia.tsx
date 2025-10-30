import { Head } from '@inertiajs/react'
import { AppHeaderFloating } from '@/components/app-header-floating'
import { type BreadcrumbItem } from '@/types'
import { useNotifications } from '@/hooks/useNotifications'

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
  title = 'HERMES', 
  breadcrumbs = [],
  user 
}: AppLayoutProps) {
  // 🔔 Notificaciones en tiempo real para IPS (funciona en TODAS las páginas)
  useNotifications({
    enabled: user.role === 'ips',
    interval: 10000, // Verificar cada 10 segundos
    rolePrefix: 'ips'
  });

  return (
    <>
      <Head title={title} />

      <div className="relative min-h-screen bg-slate-50">
        <AppHeaderFloating />

        {/* Background overlay to cover any residual content from previous pages */}
        <div className="fixed inset-0 bg-slate-50 -z-10" />

        {/* Main Content - Responsive padding matches navbar height (Principle 1 & 2) */}
        {/* Mobile: pt-20 (h-14 + spacing), Desktop: pt-24 (h-16 + spacing) */}
        <main className="relative container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-20 sm:pt-24 pb-6">
          {children}
        </main>
      </div>
    </>
  )
}