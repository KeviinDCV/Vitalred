<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario administrador
        User::updateOrCreate(
            ['email' => 'admin@vitalred.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('admin123'),
                'role' => 'administrador',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Crear usuario médico de ejemplo
        User::updateOrCreate(
            ['email' => 'medico@vitalred.com'],
            [
                'name' => 'Dr. Juan Pérez',
                'password' => Hash::make('medico123'),
                'role' => 'medico',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Crear usuario IPS de ejemplo
        User::updateOrCreate(
            ['email' => 'ips@vitalred.com'],
            [
                'name' => 'IPS Hospital Central',
                'password' => Hash::make('ips123'),
                'role' => 'ips',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}
