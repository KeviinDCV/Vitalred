<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MedicoMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verificar que el usuario esté autenticado
        if (!$request->user()) {
            return redirect()->route('login');
        }

        // Verificar que el usuario sea médico
        if ($request->user()->role !== 'medico') {
            abort(403, 'Acceso denegado. Solo médicos pueden acceder a esta sección.');
        }

        return $next($request);
    }
}
