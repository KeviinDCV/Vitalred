import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Perfil',
        href: '/settings/profile',
        icon: null,
    },
    {
        title: 'Contraseña',
        href: '/settings/password',
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6">
            {/* Header con spacing mejorado */}
            <div className="mb-6 sm:mb-8">
                <Heading 
                    title="Configuración" 
                    description="Administra tu perfil y configuración de cuenta" 
                />
            </div>

            {/* Layout Responsivo con Color Layering */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-12">
                {/* Sidebar Navigation - Elevated on Desktop */}
                <aside className="w-full lg:w-52 xl:w-56 flex-shrink-0">
                    <nav className="flex flex-row lg:flex-col 
                        overflow-x-auto lg:overflow-x-visible 
                        -mx-3 sm:-mx-4 px-3 sm:px-4 lg:mx-0 lg:px-0
                        gap-1 lg:space-y-1
                        pb-2 lg:pb-0
                        scrollbar-hide">
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${item.href}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn(
                                    'flex-shrink-0 lg:flex-shrink lg:w-full justify-start',
                                    'transition-all duration-200',
                                    {
                                        'bg-gradient-to-b from-blue-50 to-blue-100/50 text-blue-700 font-medium shadow-[0_1px_3px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.5)] hover:from-blue-100 hover:to-blue-50': 
                                            currentPath === item.href,
                                        'hover:bg-gradient-to-b hover:from-slate-50 hover:to-slate-100/50 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04)]': 
                                            currentPath !== item.href,
                                    }
                                )}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon className="h-4 w-4" />}
                                    <span className="whitespace-nowrap">{item.title}</span>
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                {/* Separator con Gradient */}
                <div className="lg:hidden">
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                </div>

                {/* Main Content con Box System */}
                <div className="flex-1 min-w-0 max-w-full lg:max-w-2xl xl:max-w-3xl">
                    <section className="space-y-8 sm:space-y-10 lg:space-y-12">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
