<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Project extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'slug',
        'category',
        'description',
        'image',
        'url',
        'order',
        'is_published',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'order' => 'integer',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Project $project): void {
            if (empty($project->slug)) {
                $project->slug = Str::slug($project->title);
            }
        });
    }

    /**
     * Get the full URL for the project image.
     */
    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? Storage::url($this->image) : null;
    }

    /**
     * Get the media for the project.
     */
    public function media(): HasMany
    {
        return $this->hasMany(Media::class)->orderBy('order')->orderBy('created_at');
    }

    /**
     * Get the featured media for the project.
     */
    public function featuredMedia(): HasMany
    {
        return $this->hasMany(Media::class)->where('is_featured', true)->orderBy('order');
    }

    /**
     * Scope a query to only include published projects.
     *
     * @param  \Illuminate\Database\Eloquent\Builder<Project>  $query
     * @return \Illuminate\Database\Eloquent\Builder<Project>
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
