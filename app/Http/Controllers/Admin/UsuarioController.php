<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UsuarioController extends Controller
{
    /**
     * Mostrar la lista de usuarios
     */
    public function index()
    {
        $usuarios = User::select('id', 'name', 'email', 'role', 'is_active', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        // Estadísticas
        $stats = [
            'total' => User::count(),
            'administradores' => User::where('role', 'administrador')->count(),
            'medicos' => User::where('role', 'medico')->count(),
            'ips' => User::where('role', 'ips')->count(),
            'activos' => User::where('is_active', true)->count(),
        ];

        return Inertia::render('admin/usuarios', [
            'usuarios' => $usuarios,
            'stats' => $stats,
        ]);
    }

    /**
     * Crear un nuevo usuario
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:administrador,medico,ips',
            'is_active' => 'boolean',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'is_active' => $request->is_active ?? true,
            'email_verified_at' => now(),
        ]);

        return redirect()->route('admin.usuarios')->with('success', 'Usuario creado exitosamente.');
    }

    /**
     * Actualizar un usuario
     */
    public function update(Request $request, User $usuario)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,' . $usuario->id,
            'role' => 'required|in:administrador,medico,ips',
            'is_active' => 'boolean',
        ]);

        $usuario->update([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'is_active' => $request->is_active ?? true,
        ]);

        return redirect()->route('admin.usuarios')->with('success', 'Usuario actualizado exitosamente.');
    }

    /**
     * Cambiar estado de un usuario (activar/desactivar)
     */
    public function toggleStatus(User $usuario)
    {
        $usuario->update([
            'is_active' => !$usuario->is_active,
        ]);

        $status = $usuario->is_active ? 'activado' : 'desactivado';
        return redirect()->route('admin.usuarios')->with('success', "Usuario {$status} exitosamente.");
    }

    /**
     * Eliminar un usuario
     */
    public function destroy(User $usuario)
    {
        // Prevenir que el administrador se elimine a sí mismo
        if ($usuario->id === auth()->id()) {
            return redirect()->route('admin.usuarios')->with('error', 'No puedes eliminar tu propia cuenta.');
        }

        $usuario->delete();

        return redirect()->route('admin.usuarios')->with('success', 'Usuario eliminado exitosamente.');
    }
}
