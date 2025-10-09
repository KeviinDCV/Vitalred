import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Users, Shield, FileText, Search, AlertTriangle, Activity, BarChart3, Settings, Brain, Building2, ClipboardList, UserCheck } from 'lucide-react';
import AppLogo from './app-logo';

// Navegación para Administrador
const adminNavItems: NavItem[] = [
    {
        title: 'Tablero',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Gestión de Usuarios',
        href: '/admin/usuarios',
        icon: Users,
    },
    {
        title: 'Panel de Supervisión',
        href: '/admin/supervision',
        icon: Shield,
    },
    {
        title: 'Referencias',
        href: '/admin/referencias',
        icon: FileText,
    },
    {
        title: 'Reportes',
        href: '/admin/reportes',
        icon: BarChart3,
    },
    {
        title: 'Monitoreo',
        href: '/admin/monitoreo',
        icon: Activity,
    },
    {
        title: 'Inteligencia Artificial',
        href: '/admin/ia',
        icon: Brain,
    },
    {
        title: 'Configuración',
        href: '/admin/configuracion',
        icon: Settings,
    },
];

// Navegación para Médico
const medicoNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/medico/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Ingresar Registro',
        href: '/medico/ingresar-registro',
        icon: FileText,
    },
    {
        title: 'Consulta Pacientes',
        href: '/medico/consulta-pacientes',
        icon: Search,
    },
    {
        title: 'Casos Críticos',
        href: '/medico/casos-criticos',
        icon: AlertTriangle,
    },
    {
        title: 'Seguimiento',
        href: '/medico/seguimiento',
        icon: UserCheck,
    },
];

// Navegación para IPS
const ipsNavItems: NavItem[] = [
    {
        title: 'Dashboard IPS',
        href: '/ips/dashboard',
        icon: Building2,
    },
    {
        title: 'Solicitudes',
        href: '/ips/solicitudes',
        icon: ClipboardList,
    },
    {
        title: 'Seguimiento',
        href: '/ips/seguimiento',
        icon: Activity,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    // Determinar qué navegación mostrar según el rol
    const navItems = user.role === 'administrador' 
        ? adminNavItems 
        : user.role === 'ips' 
        ? ipsNavItems 
        : medicoNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
