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

      <div className="relative min-h-screen min-h-[100dvh] bg-slate-50">
        <AppHeaderFloating />

        {/* Background overlay */}
        <div className="fixed inset-0 bg-slate-50 -z-10" />

        {/* Main Content - Progressive spacing (matches app-layout.tsx) */}
        <main className="
          relative 
          container mx-auto 
          px-3 sm:px-4 md:px-6 lg:px-8 
          pt-[72px] sm:pt-[80px] md:pt-[88px]
          pb-4 sm:pb-6 md:pb-8
        ">
          {children}
        </main>
      </div>
    </>
  )
}