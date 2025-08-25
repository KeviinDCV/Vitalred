<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                // Redirigir según el rol del usuario
                $user = Auth::user();

                if ($user->role === 'administrador') {
                    return redirect('/dashboard');
                } elseif ($user->role === 'medico') {
                    return redirect('/medico/ingresar-registro');
                } else {
                    return redirect('/dashboard');
                }
            }
        }

        return $next($request);
    }
}
