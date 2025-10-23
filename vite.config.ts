import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'resources/js'),
            '@/components': resolve(__dirname, 'resources/js/components'),
            '@/pages': resolve(__dirname, 'resources/js/pages'),
            '@/layouts': resolve(__dirname, 'resources/js/layouts'),
            '@/hooks': resolve(__dirname, 'resources/js/hooks'),
            '@/lib': resolve(__dirname, 'resources/js/lib'),
            '@/types': resolve(__dirname, 'resources/js/types'),
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
    server: {
        host: true, // Permite acceso desde cualquier IP
        cors: {
            origin: '*', // Permitir todos los orígenes (incluye ngrok)
            credentials: true,
        },
        hmr: {
            host: 'localhost',
        },
    },
});
