import { usePage } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AppLayoutInertia from '@/layouts/app-layout-inertia'
import { type BreadcrumbItem } from '@/types'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Inteligencia Artificial', href: '/admin/ia' },
]

export default function IA() {
    const { auth } = usePage<{ auth: { user: { nombre: string, role: string } } }>().props

    return (
        <AppLayoutInertia 
            title="Inteligencia Artificial - Vital Red" 
            breadcrumbs={breadcrumbs}
            user={auth.user}
        >
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Inteligencia Artificial</h1>
                    <p className="text-muted-foreground">Gestión de herramientas de IA del sistema</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Panel de IA</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Esta vista está en desarrollo. Aquí se mostrarán las herramientas de IA.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppLayoutInertia>
    )
}