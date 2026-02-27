import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Mail, User } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { index, show as showRoute } from '@/routes/contact-messages';

interface ContactMessage {
    id: number;
    name: string;
    email: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

interface ContactMessagesShowProps {
    contactMessage: ContactMessage;
}

export default function ContactMessagesShow({
    contactMessage,
}: ContactMessagesShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'لوحة التحكم', href: dashboard().url },
        { title: 'رسائل الاتصال', href: index.url() },
        {
            title: `رسالة من ${contactMessage.name}`,
            href: showRoute.url({ contactMessage: contactMessage.id }),
        },
    ];

    const formattedDate = new Date(contactMessage.created_at).toLocaleString(
        'ar-SA',
        {
            dateStyle: 'medium',
            timeStyle: 'short',
        }
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`رسالة من ${contactMessage.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <Button asChild variant="ghost" size="sm" className="w-fit">
                    <Link href={index.url()}>
                        <ArrowLeft className="size-4" />
                        العودة للرسائل
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="size-4" />
                            {contactMessage.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                            <Mail className="size-4" />
                            {contactMessage.email} • {formattedDate}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="whitespace-pre-wrap rounded-lg bg-muted/50 p-4 text-sm">
                            {contactMessage.message}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
