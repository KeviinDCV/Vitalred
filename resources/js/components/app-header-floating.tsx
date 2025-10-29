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
        /* Top Bar with Logo and User */
        <header className="sticky top-0 z-40 w-full bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link 
                        href="/dashboard" 
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
                    >
                        <AppLogo />
                    </Link>

                    {/* User Menu */}
                    <div className="flex items-center gap-3">
                        <Badge 
                            variant={user.role === 'administrador' ? 'default' : 'secondary'}
                            className="hidden sm:inline-flex"
                        >
                            {roleLabel}
                        </Badge>
                        <NavUser />
                    </div>
                </div>
            </div>
        </header>
    );
}
