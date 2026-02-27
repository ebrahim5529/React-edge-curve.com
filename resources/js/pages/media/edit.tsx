import { Head, Link, router, useForm } from '@inertiajs/react';
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
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { edit as editProject, index as projectsIndex } from '@/routes/projects';
import { index as mediaIndex, update } from '@/routes/projects/media';

interface Project {
    id: number;
    title: string;
}

interface MediaItem {
    id: number;
    title: string;
    description: string | null;
    type: 'image' | 'video';
    file_path: string | null;
    thumbnail_path: string | null;
    video_url: string | null;
    video_embed_url: string | null;
    order: number;
    is_featured: boolean;
}

interface MediaEditProps {
    project: Project;
    media: MediaItem;
}

export default function MediaEdit({ project, media }: MediaEditProps) {
    const { data, setData, patch, processing, errors } = useForm({
        title: media.title,
        description: media.description || '',
        order: media.order,
        is_featured: media.is_featured,
        video_url: media.video_url || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(update.url({ project: project.id, medium: media.id }));
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'لوحة التحكم', href: dashboard().url },
        { title: 'المشاريع', href: projectsIndex().url },
        { title: project.title, href: editProject.url({ project: project.id }) },
        { title: 'الوسائط', href: mediaIndex.url({ project: project.id }) },
        { title: 'تعديل وسائط', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={media.title ? `تعديل وسائط: ${media.title}` : 'تعديل وسائط'} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={mediaIndex.url({ project: project.id })}>
                            <ArrowLeft className="size-4 ml-2" />
                            العودة للوسائط
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">تعديل الوسائط</h1>
                        <p className="text-muted-foreground">
                            {media.title
                                ? `تعديل تفاصيل "${media.title}" في مشروع "${project.title}"`
                                : `تعديل وسائط في مشروع "${project.title}"`}
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>معلومات الوسائط</CardTitle>
                        <CardDescription>
                            تعديل تفاصيل الصورة أو الفيديو
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">العنوان *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="أدخل عنوان الوسائط"
                                    required
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">{errors.title}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">الوصف</Label>
                                <Textarea
                                    id="description"
                                    value={data.description || ''}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="أدخل وصف الوسائط (اختياري)"
                                    rows={3}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">{errors.description}</p>
                                )}
                            </div>

                            {media.type === 'video' && (
                                <div className="space-y-2">
                                    <Label htmlFor="video_url">رابط فيديو يوتيوب</Label>
                                    <Input
                                        id="video_url"
                                        value={data.video_url || ''}
                                        onChange={(e) => setData('video_url', e.target.value)}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        أدخل رابط فيديو يوتيوب (youtube.com/watch?v= أو youtu.be/)
                                    </p>
                                    {errors.video_url && (
                                        <p className="text-sm text-destructive">{errors.video_url}</p>
                                    )}
                                </div>
                            )}

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="order">الترتيب</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        min="0"
                                        value={data.order}
                                        onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                        placeholder="0"
                                    />
                                    {errors.order && (
                                        <p className="text-sm text-destructive">{errors.order}</p>
                                    )}
                                </div>

                                <div className="flex items-center space-y-2">
                                    <Checkbox
                                        id="is_featured"
                                        checked={data.is_featured}
                                        onCheckedChange={(checked) => setData('is_featured', checked as boolean)}
                                    />
                                    <Label htmlFor="is_featured">وسائط مميزة</Label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    asChild
                                >
                                    <Link href={mediaIndex.url({ project: project.id })}>
                                        إلغاء
                                    </Link>
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing ? 'جاري التحديث...' : 'تحديث وسائط'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
