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
                            className="w-full hover:bg-sidebar-accent/50 data-[state=open]:bg-sidebar-accent/50"
                        >
                            <div className="flex items-center gap-3 w-full min-w-0">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sidebar-primary">
                                    <User className="h-5 w-5 text-sidebar-primary-foreground" />
                                </div>
                                <div className="flex flex-col items-start overflow-hidden">
                                    <span className="text-sm font-semibold text-sidebar-foreground truncate w-full">
                                        {auth.user.name as string}
                                    </span>
                                    <span className="text-xs text-sidebar-foreground/60 capitalize truncate w-full">
                                        {auth.user.role as string}
                                    </span>
                                </div>
                                <ChevronUp className="ml-auto h-4 w-4 text-sidebar-foreground/60" />
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-56 rounded-lg"
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
