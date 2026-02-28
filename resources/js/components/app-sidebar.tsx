import { Link } from '@inertiajs/react';
import {
    Folder,
    Inbox,
    LayoutGrid,
    Settings,
    Users,
    UserCog,
    FileText,
} from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';
import { dashboard } from '@/routes';
import { edit } from '@/routes/profile';
import { index as projectsIndex } from '@/routes/projects';
import { index as partnersIndex } from '@/routes/partners';
import { index as usersIndex } from '@/routes/users';
import { index as contactMessagesIndex } from '@/routes/contact-messages';

const mainNavItems: NavItem[] = [
    {
        title: 'لوحة التحكم',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'المشاريع',
        href: projectsIndex.url(),
        icon: Folder,
    },
    {
        title: 'الشركاء',
        href: partnersIndex.url(),
        icon: Users,
    },
    {
        title: 'المستخدمين',
        href: usersIndex.url(),
        icon: UserCog,
    },
    {
        title: 'رسائل الاتصال',
        href: contactMessagesIndex.url(),
        icon: Inbox,
    },
    {
        title: 'المدونة',
        href: '/dashboard/posts',
        icon: FileText,
    },
    {
        title: 'الإعدادات',
        href: edit(),
        icon: Settings,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar side="right" collapsible="icon" variant="inset" dir="rtl">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
