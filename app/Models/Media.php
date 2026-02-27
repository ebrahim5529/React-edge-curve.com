<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    protected $fillable = [
        'project_id',
        'title',
        'description',
        'type',
        'file_path',
        'thumbnail_path',
        'video_url',
        'video_embed_url',
        'order',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'order' => 'integer',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function getFileUrlAttribute(): ?string
    {
        return $this->file_path ? asset('storage/' . $this->file_path) : null;
    }

    public function getThumbnailUrlAttribute(): ?string
    {
        return $this->thumbnail_path ? asset('storage/' . $this->thumbnail_path) : null;
    }

    public function getVideoUrlAttribute(): ?string
    {
        return $this->attributes['video_url'] ?? null;
    }

    public function getVideoEmbedUrlAttribute(): ?string
    {
        return $this->attributes['video_embed_url'] ?? null;
    }

    public function getDisplayUrlAttribute(): string
    {
        if ($this->type === 'video' && $this->video_embed_url) {
            return $this->video_embed_url;
        }
        
        if ($this->type === 'video' && $this->video_url) {
            return $this->video_url;
        }
        
        return $this->file_url;
    }
}
