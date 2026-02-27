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
import { edit, index, update } from '@/routes/projects';

interface Project {
    id: number;
    title: string;
    slug: string;
    category: string;
    description: string;
    image: string | null;
    url: string | null;
    order: number;
    is_published: boolean;
}

interface ProjectsEditProps {
    project: Project;
}

export default function ProjectsEdit({ project }: ProjectsEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'لوحة التحكم', href: dashboard().url },
        { title: 'المشاريع', href: index.url() },
        { title: 'تعديل مشروع', href: edit.url({ project: project.id }) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="تعديل مشروع" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <Button asChild variant="ghost" size="sm" className="w-fit">
                    <Link href={index.url()}>
                        <ArrowLeft className="size-4" />
                        العودة للمشاريع
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>تعديل المشروع: {project.title}</CardTitle>
                        <CardDescription>
                            تعديل بيانات المشروع
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...update.form({ project: project.id })}
                            encType="multipart/form-data"
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">العنوان</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            required
                                            defaultValue={project.title}
                                            placeholder="عنوان المشروع"
                                        />
                                        <InputError message={errors.title} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="category">الفئة</Label>
                                        <Input
                                            id="category"
                                            name="category"
                                            required
                                            defaultValue={project.category}
                                            placeholder="مثال: Branding, Campaign"
                                        />
                                        <InputError message={errors.category} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">الوصف</Label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            required
                                            rows={4}
                                            defaultValue={project.description}
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="وصف المشروع"
                                        />
                                        <InputError message={errors.description} />
                                    </div>
                                    {project.image && (
                                        <div className="grid gap-2">
                                            <Label>الصورة الحالية</Label>
                                            <img
                                                src={`/storage/${project.image}`}
                                                alt={project.title}
                                                className="max-h-40 rounded-md object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="grid gap-2">
                                        <Label htmlFor="image">
                                            {project.image ? 'استبدال الصورة' : 'الصورة'}
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
                                        <Label htmlFor="url">رابط (اختياري)</Label>
                                        <Input
                                            id="url"
                                            name="url"
                                            type="url"
                                            defaultValue={project.url ?? ''}
                                            placeholder="https://"
                                        />
                                        <InputError message={errors.url} />
                                    </div>
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <Checkbox
                                            id="is_published"
                                            name="is_published"
                                            value="1"
                                            defaultChecked={project.is_published}
                                        />
                                        <Label
                                            htmlFor="is_published"
                                            className="text-sm font-normal"
                                        >
                                            منشور (يظهر في الموقع)
                                        </Label>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                                        </Button>
                                        <Button asChild variant="outline" type="button">
                                            <Link href={index.url()}>إلغاء</Link>
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
