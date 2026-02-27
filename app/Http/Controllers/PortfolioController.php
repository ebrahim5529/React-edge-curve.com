<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    /**
     * Display the specified project.
     */
    public function show(Project $project): Response
    {
        $project->load(['media' => function ($query) {
            $query->orderBy('order')->orderBy('created_at');
        }]);

        if (! $project->is_published) {
            abort(404);
        }

        return Inertia::render('portfolio-show', [
            'project' => [
                'id' => $project->id,
                'title' => $project->title,
                'slug' => $project->slug,
                'category' => $project->category,
                'description' => $project->description,
                'image' => $project->image ? '/storage/'.$project->image : null,
                'media' => $project->media->map(fn ($media) => [
                    'id' => $media->id,
                    'title' => $media->title,
                    'description' => $media->description,
                    'type' => $media->type,
                    'file_path' => $media->file_path ? '/storage/'.$media->file_path : null,
                    'thumbnail_path' => $media->thumbnail_path ? '/storage/'.$media->thumbnail_path : null,
                    'video_url' => $media->video_url,
                    'video_embed_url' => $media->video_embed_url,
                    'is_featured' => $media->is_featured,
                ]),
            ],
        ]);
    }
}
