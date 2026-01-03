<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Demo Admin',
            'email' => 'admin@hrms.com',
            'password' => bcrypt('12345678'),
            'role' => 'admin',
        ]);
        User::factory()->create([
            'name' => 'Demo Employee',
            'email' => 'employee@hrms.com',
            'password' => bcrypt('12345678'),
            'role' => 'employee',
        ]);

        // Create 10 dummy employees
        for ($i = 1; $i <= 10; $i++) {
            $user = User::create([
                'name' => "Employee $i",
                'email' => "emp$i@hrms.com",
                'password' => bcrypt('password'),
                'role' => 'employee',
            ]);

            \App\Models\Employee::create([
                'user_id' => $user->id,
                'designation' => 'Software Engineer', // Or random
                'department' => 'Engineering',
                'joining_date' => now()->subDays(rand(1, 1000)),
                'salary' => rand(50000, 150000),
                'address' => '123 Fake St, City',
            ]);
        }
    }
}
