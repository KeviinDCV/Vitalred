import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface NavMainProps {
    items: NavItem[];
    showSeparators?: boolean;
}

export function NavMain({ items = [], showSeparators = false }: NavMainProps) {
    const page = usePage();
    
    // Función para detectar cambios de sección basado en comentarios en el array
    const needsSeparatorBefore = (index: number): boolean => {
        if (!showSeparators || index === 0) return false;
        const currentHref = items[index].href;
        const prevHref = items[index - 1].href;
        
        // Detectar cambio de sección por prefijo de ruta
        const currentSection = currentHref.split('/')[2] || currentHref.split('/')[1];
        const prevSection = prevHref.split('/')[2] || prevHref.split('/')[1];
        
        return currentSection !== prevSection;
    };
    
    return (
        <SidebarGroup className="px-0 py-0">
            <SidebarMenu className="gap-0.5">
                {items.map((item, index) => {
                    const isActive = page.url.startsWith(item.href);
                    const showSeparator = needsSeparatorBefore(index);
                    
                    return (
                        <div key={item.title}>
                            {showSeparator && <SidebarSeparator className="my-2" />}
                            <SidebarMenuItem>
                                <SidebarMenuButton 
                                    asChild 
                                    isActive={isActive}
                                    className="px-3 py-2.5 rounded-lg transition-all duration-200"
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon className="h-5 w-5" />}
                                        <span className="font-medium">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </div>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
