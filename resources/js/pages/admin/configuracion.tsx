import { usePage } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AppLayoutInertia from '@/layouts/app-layout-inertia'
import { type BreadcrumbItem } from '@/types'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Configuración', href: '/admin/configuracion' },
]

export default function Configuracion() {
    const { auth } = usePage<{ auth: { user: { nombre: string, role: string } } }>().props

    return (
        <AppLayoutInertia 
            title="Configuración - Vital Red" 
            breadcrumbs={breadcrumbs}
            user={auth.user}
        >
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Configuración del Sistema</h1>
                    <p className="text-muted-foreground">Configuración general del sistema</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Panel de Configuración</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Esta vista está en desarrollo. Aquí se mostrará la configuración del sistema.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppLayoutInertia>
    )
}