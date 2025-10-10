<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Models\Notificacion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificacionesController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $notificaciones = Notificacion::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $stats = [
            'total' => $user->notificaciones()->count(),
            'no_leidas' => $user->notificaciones()->noLeidas()->count(),
        ];

        return Inertia::render('shared/notificaciones', [
            'notificaciones' => $notificaciones,
            'stats' => $stats,
            'user' => $user,
        ]);
    }

    public function marcarLeida(Request $request, $id)
    {
        $notificacion = Notificacion::where('user_id', auth()->id())->findOrFail($id);
        $notificacion->marcarComoLeida();
        
        return response()->json(['success' => true, 'message' => 'Notificación marcada como leída']);
    }

    public function marcarTodasLeidas(Request $request)
    {
        auth()->user()->notificaciones()->noLeidas()->update(['leida' => true]);
        
        return response()->json(['success' => true, 'message' => 'Todas las notificaciones marcadas como leídas']);
    }
}