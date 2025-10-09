<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class MedicoMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!auth()->check() || !in_array(auth()->user()->role, ['medico', 'administrador'])) {
            abort(403, 'Acceso denegado. Solo médicos y administradores pueden acceder.');
        }

        return $next($request);
    }
}