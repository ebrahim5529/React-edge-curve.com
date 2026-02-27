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
import { create as createRoute, index, store } from '@/routes/partners';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'لوحة التحكم', href: dashboard().url },
    { title: 'الشركاء', href: index.url() },
    { title: 'إضافة شريك', href: createRoute.url() },
];

export default function PartnersCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="إضافة شريك" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <Button asChild variant="ghost" size="sm" className="w-fit">
                    <Link href={index.url()}>
                        <ArrowLeft className="size-4" />
                        العودة للشركاء
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>إضافة شريك جديد</CardTitle>
                        <CardDescription>
                            أضف شريكاً جديداً للموقع
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...store.form()}
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
                                            placeholder="اسم الشريك"
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="image">الصورة</Label>
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
                                            placeholder="https://"
                                        />
                                        <InputError message={errors.url} />
                                    </div>
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <Checkbox
                                            id="is_published"
                                            name="is_published"
                                            value="1"
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
                                                : 'إضافة الشريك'}
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
