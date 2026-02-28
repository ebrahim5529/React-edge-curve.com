import { Form, Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, Upload } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { RichTextEditor } from '@/components/rich-text-editor';

export default function PostsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        excerpt: '',
        content: '',
        image: null as File | null,
        is_published: true,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'لوحة التحكم', href: dashboard().url },
        { title: 'المدونة', href: '/dashboard/posts' },
        { title: 'إضافة مقال جديد', href: '/dashboard/posts/create' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/posts');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="إضافة مقال جديد" />
            <div dir="rtl" className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <Button asChild variant="ghost" size="sm" className="w-fit">
                    <Link href="/dashboard/posts">
                        العودة للمدونة
                        <ArrowRight className="size-4 mr-2" />
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>إضافة مقال جديد</CardTitle>
                        <CardDescription>
                            أدخل تفاصيل المقال الجديد ليتم نشره في المدونة
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                            <div className="grid gap-2">
                                <Label htmlFor="title">العنوان *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                    placeholder="عنوان المقال الجذاب..."
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="excerpt">مقتطف قصير (اختياري)</Label>
                                <Textarea
                                    id="excerpt"
                                    value={data.excerpt}
                                    onChange={(e) => setData('excerpt', e.target.value)}
                                    rows={3}
                                    placeholder="نبذة مختصرة عن المقال تظهر في صفحة المدونة الرئيسية..."
                                />
                                <InputError message={errors.excerpt} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="content">محتوى المقال *</Label>
                                <RichTextEditor
                                    content={data.content}
                                    onChange={(newContent) => setData('content', newContent)}
                                />
                                <InputError message={errors.content} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="image">الصورة البارزة</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                                />
                                <InputError message={errors.image} />
                            </div>

                            <div className="flex items-center space-x-2 space-x-reverse">
                                <Checkbox
                                    id="is_published"
                                    checked={data.is_published}
                                    onCheckedChange={(checked) => setData('is_published', checked as boolean)}
                                />
                                <Label htmlFor="is_published" className="text-sm font-normal">
                                    نشر المقال فوراً
                                </Label>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'جاري الحفظ...' : 'حفظ المقال'}
                                </Button>
                                <Button asChild variant="outline" type="button">
                                    <Link href="/dashboard/posts">إلغاء</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
