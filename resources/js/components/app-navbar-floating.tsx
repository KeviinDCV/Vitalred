import { Link, usePage } from '@inertiajs/react';
import { FileText, Search, LayoutGrid, Users, Settings } from 'lucide-react';
import { type NavItem, type SharedData } from '@/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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

// Navegación para Administrador (acceso completo)
const adminNavItems: NavItem[] = [
    {
        title: 'Tablero',
        href: '/dashboard',
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
        title: 'Usuarios',
        href: '/admin/usuarios',
        icon: Users,
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
                FLOATING NAVBAR - Professional Design with Expanding Active Item
                
                Design Principles Applied:
                - Two-Layer Shadows: Light top + dark bottom for realism
                - Gradient Enhancement: Subtle gradient + inner light shadow
                - Light from Above: Inset light on top simulates natural lighting
                - Layout Animations: Auto-rearrange items when active item expands
                - Responsive: Adapts spacing and size
            */}
            <motion.div 
                className="
                    flex items-center gap-1 sm:gap-2
                    px-3 sm:px-4 py-2 sm:py-3
                    bg-gradient-to-b from-white to-slate-50/30
                    rounded-full
                    shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_20px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)]
                    border border-slate-200/60
                    backdrop-blur-sm"
                layout="position"
            >
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentUrl.startsWith(item.href);
                    
                    if (!Icon) return null;
                    
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                        >
                            <motion.div
                                className={cn(
                                    "relative flex items-center gap-2 rounded-full group",
                                    isActive ? "px-3 sm:px-4" : "px-0"
                                )}
                                layout
                                initial={false}
                                transition={{
                                    layout: {
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 30,
                                    }
                                }}
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
                                
                                {/* Icon Container */}
                                <motion.div
                                    className={cn(
                                        "relative z-10 flex items-center justify-center rounded-full",
                                        "w-10 h-10 sm:w-12 sm:h-12"
                                    )}
                                    whileHover={{ scale: 1.05 }}
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
                                
                                {/* Expandable Text Label - Only shows when active */}
                                <AnimatePresence mode="wait">
                                    {isActive && (
                                        <motion.span
                                            className="relative z-10 text-white font-medium text-sm sm:text-base whitespace-nowrap pr-1"
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ 
                                                opacity: 1, 
                                                width: "auto",
                                                transition: {
                                                    width: {
                                                        type: "spring",
                                                        stiffness: 400,
                                                        damping: 30,
                                                    },
                                                    opacity: {
                                                        duration: 0.2,
                                                        delay: 0.1,
                                                    }
                                                }
                                            }}
                                            exit={{ 
                                                opacity: 0, 
                                                width: 0,
                                                transition: {
                                                    width: {
                                                        type: "spring",
                                                        stiffness: 400,
                                                        damping: 30,
                                                    },
                                                    opacity: {
                                                        duration: 0.15,
                                                    }
                                                }
                                            }}
                                        >
                                            {item.title}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {/* Tooltip - Only shows on hover for inactive items */}
                                {!isActive && (
                                    <motion.span 
                                        className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded-md pointer-events-none whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    >
                                        {item.title}
                                    </motion.span>
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </motion.div>
        </nav>
    );
}
