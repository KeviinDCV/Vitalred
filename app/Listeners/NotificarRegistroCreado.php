<?php

namespace App\Listeners;

use App\Events\RegistroMedicoCreado;
use App\Jobs\EnviarNotificacionJob;
use App\Models\User;

class NotificarRegistroCreado
{
    public function handle(RegistroMedicoCreado $event): void
    {
        $admins = User::where('role', 'administrador')->get();
        
        foreach ($admins as $admin) {
            EnviarNotificacionJob::dispatch(
                $admin,
                'Nuevo Registro Médico',
                "Se ha creado un nuevo registro médico para {$event->registro->nombre} {$event->registro->apellidos}",
                'info',
                route('admin.buscar-registros')
            );
        }
    }
}