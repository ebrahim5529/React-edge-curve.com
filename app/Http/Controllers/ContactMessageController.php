<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    /**
     * Display a listing of contact messages.
     */
    public function index(): Response
    {
        $messages = ContactMessage::query()
            ->latest()
            ->get();

        return Inertia::render('contact-messages/index', [
            'messages' => $messages,
        ]);
    }

    /**
     * Display the specified contact message.
     */
    public function show(ContactMessage $contactMessage): Response
    {
        $contactMessage->update(['is_read' => true]);

        return Inertia::render('contact-messages/show', [
            'contactMessage' => $contactMessage,
        ]);
    }

    /**
     * Mark the specified message as read.
     */
    public function markAsRead(ContactMessage $contactMessage): RedirectResponse
    {
        $contactMessage->update(['is_read' => true]);

        return back()->with('status', 'تم تحديث حالة القراءة');
    }

    /**
     * Remove the specified contact message.
     */
    public function destroy(ContactMessage $contactMessage): RedirectResponse
    {
        $contactMessage->delete();

        return redirect()->route('contact-messages.index')->with('status', 'تم حذف الرسالة بنجاح');
    }
}
