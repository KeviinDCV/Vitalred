import { AppHeaderFloating } from '@/components/app-header-floating';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

/*
  RESPONSIVE LAYOUT PRINCIPLES:
  
  Principle 1 - Box System:
  - Main container: Full viewport height, slate background
  - Header box: Fixed at top (h-14 mobile, h-16 desktop)
  - Content box: Scrollable area below header + navbar
  - Padding progression: px-3 → px-4 → px-6 → px-8
  
  Principle 2 - Rearrange with Purpose:
  - Mobile: Tighter padding, content closer to edges
  - Tablet: Moderate padding, balanced breathing room  
  - Desktop: Generous padding, max-width container
  
  Spacing Calculation:
  - Header height: 56px (mobile) / 64px (desktop)
  - Navbar + gap: ~60px (mobile) / ~72px (desktop)
  - Total top padding: 116px → pt-[116px] / 136px → pt-[136px]
*/

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <div className="relative min-h-screen min-h-[100dvh] bg-slate-50">
        <AppHeaderFloating />

        {/* Background overlay */}
        <div className="fixed inset-0 bg-slate-50 -z-10" />

        {/* Main Content - Progressive spacing */}
        <main className="
            relative 
            container mx-auto 
            px-3 sm:px-4 md:px-6 lg:px-8 
            pt-[72px] sm:pt-[80px] md:pt-[88px]
            pb-4 sm:pb-6 md:pb-8
        ">
            {children}
        </main>
    </div>
);
