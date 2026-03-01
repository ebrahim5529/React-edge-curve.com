import { Head, router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { index, store } from '@/routes/team-members';
import type { BreadcrumbItem } from '@/types';
import TeamMemberForm from './form';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'لوحة التحكم', href: dashboard().url },
    { title: 'فريق العمل', href: index().url },
    { title: 'إضافة عضو', href: '#' },
];

export default function TeamMemberCreate() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (data: any, options: any) => {
        setIsSubmitting(true);
        router.post(store.url(), data, {
            ...options,
            onSuccess: () => {
                // Toast is handled by the redirect with status
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
            onError: (errors) => {
                toast.error('يرجى التحقق من الأخطاء في النموذج');
                console.error(errors);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="إضافة عضو فريق" />
            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-bold">إضافة عضو فريق جديد</h1>
                    <p className="text-muted-foreground">
                        أضف عضواً جديداً ليظهر في قائمة فريق العمل على الموقع
                    </p>
                </div>

                <TeamMemberForm
                    onSubmit={handleSubmit}
                    submitLabel="إضافة عضو"
                    isSubmitting={isSubmitting}
                />
            </div>
        </AppLayout>
    );
}
