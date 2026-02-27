import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { edit as editProject, index as projectsIndex } from '@/routes/projects';
import { index as mediaIndex } from '@/routes/projects/media';

interface Project {
    id: number;
    title: string;
}

interface MediaCreateProps {
    project: Project;
}

interface FileWithPreview {
    file: File;
    preview: string;
}

export default function MediaCreate({ project }: MediaCreateProps) {
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [order, setOrder] = useState(0);
    const [isFeatured, setIsFeatured] = useState(false);
    const [type, setType] = useState<'image' | 'video'>('image');
    const [videoUrl, setVideoUrl] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files;
        if (!selected?.length) return;
        const newFiles: FileWithPreview[] = [];
        Array.from(selected).forEach((file) => {
            if (!file.type.startsWith('image/')) return;
            const preview = URL.createObjectURL(file);
            newFiles.push({ file, preview });
        });
        setFiles((prev) => [...prev, ...newFiles]);
        e.target.value = '';
    };

    const removeFile = (index: number) => {
        setFiles((prev) => {
            const next = [...prev];
            URL.revokeObjectURL(next[index].preview);
            next.splice(index, 1);
            return next;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        
        if (type === 'image' && files.length === 0) {
            toast.error('اختر صورة واحدة على الأقل');
            return;
        }
        
        if (type === 'video' && !videoUrl.trim()) {
            toast.error('أدخل رابط فيديو يوتيوب');
            return;
        }

        const formData = new FormData();
        if (title.trim()) formData.set('title', title.trim());
        if (description.trim()) formData.set('description', description.trim());
        formData.set('type', type);
        formData.set('order', String(order));
        formData.set('is_featured', isFeatured ? '1' : '0');
        
        if (type === 'video' && videoUrl.trim()) {
            formData.set('video_url', videoUrl.trim());
        }
        
        if (type === 'image') {
            files.forEach(({ file }) => formData.append('files[]', file));
        }

        setProcessing(true);
        router.post(mediaIndex.url({ project: project.id }), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                if (type === 'image') {
                    toast.success(files.length > 1 ? `تم إضافة ${files.length} صور بنجاح` : 'تم إضافة الوسائط بنجاح');
                } else {
                    toast.success('تم إضافة الفيديو بنجاح');
                }
            },
            onError: (err) => {
                setErrors(err as Record<string, string>);
                const message = typeof err === 'object' && err && !Array.isArray(err)
                    ? Object.values(err).flat().join(' ')
                    : 'حدث خطأ. تحقق من البيانات المدخلة.';
                toast.error(message);
            },
            onFinish: () => setProcessing(false),
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'لوحة التحكم', href: dashboard().url },
        { title: 'المشاريع', href: projectsIndex().url },
        { title: project.title, href: editProject.url({ project: project.id }) },
        { title: 'الوسائط', href: mediaIndex.url({ project: project.id }) },
        { title: 'إضافة وسائط', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`إضافة وسائط: ${project.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={mediaIndex.url({ project: project.id })}>
                            <ArrowLeft className="size-4 ml-2" />
                            العودة للوسائط
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {type === 'image' ? 'إضافة صور للمشروع' : 'إضافة فيديو للمشروع'}
                        </h1>
                        <p className="text-muted-foreground">
                            {type === 'image' 
                                ? `رفع صورة أو أكثر لمشروع "${project.title}"`
                                : `إضافة فيديو يوتيوب لمشروع "${project.title}"`
                            }
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {type === 'image' ? 'إضافة صور' : 'إضافة فيديو يوتيوب'}
                        </CardTitle>
                        <CardDescription>
                            {type === 'image' 
                                ? 'يمكنك رفع عدة صور مرة واحدة. العنوان اختياري.'
                                : 'أضف رابط فيديو يوتيوب. سيتم تحويله تلقائياً لعرض مضمن.'
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">العنوان (اختياري)</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="عنوان الوسائط"
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">{errors.title}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">الوصف (اختياري)</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="وصف الوسائط"
                                    rows={3}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">{errors.description}</p>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="order">الترتيب</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        min={0}
                                        value={order}
                                        onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="flex items-center gap-2 pt-8">
                                    <Checkbox
                                        id="is_featured"
                                        checked={isFeatured}
                                        onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
                                    />
                                    <Label htmlFor="is_featured" className="font-normal">وسائط مميزة</Label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">نوع الوسائط</Label>
                                <Select value={type} onValueChange={(value: 'image' | 'video') => setType(value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="اختر نوع الوسائط" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="image">صور</SelectItem>
                                        <SelectItem value="video">فيديو يوتيوب</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {type === 'video' ? (
                                <div className="space-y-2">
                                    <Label htmlFor="video_url">رابط فيديو يوتيوب *</Label>
                                    <Input
                                        id="video_url"
                                        value={videoUrl}
                                        onChange={(e) => setVideoUrl(e.target.value)}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        أدخل رابط فيديو يوتيوب (youtube.com/watch?v= أو youtu.be/)
                                    </p>
                                    {errors.video_url && (
                                        <p className="text-sm text-destructive">{errors.video_url}</p>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Label>الصور *</Label>
                                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                                        <div className="text-center">
                                            <Upload className="mx-auto size-12 text-muted-foreground mb-4" />
                                            <label className="cursor-pointer">
                                                <span className="text-primary">اختر صوراً</span>
                                                <span className="text-muted-foreground"> أو اسحب وأفلت هنا</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleFilesChange}
                                                />
                                            </label>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                صيغ مدعومة: JPG, PNG, GIF. الحد الأقصى: 100MB للصورة
                                            </p>
                                        </div>
                                    </div>
                                    {errors.files && (
                                        <p className="text-sm text-destructive">{errors.files}</p>
                                    )}
                                </div>
                            )}

                            {type === 'image' && files.length > 0 && (
                                <div className="space-y-2">
                                    <Label>الصور المختارة ({files.length})</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {files.map((file, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={file.preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => removeFile(index)}
                                                >
                                                    <X className="size-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3">
                                <Button type="button" variant="outline" asChild>
                                    <Link href={mediaIndex.url({ project: project.id })}>إلغاء</Link>
                                </Button>
                                <Button type="submit" disabled={processing || (type === 'image' && files.length === 0) || (type === 'video' && !videoUrl.trim())}>
                                    {processing ? 'جاري الرفع...' : `إضافة ${type === 'image' && files.length ? `(${files.length})` : ''} وسائط`}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
