import { usePage } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AppLayoutInertia from '@/layouts/app-layout-inertia'
import { type BreadcrumbItem } from '@/types'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reportes', href: '/admin/reportes' },
]

export default function Reportes() {
    const { auth } = usePage<{ auth: { user: { nombre: string, role: string } } }>().props

    return (
        <AppLayoutInertia 
            title="Reportes - Vital Red" 
            breadcrumbs={breadcrumbs}
            user={auth.user}
        >
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Reportes del Sistema</h1>
                    <p className="text-muted-foreground">Generación y análisis de reportes</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Panel de Reportes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Esta vista está en desarrollo. Aquí se mostrarán los reportes del sistema.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppLayoutInertia>
    )
}