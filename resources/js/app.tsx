import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from '@/components/ui/sonner';
import ErrorBoundary from '@/components/error-boundary';
import { route } from 'ziggy-js';

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

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        // Hacer la función route disponible globalmente
        (window as any).route = route;
        
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
