import { Link, usePage } from '@inertiajs/react';
import { NavUser } from './nav-user';
import AppLogo from './app-logo';
import { type SharedData } from '@/types';
import { Badge } from './ui/badge';

export function AppHeaderFloating() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    // Determinar el label del rol
    const roleLabel =
        user.role === 'administrador'
            ? 'Administrador'
            : user.role === 'medico'
            ? 'Médico'
            : 'IPS';

    return (
        /* Top Bar with Logo and User - Responsive Layout System */
        <header className="fixed top-0 left-0 right-0 z-40 w-full bg-slate-50/95 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
            {/* Container with responsive padding - Principle 1: Clear box relationships */}
            <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                {/* Flexible height for better touch targets on mobile - Principle 2: Purposeful rearrangement */}
                <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">
                    {/* Logo - Scales naturally across breakpoints */}
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity duration-200 flex-shrink-0"
                    >
                        <AppLogo />
                    </Link>

                    {/* User Section - Reorganizes elements based on available space */}
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                        {/* Role Badge - Hidden on mobile, compact on tablet, full on desktop */}
                        <Badge
                            variant={user.role === 'administrador' ? 'default' : 'secondary'}
                            className="hidden md:inline-flex text-xs px-2.5 py-0.5"
                        >
                            {roleLabel}
                        </Badge>

                        {/* User Menu - Always visible, adapts size */}
                        <div className="flex-shrink-0">
                            <NavUser />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
