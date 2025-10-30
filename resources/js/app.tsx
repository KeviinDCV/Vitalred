import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from '@/components/ui/sonner';
import ErrorBoundary from '@/components/error-boundary';
import { route } from 'ziggy-js';
import { GlobalNavbar } from '@/components/global-navbar';
import { GlobalErrorHandler } from '@/components/global-error-handler';
import { setupAxiosInterceptors } from '@/lib/axios-config';

// Suprimir warnings y errores conocidos
const originalError = console.error.bind(console);
console.error = (...args: any[]) => {
    const firstArg = args[0];

    // Suprimir el warning de inert de Inertia Form (con placeholders %s)
    if (firstArg && typeof firstArg === 'string') {
        if (firstArg.includes('non-boolean attribute') && firstArg.includes('%s')) {
            // Verificar que sea el warning de inert específicamente
            if (args.includes('inert') || firstArg.includes('inert')) {
                return;
            }
        }

        // Suprimir errores HTTP que manejamos con modales
        if (firstArg.includes('Too Many Requests') ||
            firstArg.includes('429') ||
            firstArg.includes('Forbidden') ||
            firstArg.includes('403') ||
            firstArg.includes('500')) {
            return;
        }

        // Suprimir error de Inertia cuando intenta ocultar progress indicator
        if (firstArg.includes("Cannot set properties of null (setting 'outerHTML')") ||
            firstArg.includes("Cannot read properties of null")) {
            return;
        }
    }

    // Suprimir errores marcados como silenciosos
    if (firstArg instanceof Error && (firstArg as any).__silent__) {
        return;
    }

    // Suprimir errores de axios con respuestas específicas
    if (firstArg?.response?.status === 429 ||
        firstArg?.response?.status === 403 ||
        firstArg?.response?.status === 500) {
        return;
    }

    originalError(...args);
};

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Configurar interceptores de axios antes de inicializar Inertia
setupAxiosInterceptors();

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
                <GlobalErrorHandler />
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
