<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    /**
     * Display a list of published posts.
     */
    public function index(): Response
    {
        $posts = Post::published()
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->paginate(12)
            ->through(fn ($post) => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt,
                'image_url' => $post->image_url,
                'published_at' => $post->published_at ? $post->published_at->format('M d, Y') : null,
            ]);

        return Inertia::render('blog/index', [
            'posts' => $posts,
        ]);
    }

    /**
     * Display a specific post.
     */
    public function show(string $slug): Response
    {
        $post = Post::published()->where('slug', $slug)->firstOrFail();

        return Inertia::render('blog/show', [
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'content' => $post->content,
                'excerpt' => $post->excerpt,
                'image_url' => $post->image_url,
                'published_at' => $post->published_at ? $post->published_at->format('M d, Y') : null,
            ],
            // Fetch some recent posts for "Read More" section
            'recentPosts' => Post::published()
                ->where('id', '!=', $post->id)
                ->orderByDesc('published_at')
                ->take(3)
                ->get()
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'title' => $p->title,
                    'slug' => $p->slug,
                    'image_url' => $p->image_url,
                    'published_at' => $p->published_at ? $p->published_at->format('M d, Y') : null,
                ]),
        ]);
    }
}
