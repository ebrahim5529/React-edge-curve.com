import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Pencil,
    Plus,
    Trash2,
    Folder,
    Search,
    Eye,
    EyeOff,
    Images,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { create as createRoute, edit, destroy } from '@/routes/projects';
import { index as mediaIndex } from '@/routes/projects/media';

interface Project {
    id: number;
    title: string;
    slug: string;
    category: string;
    description: string;
    image: string | null;
    image_url: string | null;
    url: string | null;
    order: number;
    is_published: boolean;
    created_at: string;
}

interface ProjectsIndexProps {
    projects: Project[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'لوحة التحكم', href: dashboard().url },
    { title: 'المشاريع', href: '/projects' },
];

export default function ProjectsIndex({ projects }: ProjectsIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const { props } = usePage();
    const status = (props as any).status;

    const filteredProjects = useMemo(() => {
        if (!searchQuery.trim()) return projects;
        const query = searchQuery.toLowerCase();
        return projects.filter(
            (p) =>
                p.title.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query),
        );
    }, [projects, searchQuery]);

    const handleDelete = (id: number, title: string) => {
        toast.warn(
            <div className="text-center">
                <p className="mb-2 font-bold">
                    هل أنت متأكد من حذف المشروع "{title}"؟
                </p>
                <div className="flex justify-center gap-2">
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                            router.delete(destroy.url({ project: id }), {
                                onSuccess: () => {
                                    toast.success('تم حذف المشروع بنجاح');
                                },
                            });
                            toast.dismiss();
                        }}
                    >
                        نعم، حذف
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.dismiss()}
                    >
                        إلغاء
                    </Button>
                </div>
            </div>,
            {
                closeButton: false,
                closeOnClick: false,
                draggable: false,
                autoClose: false,
            },
        );
    };

    const handleTogglePublish = (project: Project) => {
        router.patch(
            edit.url({ project: project.id }),
            { is_published: !project.is_published },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        project.is_published
                            ? 'تم إلغاء نشر المشروع'
                            : 'تم نشر المشروع بنجاح',
                    );
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="المشاريع" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {status && (
                    <div className="rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
                        {status}
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">المشاريع</h1>
                        <p className="text-muted-foreground">
                            إدارة مشاريع المعرض على الموقع
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={createRoute.url()}>
                            <Plus className="size-4" />
                            إضافة مشروع
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>قائمة المشاريع</CardTitle>
                        <CardDescription>
                            جميع المشاريع المعروضة في قسم المعرض (
                            {projects.length})
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative mb-4">
                            <Search className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="البحث بالعنوان أو الفئة..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pr-10"
                            />
                        </div>

                        {filteredProjects.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                                <Folder className="mb-3 size-10 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                    {searchQuery
                                        ? 'لا توجد نتائج للبحث'
                                        : 'لا مشاريع بعد'}
                                </p>
                                {!searchQuery && (
                                    <Button
                                        asChild
                                        variant="link"
                                        size="sm"
                                        className="mt-2"
                                    >
                                        <Link href={createRoute.url()}>
                                            إضافة أول مشروع
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b text-right">
                                            <th className="pr-4 pb-3 font-medium">
                                                الصورة
                                            </th>
                                            <th className="pr-4 pb-3 font-medium">
                                                العنوان
                                            </th>
                                            <th className="pr-4 pb-3 font-medium">
                                                الفئة
                                            </th>
                                            <th className="pr-4 pb-3 font-medium">
                                                الحالة
                                            </th>
                                            <th className="pr-4 pb-3 text-center font-medium">
                                                الإجراءات
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProjects.map((p) => (
                                            <tr
                                                key={p.id}
                                                className="border-b hover:bg-muted/50"
                                            >
                                                <td className="py-3 pr-4">
                                                    {p.image_url ? (
                                                        <img
                                                            src={p.image_url}
                                                            alt={p.title}
                                                            className="size-10 rounded-md object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                                                            <Folder className="size-5 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-3 pr-4 font-medium">
                                                    {p.title}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <Badge variant="outline">
                                                        {p.category}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <Badge
                                                        variant={
                                                            p.is_published
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {p.is_published
                                                            ? 'منشور'
                                                            : 'غير منشور'}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="الوسائط"
                                                            asChild
                                                        >
                                                            <Link href={mediaIndex.url({ project: p.id })}>
                                                                <Images className="size-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title={
                                                                p.is_published
                                                                    ? 'إلغاء النشر'
                                                                    : 'نشر'
                                                            }
                                                            onClick={() =>
                                                                handleTogglePublish(
                                                                    p,
                                                                )
                                                            }
                                                        >
                                                            {p.is_published ? (
                                                                <EyeOff className="size-4 text-orange-500" />
                                                            ) : (
                                                                <Eye className="size-4 text-green-500" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            asChild
                                                            variant="ghost"
                                                            size="icon"
                                                            title="تعديل"
                                                        >
                                                            <Link
                                                                href={edit.url({
                                                                    project:
                                                                        p.id,
                                                                })}
                                                            >
                                                                <Pencil className="size-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="حذف"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    p.id,
                                                                    p.title,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
