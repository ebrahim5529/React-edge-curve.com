import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { edit, index, update } from '@/routes/partners';

interface Partner {
    id: number;
    name: string;
    image: string | null;
    image_url: string | null;
    url: string | null;
    order: number;
    is_published: boolean;
}

interface PartnersEditProps {
    partner: Partner;
}

export default function PartnersEdit({ partner }: PartnersEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'لوحة التحكم', href: dashboard().url },
        { title: 'الشركاء', href: index.url() },
        { title: 'تعديل شريك', href: edit.url({ partner: partner.id }) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="تعديل شريك" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <Button asChild variant="ghost" size="sm" className="w-fit">
                    <Link href={index.url()}>
                        <ArrowLeft className="size-4" />
                        العودة للشركاء
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>تعديل الشريك: {partner.name}</CardTitle>
                        <CardDescription>تعديل بيانات الشريك</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...update.form({ partner: partner.id })}
                            encType="multipart/form-data"
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">الاسم</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            defaultValue={partner.name}
                                            placeholder="اسم الشريك"
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                    {partner.image_url && (
                                        <div className="grid gap-2">
                                            <Label>الصورة الحالية</Label>
                                            <img
                                                src={partner.image_url}
                                                alt={partner.name}
                                                className="max-h-40 rounded-md object-contain"
                                            />
                                        </div>
                                    )}
                                    <div className="grid gap-2">
                                        <Label htmlFor="image">
                                            {partner.image
                                                ? 'استبدال الصورة'
                                                : 'الصورة'}
                                        </Label>
                                        <Input
                                            id="image"
                                            name="image"
                                            type="file"
                                            accept="image/*"
                                        />
                                        <InputError message={errors.image} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="url">
                                            رابط (اختياري)
                                        </Label>
                                        <Input
                                            id="url"
                                            name="url"
                                            type="url"
                                            defaultValue={partner.url ?? ''}
                                            placeholder="https://"
                                        />
                                        <InputError message={errors.url} />
                                    </div>
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <Checkbox
                                            id="is_published"
                                            name="is_published"
                                            value="1"
                                            defaultChecked={
                                                partner.is_published
                                            }
                                        />
                                        <Label
                                            htmlFor="is_published"
                                            className="text-sm font-normal"
                                        >
                                            منشور (يظهر في الموقع)
                                        </Label>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? 'جاري الحفظ...'
                                                : 'حفظ التغييرات'}
                                        </Button>
                                        <Button
                                            asChild
                                            variant="outline"
                                            type="button"
                                        >
                                            <Link href={index.url()}>
                                                إلغاء
                                            </Link>
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
