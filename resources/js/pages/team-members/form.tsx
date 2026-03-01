import { useForm } from '@inertiajs/react';
import { ImageIcon } from 'lucide-react';
import { useState, useRef } from 'react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import InputError from '@/components/input-error';

export interface TeamMemberFormData {
    name: string;
    role: string;
    image: File | null;
    facebook_url?: string;
    twitter_url?: string;
    linkedin_url?: string;
    instagram_url?: string;
    is_published: boolean;
    order: number;
    _method?: string;
}

interface TeamMemberFormProps {
    initialData?: Partial<TeamMemberFormData> & { image_url?: string | null };
    onSubmit: (data: any, options: any) => void;
    submitLabel: string;
    isSubmitting: boolean;
}

export default function TeamMemberForm({
    initialData,
    onSubmit,
    submitLabel,
    isSubmitting,
}: TeamMemberFormProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(
        initialData?.image_url || null,
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, errors, clearErrors } = useForm<TeamMemberFormData>({
        name: initialData?.name || '',
        role: initialData?.role || '',
        image: null,
        facebook_url: initialData?.facebook_url || '',
        twitter_url: initialData?.twitter_url || '',
        linkedin_url: initialData?.linkedin_url || '',
        instagram_url: initialData?.instagram_url || '',
        is_published: initialData?.is_published ?? true,
        order: initialData?.order || 0,
        ...(initialData?._method ? { _method: initialData._method } : {}),
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            clearErrors('image');
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(data, {
            forceFormData: true,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>المعلومات الأساسية</CardTitle>
                        <CardDescription>
                            أدخل اسم العضو ودوره في الفريق
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">اسم العضو</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="مثال: أحمد محمد"
                                required
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">الدور الوظيفي</Label>
                            <Input
                                id="role"
                                value={data.role}
                                onChange={(e) =>
                                    setData('role', e.target.value)
                                }
                                placeholder="مثال: مبرمج واجهات"
                                required
                            />
                            <InputError message={errors.role} />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">حالة النشر</Label>
                                <p className="text-sm text-muted-foreground">
                                    تحديد ما إذا كان سيظهر العضو في الموقع
                                </p>
                            </div>
                            <Switch
                                checked={data.is_published}
                                onCheckedChange={(checked: boolean) =>
                                    setData('is_published', checked)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="order">الترتيب</Label>
                            <Input
                                id="order"
                                type="number"
                                min="0"
                                value={data.order}
                                onChange={(e) =>
                                    setData('order', parseInt(e.target.value))
                                }
                            />
                            <InputError message={errors.order} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>صورة العضو</CardTitle>
                        <CardDescription>الصورة الشخصية للعضو</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div
                                className="group relative flex aspect-square w-48 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-muted/50 transition-colors hover:bg-muted"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {imagePreview ? (
                                    <>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                            <p className="text-sm font-medium text-white">
                                                تغيير الصورة
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <ImageIcon className="mx-auto mb-2 size-8 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            الضغط لاختيار صورة
                                        </span>
                                    </div>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                id="image"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                            <InputError message={errors.image} />
                            <p className="text-xs text-muted-foreground">
                                يفضل استخدام صور مربعة (1:1)، الحد الأقصى 5
                                ميغابايت
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>روابط التواصل الاجتماعي</CardTitle>
                        <CardDescription>روابط الحسابات على منصات التواصل (اختياري)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="facebook_url">يسبوك (Facebook)</Label>
                                <Input
                                    id="facebook_url"
                                    type="url"
                                    value={data.facebook_url}
                                    onChange={(e) =>
                                        setData('facebook_url', e.target.value)
                                    }
                                    placeholder="https://facebook.com/..."
                                />
                                <InputError message={errors.facebook_url} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="twitter_url">إكس (Twitter)</Label>
                                <Input
                                    id="twitter_url"
                                    type="url"
                                    value={data.twitter_url}
                                    onChange={(e) =>
                                        setData('twitter_url', e.target.value)
                                    }
                                    placeholder="https://twitter.com/..."
                                />
                                <InputError message={errors.twitter_url} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="linkedin_url">لينكد إن (LinkedIn)</Label>
                                <Input
                                    id="linkedin_url"
                                    type="url"
                                    value={data.linkedin_url}
                                    onChange={(e) =>
                                        setData('linkedin_url', e.target.value)
                                    }
                                    placeholder="https://linkedin.com/in/..."
                                />
                                <InputError message={errors.linkedin_url} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="instagram_url">إنستغرام (Instagram)</Label>
                                <Input
                                    id="instagram_url"
                                    type="url"
                                    value={data.instagram_url}
                                    onChange={(e) =>
                                        setData('instagram_url', e.target.value)
                                    }
                                    placeholder="https://instagram.com/..."
                                />
                                <InputError message={errors.instagram_url} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-4">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'جاري الحفظ...' : submitLabel}
                </Button>
            </div>
        </form>
    );
}
