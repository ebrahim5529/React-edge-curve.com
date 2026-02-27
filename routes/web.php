<?php

use App\Http\Controllers\ContactFormController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\UserController;
use App\Models\Partner;
use App\Models\Project;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    $projects = Project::query()
        ->published()
        ->with(['media' => function ($query) {
            $query->orderBy('order')->orderBy('created_at');
        }])
        ->orderBy('order')
        ->orderByDesc('created_at')
        ->get(['id', 'title', 'slug', 'category', 'description', 'image', 'url'])
        ->map(fn (Project $p) => [
            'id' => $p->id,
            'title' => $p->title,
            'slug' => $p->slug,
            'category' => $p->category,
            'description' => $p->description,
            'image' => $p->image_url,
            'url' => $p->url,
            'media' => $p->media->map(fn ($media) => [
                'id' => $media->id,
                'title' => $media->title,
                'type' => $media->type,
                'file_path' => $media->file_url,
                'thumbnail_path' => $media->thumbnail_url,
                'video_url' => $media->video_url,
                'video_embed_url' => $media->video_embed_url,
                'is_featured' => $media->is_featured,
            ]),
        ]);

    $partners = Partner::query()
        ->published()
        ->orderBy('order')
        ->orderBy('created_at')
        ->get(['id', 'name', 'image', 'url'])
        ->map(fn (Partner $partner) => [
            'id' => $partner->id,
            'name' => $partner->name,
            'image' => $partner->image_url,
            'url' => $partner->url,
        ]);

    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'projects' => $projects,
        'partners' => $partners,
    ]);
})->name('home');

Route::get('/portfolio/{project:slug}', [PortfolioController::class, 'show'])->name('portfolio.show');

Route::post('contact', ContactFormController::class)->name('contact.store');

Route::redirect('register', 'login')->name('register');

Route::get('dashboard', DashboardController::class)
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('partners', PartnerController::class)->except(['show']);
    Route::resource('projects', ProjectController::class)->except(['show']);
    Route::resource('projects.media', MediaController::class)->except(['show']);
    Route::resource('users', UserController::class)->except(['show', 'create', 'edit']);
    Route::patch('users/{user}/toggle-active', [UserController::class, 'toggleActive'])->name('users.toggle-active');
    Route::get('contact-messages', [ContactMessageController::class, 'index'])->name('contact-messages.index');
    Route::get('contact-messages/{contactMessage}', [ContactMessageController::class, 'show'])->name('contact-messages.show');
    Route::post('contact-messages/{contactMessage}/mark-read', [ContactMessageController::class, 'markAsRead'])->name('contact-messages.mark-read');
    Route::delete('contact-messages/{contactMessage}', [ContactMessageController::class, 'destroy'])->name('contact-messages.destroy');
});
