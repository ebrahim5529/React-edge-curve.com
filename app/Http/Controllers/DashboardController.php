<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\Partner;
use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function __invoke(): Response
    {
        $projectsCount = Project::query()->count();
        $partnersCount = Partner::query()->count();
        $messagesCount = ContactMessage::query()->count();
        $unreadMessagesCount = ContactMessage::query()->unread()->count();
        $recentProjects = Project::query()
            ->orderByDesc('created_at')
            ->limit(5)
            ->get(['id', 'title', 'category']);
        $recentMessages = ContactMessage::query()
            ->latest()
            ->limit(5)
            ->get(['id', 'name', 'email', 'created_at']);

        return Inertia::render('dashboard', [
            'projectsCount' => $projectsCount,
            'partnersCount' => $partnersCount,
            'messagesCount' => $messagesCount,
            'unreadMessagesCount' => $unreadMessagesCount,
            'recentProjects' => $recentProjects,
            'recentMessages' => $recentMessages,
        ]);
    }
}
