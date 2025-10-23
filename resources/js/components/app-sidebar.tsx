import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Users, Shield, FileText, Search, Activity, BarChart3, Settings, Brain, Building2, ClipboardList, UserCheck, Stethoscope, AlertCircle } from 'lucide-react';
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
    // Sección Médico
    {
        title: 'Ingresar Registro',
        href: '/admin/medico/ingresar-registro',
        icon: FileText,
    },
    {
        title: 'Consulta Pacientes',
        href: '/admin/medico/consulta-pacientes',
        icon: Search,
    },
    // Sección IPS
    {
        title: 'Ingresar Registro IPS',
        href: '/admin/ips/ingresar-registro',
        icon: FileText,
    },
    {
        title: 'Consulta Pacientes IPS',
        href: '/admin/ips/consulta-pacientes',
        icon: Search,
    },
];

// Navegación para Médico (rutas completas)
const medicoNavItems: NavItem[] = [
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
];

// Navegación para IPS
const ipsNavItems: NavItem[] = [
    {
        title: 'Ingresar Registro',
        href: '/ips/ingresar-registro',
        icon: FileText,
    },
    {
        title: 'Consulta Pacientes',
        href: '/ips/consulta-pacientes',
        icon: Search,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    // Determinar qué navegación mostrar según el rol
    const navItems = user.role === 'administrador' ? adminNavItems : user.role === 'medico' ? medicoNavItems : ipsNavItems;
    
    // Determinar el label del rol
    const roleLabel = user.role === 'administrador' ? 'Administrador' : user.role === 'medico' ? 'Médico' : 'IPS';
    const roleBadgeVariant = user.role === 'administrador' ? 'default' : 'secondary';

    return (
        <Sidebar collapsible="offcanvas" variant="sidebar">
            <SidebarHeader className="border-b border-sidebar-border py-4 px-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-sidebar-accent/50">
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-3 py-4">
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter className="mt-auto border-t border-sidebar-border p-4">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
