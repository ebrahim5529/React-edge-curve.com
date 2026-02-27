<?php

namespace App\Http\Controllers;

use App\Models\Media;
use App\Models\Project;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Project $project): Response
    {
        $media = Media::query()
            ->where('project_id', $project->id)
            ->orderBy('order')
            ->orderBy('created_at')
            ->get()
            ->map(function ($item) {
                // Ensure URLs use the storage.serve route via accessors
                $item->file_url = $item->file_url;
                $item->thumbnail_url = $item->thumbnail_url;

                return $item;
            });

        return Inertia::render('media/index', [
            'project' => $project,
            'media' => $media,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Project $project): Response
    {
        return Inertia::render('media/create', [
            'project' => [
                'id' => $project->id,
                'title' => $project->title,
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:image,video',
            'file' => 'nullable|file|mimes:jpeg,jpg,png,gif,mp4,mov,avi|max:102400',
            'files' => 'nullable|array',
            'files.*' => 'image|mimes:jpeg,jpg,png,gif|max:102400',
            'thumbnail' => 'nullable|file|mimes:jpeg,jpg,png,gif|max:2048',
            'video_url' => 'nullable|url',
            'order' => 'nullable|integer|min:0',
            'is_featured' => 'nullable|boolean',
        ]);

        $title = $validated['title'] ?? null;
        $description = $validated['description'] ?? null;
        $order = (int) ($validated['order'] ?? 0);
        $isFeatured = (bool) ($validated['is_featured'] ?? false);
        $videoUrl = $validated['video_url'] ?? null;
        $baseOrder = $order;

        $uploadedCount = 0;

        // Handle YouTube URL
        if ($videoUrl && $validated['type'] === 'video') {
            $embedUrl = $this->convertYoutubeToEmbed($videoUrl);
            
            Media::create([
                'project_id' => $project->id,
                'title' => $title,
                'description' => $description,
                'type' => 'video',
                'file_path' => null,
                'thumbnail_path' => null,
                'video_url' => $videoUrl,
                'video_embed_url' => $embedUrl,
                'order' => $baseOrder,
                'is_featured' => $isFeatured,
            ]);
            $uploadedCount++;
        }

        // Multiple images: files[]
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $index => $file) {
                $path = $file->store('media/'.$project->id, 'public');
                Media::create([
                    'project_id' => $project->id,
                    'title' => $title,
                    'description' => $description,
                    'type' => 'image',
                    'file_path' => $path,
                    'thumbnail_path' => null,
                    'order' => $baseOrder + $index,
                    'is_featured' => $isFeatured && $index === 0,
                ]);
                $uploadedCount++;
            }
        }

        // Single file (image or video) for backward compatibility
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $type = $validated['type'];
            $path = $file->store('media/'.$project->id, 'public');

            $thumbnailPath = null;
            if ($request->hasFile('thumbnail')) {
                $thumbnailPath = $request->file('thumbnail')->store('media/'.$project->id.'/thumbnails', 'public');
            }

            Media::create([
                'project_id' => $project->id,
                'title' => $title,
                'description' => $description,
                'type' => $type,
                'file_path' => $path,
                'thumbnail_path' => $thumbnailPath,
                'order' => $baseOrder + $uploadedCount,
                'is_featured' => $isFeatured,
            ]);
            $uploadedCount++;
        }

        if ($uploadedCount === 0) {
            return redirect()->back()->withErrors(['files' => ['يجب اختيار ملف واحد على الأقل أو رفع صور متعددة أو إضافة رابط فيديو.']]);
        }

        return redirect()->route('projects.media.index', ['project' => $project->id])
            ->with('status', $uploadedCount > 1 ? "تم إضافة {$uploadedCount} وسائط بنجاح" : 'تم إضافة الوسائط بنجاح');
    }

    /**
     * Convert YouTube URL to embed URL
     */
    private function convertYoutubeToEmbed(string $url): ?string
    {
        $patterns = [
            '/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/',
            '/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/',
            '/youtu\.be\/([a-zA-Z0-9_-]+)/',
            '/youtube\.com\/live\/([a-zA-Z0-9_-]+)/',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $url, $matches)) {
                return 'https://www.youtube.com/embed/' . $matches[1];
            }
        }

        return null;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project, Media $medium): Response
    {
        return Inertia::render('media/edit', [
            'project' => $project,
            'media' => $medium,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project, Media $medium)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'order' => 'nullable|integer|min:0',
            'is_featured' => 'nullable|boolean',
            'video_url' => 'nullable|url',
        ]);

        $updateData = [
            'title' => $validated['title'] ?? $medium->title,
            'description' => $validated['description'] ?? $medium->description,
            'order' => (int) ($validated['order'] ?? $medium->order),
            'is_featured' => (bool) ($validated['is_featured'] ?? $medium->is_featured),
        ];

        // Handle YouTube URL update for videos
        if (isset($validated['video_url']) && $medium->type === 'video') {
            $updateData['video_url'] = $validated['video_url'];
            $updateData['video_embed_url'] = $this->convertYoutubeToEmbed($validated['video_url']);
        }

        $medium->update($updateData);

        return redirect()->route('projects.media.index', ['project' => $project->id])
            ->with('status', 'تم تحديث الوسائط بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project, Media $medium)
    {
        // Delete files
        if ($medium->file_path) {
            Storage::disk('public')->delete($medium->file_path);
        }
        if ($medium->thumbnail_path) {
            Storage::disk('public')->delete($medium->thumbnail_path);
        }

        $medium->delete();

        return redirect()->route('projects.media.index', ['project' => $project->id])
            ->with('status', 'تم حذف الوسائط بنجاح');
    }
}
