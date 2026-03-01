<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTeamMemberRequest;
use App\Http\Requests\UpdateTeamMemberRequest;
use App\Models\TeamMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TeamMemberController extends Controller
{
    public function index(): Response
    {
        $teamMembers = TeamMember::query()
            ->orderBy('order')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('team-members/index', [
            'teamMembers' => $teamMembers->map(function ($member) {
                // Ensure image_url is appended
                $member->image_url = $member->image_url;

                return $member;
            }),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('team-members/create');
    }

    public function store(StoreTeamMemberRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['order'] = $data['order'] ?? TeamMember::query()->max('order') + 1;
        $data['is_published'] = $data['is_published'] ?? true;

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('team-members', 'public');
        }

        TeamMember::query()->create($data);

        return redirect()->route('team-members.index')->with('status', 'تم إضافة عضو الفريق بنجاح');
    }

    public function edit(TeamMember $teamMember): Response
    {
        return Inertia::render('team-members/edit', [
            'teamMember' => $teamMember,
        ]);
    }

    public function update(UpdateTeamMemberRequest $request, TeamMember $teamMember): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($teamMember->image) {
                Storage::disk('public')->delete($teamMember->image);
            }
            $data['image'] = $request->file('image')->store('team-members', 'public');
        }

        $teamMember->update($data);

        return redirect()->route('team-members.index')->with('status', 'تم تحديث عضو الفريق بنجاح');
    }

    public function destroy(TeamMember $teamMember): RedirectResponse
    {
        if ($teamMember->image) {
            Storage::disk('public')->delete($teamMember->image);
        }
        $teamMember->delete();

        return redirect()->route('team-members.index')->with('status', 'تم حذف عضو الفريق بنجاح');
    }
}
