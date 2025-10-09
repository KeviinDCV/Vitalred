import { usePage } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AppLayoutInertia from '@/layouts/app-layout-inertia'
import { type BreadcrumbItem } from '@/types'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Supervisión', href: '/admin/supervision' },
]

export default function Supervision() {
    const { auth } = usePage<{ auth: { user: { nombre: string, role: string } } }>().props

    return (
        <AppLayoutInertia 
            title="Supervisión - Vital Red" 
            breadcrumbs={breadcrumbs}
            user={auth.user}
        >
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Supervisión del Sistema</h1>
                    <p className="text-muted-foreground">Monitoreo y supervisión de actividades</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Panel de Supervisión</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Esta vista está en desarrollo. Aquí se mostrará el panel de supervisión del sistema.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppLayoutInertia>
    )
}