<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::query()
            ->orderByDesc('created_at')
            ->get(['id', 'name', 'email', 'is_active', 'email_verified_at', 'created_at']);

        return Inertia::render('users/index', [
            'users' => $users,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['email_verified_at'] = now();

        User::query()->create($validated);

        return redirect()->route('users.index')->with('status', 'تم إضافة المستخدم بنجاح');
    }

    public function toggleActive(User $user): RedirectResponse
    {
        $user->update(['is_active' => ! $user->is_active]);

        return redirect()->route('users.index')->with(
            'status',
            $user->is_active ? 'تم تفعيل المستخدم' : 'تم تعطيل المستخدم'
        );
    }

    public function destroy(User $user): RedirectResponse
    {
        $currentUserId = Auth::id();
        if ($user->id === $currentUserId) {
            return redirect()->route('users.index')->with('error', 'لا يمكنك حذف حسابك الحالي');
        }

        $user->delete();

        return redirect()->route('users.index')->with('status', 'تم حذف المستخدم بنجاح');
    }
}
