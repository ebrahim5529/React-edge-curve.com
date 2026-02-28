---
description: إدارة المقالات في لوحة التحكم
---

# إدارة المقالات - Dashboard Posts

هذا الدليل يشرح كيفية إدارة المقالات في لوحة التحكم بنفس أسلوب إدارة المستخدمين.

## الملفات الرئيسية

### Backend Files
- `app/Http/Controllers/PostController.php` - المتحكم الرئيسي للمقالات
- `app/Models/Post.php` - نموذج المقال
- `database/migrations/2026_02_28_082500_create_posts_table.php` - هيكل جدول المقالات

### Frontend Files
- `resources/js/pages/posts/index.tsx` - صفحة عرض جميع المقالات
- `resources/js/pages/posts/create.tsx` - صفحة إنشاء مقال جديد
- `resources/js/pages/posts/edit.tsx` - صفحة تعديل مقال
- `resources/js/actions/App/Http/Controllers/PostController.ts` - دوال الوصول للمسارات
- `resources/js/routes/dashboard/posts/index.ts` - مسارات المقالات

## الوظائف المتاحة

### 1. عرض جميع المقالات (Index)
- **المسار**: `GET /dashboard/posts`
- **الصفحة**: `resources/js/pages/posts/index.tsx`
- **المتحكم**: `PostController@index`
- **الوظائف**:
  - عرض قائمة المقالات
  - البحث في المقالات
  - فلترة المقالات المنشورة/غير المنشورة
  - حذف المقالات
  - تبديل حالة النشر

### 2. إنشاء مقال جديد (Create)
- **المسار**: `GET /dashboard/posts/create`
- **الصفحة**: `resources/js/pages/posts/create.tsx`
- **المتحكم**: `PostController@create`
- **الوظائف**:
  - نموذج إدخال بيانات المقال
  - تحميل الصور
  - محرر النصوص
  - معاينة المقال

### 3. حفظ مقال جديد (Store)
- **المسار**: `POST /dashboard/posts`
- **المتحكم**: `PostController@store`
- **الوظائف**:
  - التحقق من البيانات
  - حفظ المقال في قاعدة البيانات
  - رفع الصور
  - إعادة التوجيه لصفحة المقالات

### 4. تعديل مقال (Edit)
- **المسار**: `GET /dashboard/posts/{post}/edit`
- **الصفحة**: `resources/js/pages/posts/edit.tsx`
- **المتحكم**: `PostController@edit`
- **الوظائف**:
  - عرض بيانات المقال الحالية
  - تعديل المحتوى
  - تغيير الصورة

### 5. تحديث مقال (Update)
- **المسار**: `PUT /dashboard/posts/{post}`
- **المتحكم**: `PostController@update`
- **الوظائف**:
  - تحديث بيانات المقال
  - التحقق من البيانات
  - حفظ التغييرات

### 6. حذف مقال (Destroy)
- **المسار**: `DELETE /dashboard/posts/{post}`
- **المتحكم**: `PostController@destroy`
- **الوظائف**:
  - حذف المقال
  - حذف الصور المرتبطة
  - رسالة تأكيد

### 7. تبديل حالة النشر (Toggle Publish)
- **المسار**: `POST /dashboard/posts/{post}/toggle-publish`
- **المتحكم**: `PostController@togglePublish`
- **الوظائف**:
  - تبديل حالة النشر
  - تحديد تاريخ النشر
  - رسالة تأكيد

## المكونات المستخدمة

### واجهة المستخدم
- `Card` - عرض المقالات
- `Button` - الأزرار المختلفة
- `Input` - حقول الإدخال
- `Badge` - عرض الحالات
- `Dialog` - نوافذ الحوار
- `Checkbox` - خانات الاختيار

### الأيقونات
- `FileText` - أيقونة المقال
- `Pencil` - أيقونة التعديل
- `Trash2` - أيقونة الحذف
- `Plus` - أيقونة الإضافة
- `Search` - أيقونة البحث
- `Eye` / `EyeOff` - أيقونات عرض/إخفاء

## قاعدة البيانات

### جدول المقالات (posts)
- `id` - المعرّف الرئيسي
- `title` - عنوان المقال
- `slug` - الرابط المخصص
- `content` - محتوى المقال
- `excerpt` - مقتطف المقال
- `image_url` - رابط الصورة
- `is_published` - حالة النشر
- `published_at` - تاريخ النشر
- `created_at` - تاريخ الإنشاء
- `updated_at` - تاريخ التحديث

## المسارات

### مسارات لوحة التحكم
```php
// عرض جميع المقالات
Route::get('/posts', [PostController::class, 'index'])->name('posts.index');

// صفحة إنشاء مقال جديد
Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');

// حفظ مقال جديد
Route::post('/posts', [PostController::class, 'store'])->name('posts.store');

// صفحة تعديل مقال
Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');

// تحديث مقال
Route::put('/posts/{post}', [PostController::class, 'update'])->name('posts.update');

// حذف مقال
Route::delete('/posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');

// تبديل حالة النشر
Route::post('/posts/{post}/toggle-publish', [PostController::class, 'togglePublish'])->name('posts.toggle-publish');
```

## التحقق من البيانات

### قواعد التحقق لإنشاء مقال
```php
$validated = $request->validate([
    'title' => ['required', 'string', 'max:255'],
    'slug' => ['required', 'string', 'max:255', 'unique:posts'],
    'content' => ['required', 'string'],
    'excerpt' => ['nullable', 'string', 'max:500'],
    'image_url' => ['nullable', 'url'],
    'is_published' => ['nullable', 'boolean'],
]);
```

### قواعد التحقق لتعديل مقال
```php
$validated = $request->validate([
    'title' => ['required', 'string', 'max:255'],
    'slug' => ['required', 'string', 'max:255', 'unique:posts,slug,' . $post->id],
    'content' => ['required', 'string'],
    'excerpt' => ['nullable', 'string', 'max:500'],
    'image_url' => ['nullable', 'url'],
    'is_published' => ['nullable', 'boolean'],
]);
```

## الرسائل

### رسائل النجاح
- `تم إضافة المقال بنجاح`
- `تم تحديث المقال بنجاح`
- `تم حذف المقال بنجاح`
- `تم نشر المقال بنجاح`
- `تم إلغاء نشر المقال بنجاح`

### رسائل الخطأ
- `لا يمكنك حذف هذا المقال`
- `حدث خطأ أثناء حفظ المقال`
- `البيانات المدخلة غير صحيحة`

## ملاحظات هامة

1. **الصلاحيات**: التأكد من أن المستخدم لديه صلاحية إدارة المقالات
2. **الصور**: رفع الصور وتخزينها بشكل آمن
3. **الSEO**: تحسين المقالات لمحركات البحث
4. **النسخ الاحتياطي**: أخذ نسخ احتياطية للمقالات المهمة
5. **التعليقات**: إدارة تعليقات المقالات (إذا كانت مفعلة)

## الخطوات التالية

1. إضافة نظام التصنيفات
2. إضافة نظام الوسوم (Tags)
3. إضافة نظام الجدولة للنشر
4. إضافة نظام الإحصائيات والتحليلات
5. إضافة نظام الترجمات
