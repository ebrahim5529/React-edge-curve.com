import { Head, router, usePage } from '@inertiajs/react';
import {
    Pencil,
    Plus,
    Trash2,
    Users,
    Search,
    Eye,
    EyeOff,
    UserPlus,
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
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { index, store, toggleActive, destroy } from '@/routes/users';

interface User {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    email_verified_at: string | null;
    created_at: string;
}

interface UsersIndexProps {
    users: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'لوحة التحكم', href: dashboard().url },
    { title: 'المستخدمين', href: '/users' },
];

export default function UsersIndex({ users }: UsersIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { props } = usePage();
    const status = (props as any).status;
    const error = (props as any).error;

    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return users;
        const query = searchQuery.toLowerCase();
        return users.filter(
            (user) =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query),
        );
    }, [users, searchQuery]);

    const handleDelete = (id: number, name: string) => {
        toast.warn(
            <div className="text-center">
                <p className="mb-2 font-bold">
                    هل أنت متأكد من حذف المستخدم "{name}"؟
                </p>
                <div className="flex justify-center gap-2">
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                            router.delete(destroy.url({ user: id }), {
                                onSuccess: () => {
                                    toast.success('تم حذف المستخدم بنجاح');
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

    const handleToggleActive = (user: User) => {
        router.patch(
            toggleActive.url({ user: user.id }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        user.is_active
                            ? 'تم تعطيل المستخدم'
                            : 'تم تفعيل المستخدم',
                    );
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="المستخدمين" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {status && (
                    <div className="rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
                        {status}
                    </div>
                )}
                {error && (
                    <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                        {error}
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">المستخدمين</h1>
                        <p className="text-muted-foreground">
                            إدارة مستخدمي لوحة التحكم
                        </p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <UserPlus className="ms-2 size-4" />
                                إضافة مستخدم
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>إضافة مستخدم جديد</DialogTitle>
                                <DialogDescription>
                                    أضف مستخدم جديد لنظام إدارة المحتوى
                                </DialogDescription>
                            </DialogHeader>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(
                                        e.currentTarget,
                                    );
                                    router.post(store.url(), formData, {
                                        onSuccess: () => {
                                            setIsDialogOpen(false);
                                            toast.success(
                                                'تم إضافة المستخدم بنجاح',
                                            );
                                        },
                                    });
                                }}
                                className="space-y-4"
                            >
                                <div className="grid gap-2">
                                    <Label htmlFor="name">الاسم</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        required
                                        placeholder="اسم المستخدم"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">
                                        البريد الإلكتروني
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="البريد@example.com"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">
                                        كلمة المرور
                                    </Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        minLength={8}
                                        placeholder="كلمة المرور"
                                    />
                                </div>
                                <div className="flex items-center space-x-2 space-x-reverse">
                                    <Checkbox
                                        id="is_active"
                                        name="is_active"
                                        value="1"
                                        defaultChecked
                                    />
                                    <Label
                                        htmlFor="is_active"
                                        className="text-sm font-normal"
                                    >
                                        مفعل
                                    </Label>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                    >
                                        إلغاء
                                    </Button>
                                    <Button type="submit">
                                        إضافة المستخدم
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>قائمة المستخدمين</CardTitle>
                        <CardDescription>
                            جميع المستخدمين في لوحة التحكم ({users.length})
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative mb-4">
                            <Search className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="البحث بالاسم أو البريد الإلكتروني..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pr-10"
                            />
                        </div>

                        {filteredUsers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                                <Users className="mb-3 size-10 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                    {searchQuery
                                        ? 'لا توجد نتائج للبحث'
                                        : 'لا مستخدمين بعد'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b text-right">
                                            <th className="pr-4 pb-3 font-medium">
                                                الاسم
                                            </th>
                                            <th className="pr-4 pb-3 font-medium">
                                                البريد الإلكتروني
                                            </th>
                                            <th className="pr-4 pb-3 font-medium">
                                                الحالة
                                            </th>
                                            <th className="pr-4 pb-3 font-medium">
                                                تاريخ التسجيل
                                            </th>
                                            <th className="pr-4 pb-3 text-center font-medium">
                                                الإجراءات
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="border-b hover:bg-muted/50"
                                            >
                                                <td className="py-3 pr-4 font-medium">
                                                    {user.name}
                                                </td>
                                                <td className="py-3 pr-4 text-sm">
                                                    {user.email}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <Badge
                                                        variant={
                                                            user.is_active
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {user.is_active
                                                            ? 'مفعل'
                                                            : 'معطل'}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 pr-4 text-sm text-muted-foreground">
                                                    {new Date(
                                                        user.created_at,
                                                    ).toLocaleDateString(
                                                        'ar-SA',
                                                    )}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title={
                                                                user.is_active
                                                                    ? 'تعطيل'
                                                                    : 'تفعيل'
                                                            }
                                                            onClick={() =>
                                                                handleToggleActive(
                                                                    user,
                                                                )
                                                            }
                                                        >
                                                            {user.is_active ? (
                                                                <EyeOff className="size-4 text-orange-500" />
                                                            ) : (
                                                                <Eye className="size-4 text-green-500" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="حذف"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user.id,
                                                                    user.name,
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
