import { Head, Link } from '@inertiajs/react';
import {
    Folder,
    Inbox,
    Mail,
    Plus,
    ExternalLink,
    MessageSquare,
    Users,
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard, home } from '@/routes';
import {
    create as createProject,
    edit as editProject,
    index as projectsIndex,
} from '@/routes/projects';
import {
    index as contactMessagesIndex,
    show as showContactMessage,
} from '@/routes/contact-messages';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'لوحة التحكم',
        href: dashboard().url,
    },
];

interface DashboardProps {
    projectsCount?: number;
    partnersCount?: number;
    messagesCount?: number;
    unreadMessagesCount?: number;
    recentProjects?: Array<{ id: number; title: string; category: string }>;
    recentMessages?: Array<{
        id: number;
        name: string;
        email: string;
        created_at: string;
    }>;
}

export default function Dashboard({
    projectsCount = 0,
    partnersCount = 0,
    messagesCount = 0,
    unreadMessagesCount = 0,
    recentProjects = [],
    recentMessages = [],
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="لوحة التحكم" />
            <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-x-hidden overflow-y-auto rounded-xl p-4 pb-6">
                {/* Stats Cards */}
                <div className="grid min-w-0 grid-cols-2 gap-4 lg:grid-cols-4">
                    <Card className="min-w-0">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                المشاريع
                            </CardTitle>
                            <Folder className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {projectsCount}
                            </div>
                            <CardDescription>
                                إجمالي المشاريع في المعرض
                            </CardDescription>
                        </CardContent>
                    </Card>
                    <Card className="min-w-0">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                الشركاء
                            </CardTitle>
                            <Users className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {partnersCount}
                            </div>
                            <CardDescription>
                                إجمالي الشركاء في الموقع
                            </CardDescription>
                        </CardContent>
                    </Card>
                    <Card className="min-w-0">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                رسائل الاتصال
                            </CardTitle>
                            <Inbox className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {messagesCount}
                            </div>
                            <CardDescription>
                                إجمالي الرسائل المستلمة
                            </CardDescription>
                        </CardContent>
                    </Card>
                    <Card className="min-w-0">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                رسائل غير مقروءة
                            </CardTitle>
                            <Mail className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold">
                                    {unreadMessagesCount}
                                </span>
                                {unreadMessagesCount > 0 && (
                                    <Badge variant="secondary">جديد</Badge>
                                )}
                            </div>
                            <CardDescription>
                                رسائل تحتاج مراجعة
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Links */}
                <Card>
                    <CardHeader>
                        <CardTitle>روابط سريعة</CardTitle>
                        <CardDescription>
                            الوصول السريع للإجراءات الرئيسية
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-3">
                        <Button asChild size="sm">
                            <Link href={createProject.url()}>
                                <Plus className="size-4" />
                                إضافة مشروع
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                            <Link href={contactMessagesIndex.url()}>
                                <MessageSquare className="size-4" />
                                عرض رسائل الاتصال
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                            <Link
                                href={home()}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink className="size-4" />
                                الموقع العام
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Recent Projects & Messages */}
                <div className="grid min-w-0 gap-6 lg:grid-cols-2">
                    <Card className="min-w-0">
                        <CardHeader className="flex flex-row items-center justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                <CardTitle>المشاريع الأخيرة</CardTitle>
                                <CardDescription>
                                    آخر المشاريع المضافة للمعرض
                                </CardDescription>
                            </div>
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="shrink-0"
                            >
                                <Link href={projectsIndex.url()}>عرض الكل</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {recentProjects.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                                    <Folder className="mb-3 size-10 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        لا مشاريع بعد
                                    </p>
                                    <Button
                                        asChild
                                        variant="link"
                                        size="sm"
                                        className="mt-2"
                                    >
                                        <Link href={createProject.url()}>
                                            إضافة أول مشروع
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <ul className="space-y-3">
                                    {recentProjects.map((project) => (
                                        <li
                                            key={project.id}
                                            className="flex min-w-0 items-center justify-between gap-3 rounded-lg border p-3"
                                        >
                                            <div className="min-w-0 flex-1 overflow-hidden">
                                                <p className="truncate font-medium">
                                                    {project.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {project.category}
                                                </p>
                                            </div>
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm"
                                                className="shrink-0"
                                            >
                                                <Link
                                                    href={editProject.url({
                                                        project: project.id,
                                                    })}
                                                    prefetch
                                                >
                                                    عرض
                                                </Link>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="min-w-0">
                        <CardHeader className="flex flex-row items-center justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                <CardTitle>آخر رسائل الاتصال</CardTitle>
                                <CardDescription>
                                    أحدث الرسائل من نموذج اتصل بنا
                                </CardDescription>
                            </div>
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="shrink-0"
                            >
                                <Link href={contactMessagesIndex.url()}>
                                    عرض الكل
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {recentMessages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                                    <MessageSquare className="mb-3 size-10 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        لا رسائل بعد
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        ستظهر الرسائل هنا عند إرسالها من الموقع
                                    </p>
                                </div>
                            ) : (
                                <ul className="space-y-3">
                                    {recentMessages.map((message) => (
                                        <li
                                            key={message.id}
                                            className="flex min-w-0 items-center justify-between gap-3 rounded-lg border p-3"
                                        >
                                            <div className="min-w-0 flex-1 overflow-hidden">
                                                <p className="truncate font-medium">
                                                    {message.name}
                                                </p>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {message.email}
                                                </p>
                                            </div>
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm"
                                                className="shrink-0"
                                            >
                                                <Link
                                                    href={showContactMessage.url(
                                                        {
                                                            contactMessage:
                                                                message.id,
                                                        },
                                                    )}
                                                    prefetch
                                                >
                                                    عرض
                                                </Link>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
