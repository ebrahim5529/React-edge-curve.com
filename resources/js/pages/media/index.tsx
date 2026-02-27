import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2, Star, Play, Folder, Plus, Pencil, Image as ImageIcon, StarOff } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { edit as editProject, index as projectsIndex } from '@/routes/projects';
import { create as mediaCreate, edit, destroy } from '@/routes/projects/media';

import DeleteConfirmDialog from '@/components/delete-confirm-dialog';

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
    file_url: string;
    thumbnail_url: string | null;
}

interface Project {
    id: number;
    title: string;
}

interface MediaIndexProps {
    project: Project;
    media: MediaItem[];
}

export default function MediaIndex({ project, media }: MediaIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: number; title: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { props } = usePage();
    const status = (props as any).flash?.status;

    const handleDeleteClick = (id: number, title: string) => {
        setItemToDelete({ id, title });
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!itemToDelete) return;

        setIsDeleting(true);
        router.delete(destroy.url({ project: project.id, medium: itemToDelete.id }), {
            onSuccess: () => {
                toast.success('تم حذف الوسائط بنجاح');
                setDeleteModalOpen(false);
                setItemToDelete(null);
            },
            onError: (errors) => {
                toast.error('حدث خطأ أثناء حذف الوسائط');
                console.error('Delete error:', errors);
            },
            onFinish: () => setIsDeleting(false),
            preserveState: true,
            preserveScroll: true,
        });
    };

    const filteredMedia = media.filter((item) => {
        if (!searchQuery) return true;

        const titleMatch = item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const descriptionMatch = item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const typeMatch = item.type && item.type.toLowerCase().includes(searchQuery.toLowerCase());

        return titleMatch || descriptionMatch || typeMatch;
    });

    const handleToggleFeatured = (mediaItem: MediaItem) => {
        router.patch(
            edit.url({ project: project.id, medium: mediaItem.id }),
            { is_featured: !mediaItem.is_featured },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        mediaItem.is_featured
                            ? 'تم إلغاء تمييز الوسائط'
                            : 'تم تمييز الوسائط',
                    );
                },
            },
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'لوحة التحكم', href: dashboard().url },
        { title: 'المشاريع', href: projectsIndex().url },
        { title: project.title, href: editProject.url({ project: project.id }) },
        { title: 'الوسائط', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`وسائط المشروع: ${project.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {status && (
                    <div className="rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
                        {status}
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={editProject.url({ project: project.id })}>
                                <ArrowLeft className="size-4 ml-2" />
                                العودة للمشروع
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">وسائط المشروع</h1>
                            <p className="text-muted-foreground">
                                إدارة صور وفيديوهات مشروع "{project.title}"
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={mediaCreate.url({ project: project.id })}>
                            <Plus className="size-4 ml-2" />
                            إضافة وسائط
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            جميع الوسائط ({media.length})
                        </CardTitle>
                        <CardDescription>
                            الصور والفيديوهات الخاصة بالمشروع
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {filteredMedia.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                                <Folder className="mb-3 size-10 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                    {searchQuery
                                        ? 'لا توجد نتائج للبحث'
                                        : 'لا توجد وسائط بعد'}
                                </p>
                                {!searchQuery && (
                                    <Button
                                        asChild
                                        variant="link"
                                        size="sm"
                                        className="mt-2"
                                    >
                                        <Link href={mediaCreate.url({ project: project.id })}>
                                            إضافة أول وسائط
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {filteredMedia.map((item) => (
                                    <Card key={item.id} className="overflow-hidden">
                                        <div className="relative aspect-video">
                                            {item.type === 'image' ? (
                                                <img
                                                    src={item.file_url}
                                                    alt={item.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="relative h-full w-full bg-muted">
                                                    {item.video_embed_url ? (
                                                        <iframe
                                                            src={item.video_embed_url}
                                                            title={item.title}
                                                            className="h-full w-full"
                                                            allowFullScreen
                                                            frameBorder="0"
                                                        />
                                                    ) : item.video_url ? (
                                                        <iframe
                                                            src={item.video_url}
                                                            title={item.title}
                                                            className="h-full w-full"
                                                            allowFullScreen
                                                            frameBorder="0"
                                                        />
                                                    ) : item.thumbnail_url ? (
                                                        <img
                                                            src={item.thumbnail_url}
                                                            alt={item.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center">
                                                            <Play className="size-12 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {item.is_featured && (
                                                <div className="absolute top-2 right-2">
                                                    <Badge className="bg-yellow-500 text-white">
                                                        مميز
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-4">
                                            <div className="mb-2 flex items-center justify-between">
                                                <Badge variant={item.type === 'image' ? 'default' : 'secondary'}>
                                                    {item.type === 'image' ? (
                                                        <ImageIcon className="size-3 ml-1" />
                                                    ) : (
                                                        <Play className="size-3 ml-1" />
                                                    )}
                                                    {item.type === 'image' ? 'صورة' : 'فيديو'}
                                                </Badge>
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title={item.is_featured ? 'إلغاء التمييز' : 'تمييز'}
                                                        onClick={() => handleToggleFeatured(item)}
                                                    >
                                                        {item.is_featured ? (
                                                            <StarOff className="size-4 text-yellow-500" />
                                                        ) : (
                                                            <Star className="size-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="تعديل"
                                                        asChild
                                                    >
                                                        <Link href={edit.url({ project: project.id, medium: item.id })}>
                                                            <Pencil className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="حذف"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => handleDeleteClick(item.id, item.title)}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <h3 className="font-semibold">{item.title}</h3>
                                            {item.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {item.description}
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <DeleteConfirmDialog
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                processing={isDeleting}
                title={`حذف "${itemToDelete?.title}"`}
                description="هل أنت متأكد من رغبتك في حذف هذه الوسائط؟ لا يمكن التراجع عن هذا الإجراء."
            />
        </AppLayout>
    );
}

