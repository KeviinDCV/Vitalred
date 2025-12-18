import { Link, router } from '@inertiajs/react';
import { FileText, Search, LayoutGrid, Users, Settings } from 'lucide-react';
import { type NavItem } from '@/types';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

/*
  RESPONSIVE DESIGN PRINCIPLES:
  
  Principle 1 - Box System:
  - Navbar container: Pill-shaped box with consistent internal spacing
  - Each nav item: Box with icon + optional text label
  - Clear relationships: gap-0.5 (xs) → gap-1 (sm) → gap-2 (md+)
  
  Principle 2 - Rearrange with Purpose:
  - Mobile (<640px): Compact icons only, no expanded text (saves ~150px width)
  - Tablet (640-1023px): Expanded active item with text
  - Desktop (≥1024px): Full experience with generous spacing
  
  Breakpoints:
  - xs (<640px): Compact mode - icons only, smaller touch targets
  - sm (640px+): Standard mode - expanded active with text
  - md (768px+): More padding, larger icons
*/

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

interface AppNavbarFloatingProps {
    userRole: 'administrador' | 'medico' | 'ips';
}

export function AppNavbarFloating({ userRole }: AppNavbarFloatingProps) {
    const [currentUrl, setCurrentUrl] = useState(window.location.pathname);
    
    useEffect(() => {
        const handleNavigate = () => {
            setCurrentUrl(window.location.pathname);
        };
        
        router.on('navigate', handleNavigate);
    }, []);
    
    const navItems = 
        userRole === 'administrador' 
            ? adminNavItems 
            : userRole === 'medico' 
            ? medicoNavItems 
            : ipsNavItems;

    return (
        <div className="fixed top-0 left-0 right-0 z-[60] pointer-events-none">
            {/* Centered container with responsive top padding */}
            <div className="flex justify-center pt-3 sm:pt-4 pointer-events-none">
                <nav className="pointer-events-auto">
                    {/* 
                        NAVBAR CONTAINER - Progressive spacing
                        Mobile: Compact (gap-0.5, px-2, py-1.5)
                        Tablet: Standard (gap-1, px-3, py-2)
                        Desktop: Generous (gap-2, px-4, py-3)
                    */}
                    <div className="
                        flex items-center 
                        gap-0.5 sm:gap-1 md:gap-2
                        px-2 sm:px-3 md:px-4 
                        py-1.5 sm:py-2 md:py-3
                        bg-gradient-to-b from-white to-slate-50/30
                        rounded-full
                        shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_20px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)]
                        border border-slate-200/60
                        backdrop-blur-sm
                    ">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentUrl.startsWith(item.href);
                            
                            if (!Icon) return null;
                            
                            return (
                                <Link key={item.href} href={item.href}>
                                    <div
                                        className={cn(
                                            "group relative flex items-center justify-center rounded-full transition-all duration-200",
                                            // Mobile: No extra padding (icons only)
                                            // Tablet+: Add padding for text when active
                                            isActive ? "sm:px-3 md:px-4" : "px-0"
                                        )}
                                    >
                                        {/* Active Background */}
                                        {isActive && (
                                            <div className="absolute inset-0 bg-gradient-to-b from-[#042077] to-[#031852] rounded-full shadow-[0_2px_4px_rgba(4,32,119,0.3),0_4px_12px_rgba(4,32,119,0.2),inset_0_1px_0_rgba(255,255,255,0.2)]" />
                                        )}
                                        
                                        {/* Hover Effect (inactive only) */}
                                        {!isActive && (
                                            <div className="absolute inset-0 bg-slate-100/80 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.8)] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                        )}
                                        
                                        {/* Icon Container - Responsive sizing */}
                                        <div className={cn(
                                            "relative z-10 flex items-center justify-center rounded-full",
                                            // Progressive icon container size
                                            "w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12"
                                        )}>
                                            <Icon className={cn(
                                                // Progressive icon size
                                                "w-[18px] h-[18px] sm:w-5 sm:h-5 md:w-6 md:h-6 transition-colors duration-200",
                                                isActive && "text-white",
                                                !isActive && "text-slate-600 group-hover:text-slate-900"
                                            )} />
                                        </div>
                                        
                                        {/* Text Label - Hidden on mobile, shown on tablet+ when active */}
                                        {isActive && (
                                            <span className="hidden sm:inline relative z-10 text-white font-medium text-sm md:text-base whitespace-nowrap pr-1">
                                                {item.title}
                                            </span>
                                        )}

                                        {/* Tooltip - Shows on hover for inactive items */}
                                        {!isActive && (
                                            <span className="
                                                absolute -bottom-9 sm:-bottom-10 left-1/2 -translate-x-1/2 
                                                px-2 py-1 
                                                bg-slate-900 text-white 
                                                text-[10px] sm:text-xs 
                                                rounded-md 
                                                pointer-events-none whitespace-nowrap shadow-lg 
                                                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                            ">
                                                {item.title}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </div>
    );
}
