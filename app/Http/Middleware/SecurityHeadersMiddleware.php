<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeadersMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Protección contra clickjacking
        $response->headers->set('X-Frame-Options', 'DENY');
        
        // Prevenir MIME type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        
        // Habilitar XSS filter del navegador
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        
        // Prevenir envío de referrer con información sensible
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        
        // Política de permisos del navegador
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
        
        // Content Security Policy (CSP) - Ajustar según necesidades
        $csp = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' localhost:5173 http://localhost:5173", // Vite en desarrollo
            "style-src 'self' 'unsafe-inline' https://fonts.bunny.net",
            "font-src 'self' https://fonts.bunny.net",
            "img-src 'self' data: blob:",
            "connect-src 'self' localhost:5173 ws://localhost:5173", // WebSocket de Vite
            "frame-ancestors 'none'"
        ];
        $response->headers->set('Content-Security-Policy', implode('; ', $csp));
        
        // HSTS (HTTP Strict Transport Security) - Solo si tienes HTTPS
        if ($request->secure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        return $response;
    }
}
