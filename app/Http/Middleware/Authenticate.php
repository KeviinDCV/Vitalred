<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // Si es una petición AJAX o API, no redirigir
        if ($request->expectsJson()) {
            return null;
        }

        // Redirigir siempre al login para usuarios no autenticados
        return route('login');
    }
}
