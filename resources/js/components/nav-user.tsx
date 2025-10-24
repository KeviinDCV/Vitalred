import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { UserMenuContent } from '@/components/user-menu-content';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronDown, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NavUser() {
    const { auth } = usePage<SharedData>().props;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "flex items-center gap-2",
                        "h-10 px-3 rounded-full",
                        "hover:bg-slate-100",
                        "data-[state=open]:bg-slate-100",
                        "transition-colors duration-200"
                    )}
                >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#042077] to-[#031852] shadow-sm">
                        <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium text-slate-700 truncate max-w-[120px]">
                        {auth.user.name as string}
                    </span>
                    <ChevronDown className="hidden sm:inline h-4 w-4 text-slate-500" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 rounded-lg border-0 bg-gradient-to-b from-slate-50 to-slate-100/50 shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_20px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] p-1"
                align="end"
                sideOffset={8}
            >
                <UserMenuContent user={auth.user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
