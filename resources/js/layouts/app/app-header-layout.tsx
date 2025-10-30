import { AppHeaderFloating } from '@/components/app-header-floating';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';

export default function AppHeaderLayout({ children, breadcrumbs }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <div className="relative min-h-screen bg-slate-50 z-10">
            <AppHeaderFloating />

            {/* Background overlay to cover any residual content from previous pages */}
            <div className="fixed inset-0 bg-slate-50 z-0" />

            {/* Main Content with top padding for fixed header + floating navbar */}
            <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-6">
                {children}
            </main>
        </div>
    );
}
