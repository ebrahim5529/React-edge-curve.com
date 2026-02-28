<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $posts = Post::query()
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('posts/index', [
            'posts' => $posts->map(function ($post) {
                // The image_url accessor is appended automatically, but we ensure it's loaded if needed
                return $post;
            }),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('posts/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'is_published' => 'nullable|boolean',
        ]);

        $data = $validated;
        $data['slug'] = Str::slug($data['title']);
        $data['is_published'] = $request->boolean('is_published', true);
        
        if ($data['is_published'] && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('posts', 'public');
        }

        Post::create($data);

        return redirect()->route('dashboard.posts.index')->with('status', 'تمت إضافة المقال بنجاح');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post): Response
    {
        return Inertia::render('posts/edit', [
            'post' => $post,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'is_published' => 'nullable|boolean',
        ]);

        $data = $validated;
        // Optionally update slug if title changes significantly or leave it
        $data['is_published'] = $request->boolean('is_published', $post->is_published);

        if ($data['is_published'] && !$post->is_published) {
             $data['published_at'] = $post->published_at ?? now();
        }

        if ($request->hasFile('image')) {
            if ($post->image) {
                Storage::disk('public')->delete($post->image);
            }
            $data['image'] = $request->file('image')->store('posts', 'public');
        }

        $post->update($data);

        return redirect()->route('dashboard.posts.index')->with('status', 'تم تحديث المقال بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post): RedirectResponse
    {
        if ($post->image) {
            Storage::disk('public')->delete($post->image);
        }
        $post->delete();

        return redirect()->route('dashboard.posts.index')->with('status', 'تم حذف المقال بنجاح');
    }
}
