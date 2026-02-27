<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePartnerRequest;
use App\Http\Requests\UpdatePartnerRequest;
use App\Models\Partner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PartnerController extends Controller
{
    public function index(): Response
    {
        $partners = Partner::query()
            ->orderBy('order')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('partners/index', [
            'partners' => $partners->map(function ($partner) {
                $partner->image_url = $partner->image_url;

                return $partner;
            }),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('partners/create');
    }

    public function store(StorePartnerRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['order'] = $data['order'] ?? Partner::query()->max('order') + 1;
        $data['is_published'] = $data['is_published'] ?? true;

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('partners', 'public');
        }

        Partner::query()->create($data);

        return redirect()->route('partners.index')->with('status', 'تم إضافة الشريك بنجاح');
    }

    public function edit(Partner $partner): Response
    {
        return Inertia::render('partners/edit', [
            'partner' => $partner,
        ]);
    }

    public function update(UpdatePartnerRequest $request, Partner $partner): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($partner->image) {
                Storage::disk('public')->delete($partner->image);
            }
            $data['image'] = $request->file('image')->store('partners', 'public');
        }

        $partner->update($data);

        return redirect()->route('partners.index')->with('status', 'تم تحديث الشريك بنجاح');
    }

    public function destroy(Partner $partner): RedirectResponse
    {
        if ($partner->image) {
            Storage::disk('public')->delete($partner->image);
        }
        $partner->delete();

        return redirect()->route('partners.index')->with('status', 'تم حذف الشريك بنجاح');
    }
}
