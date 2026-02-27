<?php

use App\Models\ContactMessage;
use App\Models\User;

test('guests cannot access contact messages', function () {
    $response = $this->get(route('contact-messages.index'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can view contact messages', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    ContactMessage::query()->create([
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'message' => 'Test message',
    ]);

    $response = $this->get(route('contact-messages.index'));
    $response->assertOk();
});
