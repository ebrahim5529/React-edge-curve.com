<?php

use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

test('guests cannot access projects index', function () {
    $response = $this->get(route('projects.index'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can access projects index', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('projects.index'));
    $response->assertOk();
});

test('authenticated users can create a project', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->post(route('projects.store'), [
        'title' => 'Test Project',
        'category' => 'Branding',
        'description' => 'A test project description',
        'is_published' => true,
    ]);

    $response->assertRedirect(route('projects.index'));
    expect(Project::count())->toBe(1);
    $project = Project::first();
    expect($project->title)->toBe('Test Project');
    expect($project->slug)->toBe('test-project');
});
