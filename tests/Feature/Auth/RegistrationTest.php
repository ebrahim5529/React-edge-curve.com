<?php

test('register redirects to login when registration is disabled', function () {
    $response = $this->get(route('register'));

    $response->assertRedirect(route('login', absolute: false));
});
