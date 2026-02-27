<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StorageController extends Controller
{
    /**
     * Serve files from the public storage without symlink.
     */
    public function __invoke(string $path): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        if (str_contains($path, '..')) {
            abort(403);
        }

        $fullPath = storage_path('app/public/' . $path);

        if (! file_exists($fullPath)) {
            abort(404);
        }

        return response()->file($fullPath, [
            'Cache-Control' => 'public, max-age=31536000', // 1 year
        ]);
    }
}
