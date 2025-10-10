<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConfiguracionController extends Controller
{
    public function index()
    {
        $configuraciones = [
            'sistema' => [
                'nombre_aplicacion' => config('app.name'),
                'version' => '1.0.0',
                'mantenimiento' => false,
            ],
            'notificaciones' => [
                'email_habilitado' => true,
                'sms_habilitado' => false,
            ],
            'seguridad' => [
                'sesion_timeout' => 120,
                'intentos_login' => 3,
            ]
        ];

        return Inertia::render('admin/configuracion', [
            'configuraciones' => $configuraciones,
            'user' => auth()->user(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'sistema.nombre_aplicacion' => 'sometimes|string|max:100',
            'sistema.mantenimiento' => 'sometimes|boolean',
            'notificaciones.email_habilitado' => 'sometimes|boolean',
            'notificaciones.sms_habilitado' => 'sometimes|boolean',
            'seguridad.sesion_timeout' => 'sometimes|integer|min:30|max:480',
            'seguridad.intentos_login' => 'sometimes|integer|min:1|max:10',
        ]);

        // Aquí se guardarían las configuraciones en base de datos o archivo
        // Por ahora solo simulamos la actualización
        
        return back()->with('success', 'Configuración actualizada exitosamente');
    }
}