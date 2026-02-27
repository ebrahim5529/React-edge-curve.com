<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactMessageRequest;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;

class ContactFormController extends Controller
{
    /**
     * Store a new contact message from the public form.
     */
    public function __invoke(StoreContactMessageRequest $request): RedirectResponse
    {
        ContactMessage::query()->create($request->validated());

        return back()->with('status', __(
            'Thank you for contacting us. We have received your message and will respond as soon as possible.'
        ));
    }
}
