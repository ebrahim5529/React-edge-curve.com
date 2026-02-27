<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureAppViewLocale();
    }

    /**
     * Set locale and direction for the app root view (dashboard = Arabic RTL).
     */
    protected function configureAppViewLocale(): void
    {
        View::composer('app', function ($view): void {
            $isDashboard = Route::current() && Route::is(
                'dashboard',
                'partners.*',
                'projects.*',
                'users.*',
                'contact-messages.*'
            );

            $view->with('locale', $isDashboard ? 'ar' : 'en');
            $view->with('direction', $isDashboard ? 'rtl' : 'ltr');
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null
        );
    }
}
