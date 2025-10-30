import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import ErrorBoundary from '@/components/error-boundary';
import { route } from 'ziggy-js';
import { GlobalNavbar } from '@/components/global-navbar';

// Suprimir warning conocido de Inertia Form con atributo inert
const originalError = console.error.bind(console);
console.error = (...args: any[]) => {
    // El mensaje usa placeholders %s, así que verificamos el patrón
    const firstArg = args[0];
    if (firstArg && typeof firstArg === 'string') {
        // Suprimir el warning de inert (con placeholders %s)
        if (firstArg.includes('non-boolean attribute') && firstArg.includes('%s')) {
            // Verificar que sea el warning de inert específicamente
            if (args.includes('inert') || firstArg.includes('inert')) {
                return;
            }
        }
    }
    
    originalError(...args);
};

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Manejador de errores personalizado para errores HTTP
router.on('exception', (event: any) => {
    const error = event.detail.exception;
    
    // Error 429: Too Many Requests (axios error structure)
    if (error?.response?.status === 429) {
        toast.error('Demasiados intentos de inicio de sesión', {
            description: 'Por seguridad, debes esperar unos minutos antes de volver a intentar. Has excedido el límite de intentos permitidos.',
            duration: 6000,
        });
        
        // Prevenir que se muestre el error en consola
        event.preventDefault();
        return false;
    }
});

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        // Hacer la función route disponible globalmente
        (window as any).route = route;
        
        // Renderizar navbar global reactivo que escucha cambios de autenticación
        const navbarEl = document.getElementById('global-navbar');
        if (navbarEl) {
            const navbarRoot = createRoot(navbarEl);
            // Pasar los props iniciales
            const initialUser = (props.initialPage.props as any).auth?.user;
            navbarRoot.render(<GlobalNavbar initialUser={initialUser} />);
        }
        
        const root = createRoot(el);

        root.render(
            <ErrorBoundary>
                <App {...props} />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: 'white',
                            color: 'black',
                            border: '1px solid #e5e7eb',
                            fontSize: '14px',
                        },
                        className: 'toast-custom',
                        descriptionClassName: 'toast-description',
                    }}
                />
            </ErrorBoundary>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
