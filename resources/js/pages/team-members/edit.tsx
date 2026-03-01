import { Head, router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { index, update } from '@/routes/team-members';
import type { BreadcrumbItem } from '@/types';
import TeamMemberForm, { type TeamMemberFormData } from './form';
import { useState } from 'react';

interface TeamMemberEditProps {
    teamMember: TeamMemberFormData & { id: number; image_url: string | null };
}

export default function TeamMemberEdit({ teamMember }: TeamMemberEditProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'لوحة التحكم', href: dashboard().url },
        { title: 'فريق العمل', href: index().url },
        { title: 'تعديل بيانات العضو', href: '#' },
    ];

    const handleSubmit = (data: any, options: any) => {
        setIsSubmitting(true);
        // We need to use POST method with _method=PUT to securely handle multipart formData for file uploads in PHP
        router.post(
            update.url({ team_member: teamMember.id }),
            {
                ...data,
                _method: 'PUT',
            },
            {
                ...options,
                onSuccess: () => {
                    // Toast is handled by back-end redirect
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
                onError: (errors) => {
                    toast.error('يرجى التحقق من الأخطاء في النموذج');
                    console.error(errors);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`تعديل: ${teamMember.name}`} />
            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-bold">
                        تعديل بيانات العضو
                    </h1>
                    <p className="text-muted-foreground">
                        تعديل بيانات {teamMember.name}
                    </p>
                </div>

                <TeamMemberForm
                    initialData={{
                        ...teamMember,
                        _method: 'PUT',
                    }}
                    onSubmit={handleSubmit}
                    submitLabel="حفظ التعديلات"
                    isSubmitting={isSubmitting}
                />
            </div>
        </AppLayout>
    );
}
