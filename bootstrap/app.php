<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Exceptions\PostTooLargeException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware('web')
                ->group(base_path('routes/settings.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (PostTooLargeException $e, Request $request) {
            $message = 'حجم الطلب كبير جداً. لرفع فيديو: عدّل في إعدادات PHP القيم upload_max_filesize و post_max_size إلى 128M أو أكثر. إن كنت تستخدم Laravel Herd: انقر يميناً على أيقونة Herd → فتح مجلد php.ini → عدّل الملف ثم أعد تشغيل Herd (Stop all ثم Start all).';

            if ($request->header('X-Inertia')) {
                return redirect()->back()->withErrors(['file' => [$message]]);
            }

            return response()->json(['message' => $message], 413);
        });
    })->create();
