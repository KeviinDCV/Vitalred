<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class CustomRateLimitMiddleware
{
    public function handle(Request $request, Closure $next, string $key = 'global'): Response
    {
        $identifier = $this->resolveRequestSignature($request, $key);
        
        if (RateLimiter::tooManyAttempts($identifier, $this->getMaxAttempts($key))) {
            return response()->json([
                'message' => 'Demasiadas solicitudes. Intenta de nuevo más tarde.',
                'retry_after' => RateLimiter::availableIn($identifier)
            ], 429);
        }

        RateLimiter::hit($identifier, $this->getDecayMinutes($key) * 60);

        return $next($request);
    }

    protected function resolveRequestSignature(Request $request, string $key): string
    {
        return $key . ':' . ($request->user()?->id ?? $request->ip());
    }

    protected function getMaxAttempts(string $key): int
    {
        return match($key) {
            'login' => 5,
            'api' => 100,
            'reports' => 10,
            default => 60
        };
    }

    protected function getDecayMinutes(string $key): int
    {
        return match($key) {
            'login' => 15,
            'api' => 1,
            'reports' => 60,
            default => 1
        };
    }
}