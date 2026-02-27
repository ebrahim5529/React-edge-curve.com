<?php

use App\Models\ContactMessage;

test('contact form stores a message', function () {
    $response = $this->post(route('contact.store'), [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'message' => 'Hello, I would like to get in touch.',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('status');

    expect(ContactMessage::count())->toBe(1);
    $message = ContactMessage::first();
    expect($message->name)->toBe('John Doe');
    expect($message->email)->toBe('john@example.com');
    expect($message->message)->toBe('Hello, I would like to get in touch.');
    expect($message->is_read)->toBeFalse();
});

test('contact form validates required fields', function () {
    $response = $this->post(route('contact.store'), []);

    $response->assertSessionHasErrors(['name', 'email', 'message']);
    expect(ContactMessage::count())->toBe(0);
});
