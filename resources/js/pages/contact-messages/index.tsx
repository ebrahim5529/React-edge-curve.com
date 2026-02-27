import { Head, Link, router } from '@inertiajs/react';
import { MessageSquare, Trash2 } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { show, destroy } from '@/routes/contact-messages';

interface ContactMessage {
    id: number;
    name: string;
    email: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

interface ContactMessagesIndexProps {
    messages: ContactMessage[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'لوحة التحكم', href: dashboard().url },
    { title: 'رسائل الاتصال', href: '/contact-messages' },
];

export default function ContactMessagesIndex({ messages }: ContactMessagesIndexProps) {
    const handleDelete = (id: number, name: string) => {
        if (window.confirm(`هل أنت متأكد من حذف رسالة "${name}"؟`)) {
            router.delete(destroy.url({ contactMessage: id }));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="رسائل الاتصال" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-2xl font-bold">رسائل الاتصال</h1>
                    <p className="text-muted-foreground">
                        الرسائل المرسلة من نموذج اتصل بنا في الموقع
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>قائمة الرسائل</CardTitle>
                        <CardDescription>جميع رسائل الاتصال المستلمة</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                                <MessageSquare className="mb-3 size-10 text-muted-foreground" />
                                <p className="text-muted-foreground">لا رسائل بعد</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    ستظهر الرسائل هنا عند إرسالها من نموذج اتصل بنا
                                </p>
                                <Button asChild variant="link" size="sm" className="mt-2">
                                    <Link href={dashboard().url}>العودة للوحة التحكم</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex items-center justify-between rounded-lg border p-4 ${
                                            !message.is_read ? 'border-primary/30 bg-primary/5' : ''
                                        }`}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{message.name}</p>
                                                {!message.is_read && (
                                                    <Badge variant="secondary">جديد</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {message.email}
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                                {message.message}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button asChild variant="ghost" size="icon">
                                                <Link href={show.url({ contactMessage: message.id })}>
                                                    عرض
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() =>
                                                    handleDelete(message.id, message.name)
                                                }
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
