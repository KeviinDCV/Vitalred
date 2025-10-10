<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificacionesController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $notificaciones = [
            [
                'id' => 1,
                'titulo' => 'Nuevo registro médico',
                'mensaje' => 'Se ha creado un nuevo registro médico que requiere tu atención',
                'tipo' => 'info',
                'leida' => false,
                'fecha' => now()->subHours(2)->format('Y-m-d H:i:s'),
                'url' => route($user->role . '.dashboard'),
            ],
            [
                'id' => 2,
                'titulo' => 'Solicitud procesada',
                'mensaje' => 'Tu solicitud ha sido procesada exitosamente',
                'tipo' => 'success',
                'leida' => false,
                'fecha' => now()->subHours(5)->format('Y-m-d H:i:s'),
                'url' => null,
            ],
            [
                'id' => 3,
                'titulo' => 'Recordatorio',
                'mensaje' => 'Tienes casos pendientes por revisar',
                'tipo' => 'warning',
                'leida' => true,
                'fecha' => now()->subDay()->format('Y-m-d H:i:s'),
                'url' => null,
            ],
        ];

        $stats = [
            'total' => count($notificaciones),
            'no_leidas' => count(array_filter($notificaciones, fn($n) => !$n['leida'])),
        ];

        return Inertia::render('shared/notificaciones', [
            'notificaciones' => $notificaciones,
            'stats' => $stats,
            'user' => $user,
        ]);
    }

    public function marcarLeida(Request $request, $id)
    {
        // Aquí se marcaría como leída en la base de datos
        return response()->json(['success' => true, 'message' => 'Notificación marcada como leída']);
    }

    public function marcarTodasLeidas(Request $request)
    {
        // Aquí se marcarían todas como leídas en la base de datos
        return response()->json(['success' => true, 'message' => 'Todas las notificaciones marcadas como leídas']);
    }
}