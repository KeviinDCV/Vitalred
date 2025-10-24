import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { UserMenuContent } from '@/components/user-menu-content';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronUp, User } from 'lucide-react';

export function NavUser() {
    const { auth } = usePage<SharedData>().props;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton 
                            size="lg" 
                            className="w-full hover:bg-[#0a4db5] data-[state=open]:bg-[#0a4db5] transition-colors duration-200"
                        >
                            <div className="flex items-center gap-3 w-full min-w-0">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 shadow-lg">
                                    <User className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex flex-col items-start overflow-hidden">
                                    <span className="text-sm font-semibold text-white truncate w-full">
                                        {auth.user.name as string}
                                    </span>
                                    <span className="text-xs text-blue-200 capitalize truncate w-full">
                                        {auth.user.role as string}
                                    </span>
                                </div>
                                <ChevronUp className="ml-auto h-4 w-4 text-blue-200" />
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-56 rounded-lg border-0 bg-gradient-to-b from-slate-50 to-slate-100/50 shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_20px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] p-1"
                        align="end"
                        side="top"
                    >
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
