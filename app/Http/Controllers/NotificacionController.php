<?php

namespace App\Http\Controllers;

use App\Models\Notificacion;
use Illuminate\Http\Request;

class NotificacionController extends Controller
{
    /**
     * Obtener notificaciones no leídas del usuario actual
     */
    public function getNoLeidas()
    {
        try {
            $notificaciones = Notificacion::with(['registroMedico', 'medico'])
                ->paraUsuario(auth()->id())
                ->noLeidas()
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get();

            return response()->json([
                'success' => true,
                'notificaciones' => $notificaciones,
                'count' => $notificaciones->count(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Error obteniendo notificaciones: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener notificaciones',
            ], 500);
        }
    }

    /**
     * Marcar una notificación como leída
     */
    public function marcarComoLeida(Notificacion $notificacion)
    {
        try {
            // Verificar que la notificación pertenece al usuario actual
            if ($notificacion->user_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No autorizado',
                ], 403);
            }

            $notificacion->marcarComoLeida();

            return response()->json([
                'success' => true,
                'message' => 'Notificación marcada como leída',
            ]);
        } catch (\Exception $e) {
            \Log::error('Error marcando notificación como leída: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al marcar notificación',
            ], 500);
        }
    }

    /**
     * Marcar todas las notificaciones como leídas
     */
    public function marcarTodasComoLeidas()
    {
        try {
            Notificacion::paraUsuario(auth()->id())
                ->noLeidas()
                ->update([
                    'leida' => true,
                    'leida_at' => now(),
                ]);

            return response()->json([
                'success' => true,
                'message' => 'Todas las notificaciones marcadas como leídas',
            ]);
        } catch (\Exception $e) {
            \Log::error('Error marcando todas las notificaciones: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al marcar notificaciones',
            ], 500);
        }
    }
}
