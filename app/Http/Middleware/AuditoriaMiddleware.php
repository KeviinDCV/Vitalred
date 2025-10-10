<?php

namespace App\Http\Middleware;

use App\Models\ActividadSistema;
use Closure;
use Illuminate\Http\Request;

class AuditoriaMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if (auth()->check() && $this->shouldLog($request)) {
            ActividadSistema::registrar(
                $request->method() . ' ' . $request->path(),
                null,
                null,
                null,
                $request->except(['password', 'password_confirmation', '_token'])
            );
        }

        return $response;
    }

    private function shouldLog(Request $request): bool
    {
        return in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE']) &&
               !str_contains($request->path(), 'api/') &&
               !str_contains($request->path(), '_ignition');
    }
}