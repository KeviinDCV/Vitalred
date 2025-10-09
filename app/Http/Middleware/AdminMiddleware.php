<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!auth()->check() || auth()->user()->role !== 'administrador') {
            abort(403, 'Acceso denegado. Solo administradores pueden acceder.');
        }

        return $next($request);
    }
}