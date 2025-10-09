import { usePage } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AppLayoutInertia from '@/layouts/app-layout-inertia'
import { type BreadcrumbItem } from '@/types'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Monitoreo', href: '/admin/monitoreo' },
]

export default function Monitoreo() {
    const { auth } = usePage<{ auth: { user: { nombre: string, role: string } } }>().props

    return (
        <AppLayoutInertia 
            title="Monitoreo - Vital Red" 
            breadcrumbs={breadcrumbs}
            user={auth.user}
        >
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Monitoreo del Sistema</h1>
                    <p className="text-muted-foreground">Monitoreo en tiempo real del sistema</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Panel de Monitoreo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Esta vista está en desarrollo. Aquí se mostrará el monitoreo del sistema.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppLayoutInertia>
    )
}