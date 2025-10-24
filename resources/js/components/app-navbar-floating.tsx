import { Link, usePage } from '@inertiajs/react';
import { FileText, Search, LayoutGrid, Users, Shield, BarChart3, Activity, Brain, Settings } from 'lucide-react';
import { type NavItem, type SharedData } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Navegación para Médico
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

// Navegación para Administrador
const adminNavItems: NavItem[] = [
    {
        title: 'Tablero',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Usuarios',
        href: '/admin/usuarios',
        icon: Users,
    },
    {
        title: 'Supervisión',
        href: '/admin/supervision',
        icon: Shield,
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
        title: 'IA',
        href: '/admin/ia',
        icon: Brain,
    },
    {
        title: 'Configuración',
        href: '/admin/configuracion',
        icon: Settings,
    },
];

export function AppNavbarFloating() {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const currentUrl = page.url;
    const user = auth.user;

    // Determinar qué navegación mostrar según el rol
    const navItems = 
        user.role === 'administrador' 
            ? adminNavItems 
            : user.role === 'medico' 
            ? medicoNavItems 
            : ipsNavItems;

    return (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
            {/* 
                FLOATING NAVBAR - Professional Design
                
                Design Principles Applied:
                - Two-Layer Shadows: Light top + dark bottom for realism
                - Gradient Enhancement: Subtle gradient + inner light shadow
                - Light from Above: Inset light on top simulates natural lighting
                - Responsive: Adapts spacing and size
            */}
            <div className="
                flex items-center gap-1 sm:gap-2
                px-3 sm:px-4 py-2 sm:py-3
                bg-gradient-to-b from-white to-slate-50/30
                rounded-full
                shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_20px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)]
                border border-slate-200/60
                backdrop-blur-sm
                transition-all duration-200">
                
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentUrl.startsWith(item.href);
                    
                    if (!Icon) return null;
                    
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full group"
                        >
                            {/* Animated Background - Only shows for active state */}
                            {isActive && (
                                <motion.div
                                    layoutId="navbar-active-pill"
                                    className="absolute inset-0 bg-gradient-to-b from-[#042077] to-[#031852] rounded-full shadow-[0_2px_4px_rgba(4,32,119,0.3),0_4px_12px_rgba(4,32,119,0.2),inset_0_1px_0_rgba(255,255,255,0.2)]"
                                    transition={{
                                        type: "spring",
                                        stiffness: 350,
                                        damping: 30,
                                    }}
                                />
                            )}
                            
                            {/* Hover Effect - Only shows for inactive state */}
                            {!isActive && (
                                <motion.div
                                    className="absolute inset-0 bg-slate-100/80 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.8)]"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileHover={{ 
                                        opacity: 1, 
                                        scale: 1,
                                        transition: { 
                                            type: "spring", 
                                            stiffness: 400, 
                                            damping: 20 
                                        }
                                    }}
                                />
                            )}
                            
                            {/* Icon */}
                            <motion.div
                                className="relative z-10"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <Icon 
                                    className={cn(
                                        "w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200",
                                        isActive && "text-white",
                                        !isActive && "text-slate-600 group-hover:text-slate-900"
                                    )}
                                />
                            </motion.div>
                            
                            {/* Tooltip with smooth fade */}
                            <motion.span 
                                className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded-md pointer-events-none whitespace-nowrap shadow-lg"
                                initial={{ opacity: 0, y: -5 }}
                                whileHover={{ 
                                    opacity: 1, 
                                    y: 0,
                                    transition: { 
                                        duration: 0.2,
                                        ease: "easeOut"
                                    }
                                }}
                            >
                                {item.title}
                            </motion.span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
