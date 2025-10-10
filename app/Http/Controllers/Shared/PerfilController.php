<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PerfilController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $estadisticas = [];
        if ($user->isMedico() || $user->isIps()) {
            $estadisticas = [
                'registros_creados' => $user->registrosMedicos()->count(),
                'registros_mes_actual' => $user->registrosMedicos()
                    ->whereMonth('created_at', now()->month)->count(),
                'ultimo_registro' => $user->registrosMedicos()
                    ->latest()->first()?->created_at,
            ];
        }

        return Inertia::render('shared/perfil', [
            'user' => $user,
            'estadisticas' => $estadisticas,
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:8|confirmed',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return back()->with('success', 'Perfil actualizado exitosamente');
    }
}