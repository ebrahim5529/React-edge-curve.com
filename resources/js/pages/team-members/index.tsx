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
} from '@/routes/team-members';

interface TeamMember {
    id: number;
    name: string;
    role: string;
    image: string | null;
    image_url: string | null;
    is_published: boolean;
    order: number;
    created_at: string;
}

interface TeamMembersIndexProps {
    teamMembers: TeamMember[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'لوحة التحكم', href: dashboard().url },
    { title: 'فريق العمل', href: '/team-members' },
];

export default function TeamMembersIndex({ teamMembers }: TeamMembersIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const { props } = usePage();
    const status = (props as any).status;

    const filteredMembers = useMemo(() => {
        if (!searchQuery.trim()) return teamMembers;
        const query = searchQuery.toLowerCase();
        return teamMembers.filter(
            (member) =>
                member.name.toLowerCase().includes(query) ||
                member.role.toLowerCase().includes(query),
        );
    }, [teamMembers, searchQuery]);

    const handleDelete = (id: number, name: string) => {
        toast.warn(
            <div className="text-center">
                <p className="mb-2 font-bold">هل أنت متأكد من حذف "{name}"؟</p>
                <div className="flex justify-center gap-2">
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                            router.delete(destroy.url({ team_member: id }), {
                                onSuccess: () => {
                                    toast.success('تم حذف العضو بنجاح');
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

    const handleTogglePublish = (member: TeamMember) => {
        router.patch(
            update.url({ team_member: member.id }),
            { is_published: !member.is_published, _method: 'PUT' },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        member.is_published
                            ? 'تم إلغاء نشر العضو'
                            : 'تم نشر العضو بنجاح',
                    );
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="فريق العمل" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {status && (
                    <div className="rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
                        {status}
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">فريق العمل</h1>
                        <p className="text-muted-foreground">
                            إدارة أعضاء فريق العمل في الموقع
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={createRoute.url()}>
                            <Plus className="size-4" />
                            إضافة عضو
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>قائمة الأعضاء</CardTitle>
                        <CardDescription>
                            جميع الأعضاء ({teamMembers?.length || 0})
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative mb-4">
                            <Search className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="البحث بالاسم أو الدور..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pr-10"
                            />
                        </div>

                        {filteredMembers?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                                <Users className="mb-3 size-10 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                    {searchQuery
                                        ? 'لا توجد نتائج للبحث'
                                        : 'لا يوجد أعضاء بعد'}
                                </p>
                                {!searchQuery && (
                                    <Button
                                        asChild
                                        variant="link"
                                        size="sm"
                                        className="mt-2"
                                    >
                                        <Link href={createRoute.url()}>
                                            إضافة أول عضو
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
                                                الدور
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
                                        {filteredMembers?.map((member) => (
                                            <tr
                                                key={member.id}
                                                className="border-b hover:bg-muted/50"
                                            >
                                                <td className="py-3 pr-4">
                                                    {member.image_url ? (
                                                        <img
                                                            src={member.image_url}
                                                            alt={member.name}
                                                            className="size-10 rounded-md object-contain"
                                                        />
                                                    ) : (
                                                        <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                                                            <Users className="size-5 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-3 pr-4 font-medium">
                                                    {member.name}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    {member.role}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <Badge
                                                        variant={
                                                            member.is_published
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {member.is_published
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
                                                                member.is_published
                                                                    ? 'إلغاء النشر'
                                                                    : 'نشر'
                                                            }
                                                            onClick={() =>
                                                                handleTogglePublish(
                                                                    member,
                                                                )
                                                            }
                                                        >
                                                            {member.is_published ? (
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
                                                                    team_member:
                                                                        member.id,
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
                                                                    member.id,
                                                                    member.name,
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
