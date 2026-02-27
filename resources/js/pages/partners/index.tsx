import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Users, Search, Eye, EyeOff } from 'lucide-react';
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
import {
    create as createRoute,
    edit,
    update,
    destroy,
} from '@/routes/partners';

interface Partner {
    id: number;
    name: string;
    image: string | null;
    url: string | null;
    order: number;
    is_published: boolean;
    created_at: string;
}

interface PartnersIndexProps {
    partners: Partner[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'لوحة التحكم', href: dashboard().url },
    { title: 'الشركاء', href: '/partners' },
];

export default function PartnersIndex({ partners }: PartnersIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const { props } = usePage();
    const status = (props as any).status;

    const filteredPartners = useMemo(() => {
        if (!searchQuery.trim()) return partners;
        const query = searchQuery.toLowerCase();
        return partners.filter(
            (partner) =>
                partner.name.toLowerCase().includes(query) ||
                (partner.url && partner.url.toLowerCase().includes(query)),
        );
    }, [partners, searchQuery]);

    const handleDelete = (id: number, name: string) => {
        toast.warn(
            <div className="text-center">
                <p className="mb-2 font-bold">هل أنت متأكد من حذف "{name}"؟</p>
                <div className="flex justify-center gap-2">
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                            router.delete(destroy.url({ partner: id }), {
                                onSuccess: () => {
                                    toast.success('تم حذف الشريك بنجاح');
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

    const handleTogglePublish = (partner: Partner) => {
        router.patch(
            update.url({ partner: partner.id }),
            { is_published: !partner.is_published },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        partner.is_published
                            ? 'تم إلغاء نشر الشريك'
                            : 'تم نشر الشريك بنجاح',
                    );
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="الشركاء" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {status && (
                    <div className="rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
                        {status}
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">الشركاء</h1>
                        <p className="text-muted-foreground">
                            إدارة الشركاء المعروضة على الموقع
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={createRoute.url()}>
                            <Plus className="size-4" />
                            إضافة شريك
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>قائمة الشركاء</CardTitle>
                        <CardDescription>
                            جميع الشركاء المعروضة في الموقع ({partners.length})
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative mb-4">
                            <Search className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="البحث بالاسم أو الرابط..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pr-10"
                            />
                        </div>

                        {filteredPartners.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                                <Users className="mb-3 size-10 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                    {searchQuery
                                        ? 'لا توجد نتائج للبحث'
                                        : 'لا شركاء بعد'}
                                </p>
                                {!searchQuery && (
                                    <Button
                                        asChild
                                        variant="link"
                                        size="sm"
                                        className="mt-2"
                                    >
                                        <Link href={createRoute.url()}>
                                            إضافة أول شريك
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
                                                الاسم
                                            </th>
                                            <th className="pr-4 pb-3 font-medium">
                                                الرابط
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
                                        {filteredPartners.map((partner) => (
                                            <tr
                                                key={partner.id}
                                                className="border-b hover:bg-muted/50"
                                            >
                                                <td className="py-3 pr-4">
                                                    {partner.image ? (
                                                        <img
                                                            src={`/storage/${partner.image}`}
                                                            alt={partner.name}
                                                            className="size-10 rounded-md object-contain"
                                                        />
                                                    ) : (
                                                        <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                                                            <Users className="size-5 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-3 pr-4 font-medium">
                                                    {partner.name}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    {partner.url ? (
                                                        <a
                                                            href={partner.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-blue-600 hover:underline"
                                                        >
                                                            فتح الرابط
                                                        </a>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <Badge
                                                        variant={
                                                            partner.is_published
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {partner.is_published
                                                            ? 'منشور'
                                                            : 'غير منشور'}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title={
                                                                partner.is_published
                                                                    ? 'إلغاء النشر'
                                                                    : 'نشر'
                                                            }
                                                            onClick={() =>
                                                                handleTogglePublish(
                                                                    partner,
                                                                )
                                                            }
                                                        >
                                                            {partner.is_published ? (
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
                                                                    partner:
                                                                        partner.id,
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
                                                                    partner.id,
                                                                    partner.name,
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
