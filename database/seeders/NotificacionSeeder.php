<?php

namespace Database\Seeders;

use App\Models\Notificacion;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificacionSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            Notificacion::create([
                'user_id' => $user->id,
                'titulo' => 'Bienvenido a Vital Red',
                'mensaje' => 'Tu cuenta ha sido configurada exitosamente',
                'tipo' => 'success',
                'leida' => false,
            ]);

            if ($user->isMedico() || $user->isIps()) {
                Notificacion::create([
                    'user_id' => $user->id,
                    'titulo' => 'Nuevo registro disponible',
                    'mensaje' => 'Hay nuevos registros médicos para revisar',
                    'tipo' => 'info',
                    'leida' => false,
                    'url' => route($user->role . '.dashboard'),
                ]);
            }
        }
    }
}