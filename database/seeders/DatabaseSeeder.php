<?php

namespace Database\Seeders;

use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Add Admin User
        User::query()->updateOrCreate(
            ['email' => 'ebrahim@ebrahim.com'],
            [
                'name' => 'Ebrahim',
                'password' => Hash::make('ebrahimebrahim'),
                'email_verified_at' => now(),
            ]
        );

        // Add Sample Team Members
        TeamMember::query()->updateOrCreate(
            ['name' => 'Ebrahim Mohamed'],
            [
                'role' => 'Founder & CEO',
                'image' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
                'is_published' => true,
                'order' => 1,
            ]
        );

        TeamMember::query()->updateOrCreate(
            ['name' => 'John Carter'],
            [
                'role' => 'Senior Frontend Developer',
                'image' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
                'is_published' => true,
                'order' => 2,
                'twitter_url' => 'https://twitter.com',
            ]
        );

        TeamMember::query()->updateOrCreate(
            ['name' => 'Sarah Johnson'],
            [
                'role' => 'UX Designer',
                'image' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
                'is_published' => true,
                'order' => 3,
            ]
        );
    }
}
