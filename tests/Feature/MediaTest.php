<?php

use App\Models\Media;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\UploadedFile;

test('guests cannot access media create page', function () {
    $project = Project::create([
        'title' => 'Test Project',
        'slug' => 'test-project',
        'category' => 'Branding',
        'description' => 'Description',
        'is_published' => true,
    ]);

    $response = $this->get(route('projects.media.create', ['project' => $project->id]));
    $response->assertRedirect(route('login'));
});

test('authenticated users can access media create page when project exists', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $project = Project::create([
        'title' => 'Test Project',
        'slug' => 'test-project',
        'category' => 'Branding',
        'description' => 'Description',
        'is_published' => true,
    ]);

    $response = $this->get(route('projects.media.create', ['project' => $project->id]));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('media/create')
        ->has('project')
        ->where('project.id', $project->id)
        ->where('project.title', $project->title)
    );
});

test('media create returns 404 when project does not exist', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('projects.media.create', ['project' => 99999]));
    $response->assertNotFound();
});

test('authenticated users can store media for a project', function () {
    \Illuminate\Support\Facades\Storage::fake('public');
    $user = User::factory()->create();
    $this->actingAs($user);

    $project = Project::create([
        'title' => 'Test Project',
        'slug' => 'test-project',
        'category' => 'Branding',
        'description' => 'Description',
        'is_published' => true,
    ]);

    $file = UploadedFile::fake()->image('test.jpg', 100, 100);

    $response = $this->post(route('projects.media.store', ['project' => $project->id]), [
        'title' => 'Test Media',
        'description' => 'Test description',
        'type' => 'image',
        'file' => $file,
        'order' => 0,
        'is_featured' => false,
    ]);

    $response->assertRedirect(route('projects.media.index', ['project' => $project->id]));
    expect(Media::where('project_id', $project->id)->count())->toBe(1);
    $media = Media::first();
    expect($media->title)->toBe('Test Media');
    expect($media->type)->toBe('image');
});

test('authenticated users can store multiple images with optional title', function () {
    \Illuminate\Support\Facades\Storage::fake('public');
    $user = User::factory()->create();
    $this->actingAs($user);

    $project = Project::create([
        'title' => 'Test Project',
        'slug' => 'test-project',
        'category' => 'Branding',
        'description' => 'Description',
        'is_published' => true,
    ]);

    $files = [
        UploadedFile::fake()->image('photo1.jpg', 100, 100),
        UploadedFile::fake()->image('photo2.jpg', 100, 100),
    ];

    $response = $this->post(route('projects.media.store', ['project' => $project->id]), [
        'title' => '',
        'type' => 'image',
        'files' => $files,
        'order' => 0,
        'is_featured' => false,
    ]);

    $response->assertRedirect(route('projects.media.index', ['project' => $project->id]));
    expect(Media::where('project_id', $project->id)->count())->toBe(2);
    expect(Media::where('project_id', $project->id)->whereNull('title')->count())->toBe(2);
});
