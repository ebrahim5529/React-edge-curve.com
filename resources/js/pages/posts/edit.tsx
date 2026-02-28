import { Form, Head, Link, useForm } from '@inertiajs/react';
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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { RichTextEditor } from '@/components/rich-text-editor';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    image_url: string | null;
    is_published: boolean;
}

interface PostsEditProps {
    post: Post;
}

export default function PostsEdit({ post }: PostsEditProps) {
    // We use inertia post with _method: 'patch' for file uploads
    const { data, setData, post: inertiaPost, processing, errors } = useForm({
        _method: 'patch',
        title: post.title,
        excerpt: post.excerpt || '',
        content: post.content || '',
        image: null as File | null,
        is_published: post.is_published,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'لوحة التحكم', href: dashboard().url },
        { title: 'المدونة', href: '/dashboard/posts' },
        { title: 'تعديل مقال', href: `/dashboard/posts/${post.id}/edit` },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        inertiaPost(`/dashboard/posts/${post.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="تعديل مقال" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <Button asChild variant="ghost" size="sm" className="w-fit">
                    <Link href="/dashboard/posts">
                        <ArrowLeft className="size-4" />
                        العودة للمدونة
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>تعديل المقال: {post.title}</CardTitle>
                        <CardDescription>
                            تعديل بيانات ومحتوى المقال
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

                            {post.image_url && (
                                <div className="grid gap-2">
                                    <Label>الصورة الحالية</Label>
                                    <img
                                        src={post.image_url}
                                        alt={post.title}
                                        className="max-h-40 rounded-md object-cover"
                                    />
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="image">
                                    {post.image_url ? 'استبدال الصورة' : 'الصورة البارزة'}
                                </Label>
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
                                    منشور (يظهر في الموقع)
                                </Label>
                            </div>

                            <div className="flex gap-3">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'جاري الحفظ...' : 'حفظ التغييرات'}
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
