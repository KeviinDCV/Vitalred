<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IpsMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!auth()->check() || !in_array(auth()->user()->role, ['ips', 'administrador'])) {
            abort(403, 'Acceso denegado. Solo IPS y administradores pueden acceder.');
        }

        return $next($request);
    }
}