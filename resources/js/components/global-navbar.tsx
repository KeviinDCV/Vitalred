import { router } from '@inertiajs/react';
import { AppNavbarFloating } from './app-navbar-floating';
import { useState, useEffect } from 'react';

interface GlobalNavbarProps {
    initialUser?: any;
}

/**
 * Componente Global del Navbar que se monta UNA sola vez
 * y reacciona automáticamente a los cambios de autenticación.
 * 
 * - Se oculta cuando el usuario NO está autenticado
 * - Se muestra cuando el usuario está autenticado
 * - Reactivo a cambios de página de Inertia usando eventos
 */
export function GlobalNavbar({ initialUser }: GlobalNavbarProps) {
    const [user, setUser] = useState<any>(initialUser || null);

    useEffect(() => {
        // Función para actualizar el estado del usuario
        const updateUser = (event?: any) => {
            // Obtener el usuario desde la página actual de Inertia
            // El evento de navigate trae la página en event.detail.page
            let currentUser = null;
            
            if (event?.detail?.page?.props?.auth?.user) {
                currentUser = event.detail.page.props.auth.user;
            } else {
                const page = (router as any).page;
                currentUser = page?.props?.auth?.user;
            }
            
            setUser(currentUser || null);
        };

        // Escuchar solo el evento 'navigate' que trae la página completa
        const navigateListener = router.on('navigate', updateUser);

        // Cleanup
        return () => {
            navigateListener();
        };
    }, []);

    // Si no hay usuario autenticado, no renderizar nada
    if (!user) {
        return null;
    }

    // Renderizar navbar con el rol del usuario
    const userRole = user.role || 'medico';
    
    return <AppNavbarFloating userRole={userRole} />;
}

