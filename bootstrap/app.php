<?php

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\Authenticate;
use App\Http\Middleware\IpsMiddleware;
use App\Http\Middleware\MedicoMiddleware;
use App\Http\Middleware\RedirectIfAuthenticated;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SecurityHeadersMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['sidebar_state']);

        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            SecurityHeadersMiddleware::class,
        ]);

        // Registrar middleware personalizado
        $middleware->alias([
            'admin' => AdminMiddleware::class,
            'medico' => MedicoMiddleware::class,
            'ips' => IpsMiddleware::class,
            'guest' => RedirectIfAuthenticated::class,
            'auth' => Authenticate::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Manejar errores de rate limiting (429)
        $exceptions->render(function (\Illuminate\Http\Exceptions\ThrottleRequestsException $e, $request) {
            // Si es una petición GET a la página de login
            if ($request->isMethod('GET') && $request->is('login')) {
                $seconds = $e->getHeaders()['Retry-After'] ?? 60;

                // Devolver la vista de login con el mensaje de throttle
                return \Inertia\Inertia::render('auth/login', [
                    'status' => null,
                    'throttle_error' => true,
                    'throttle_seconds' => $seconds,
                    'throttle_minutes' => ceil($seconds / 60),
                ])->toResponse($request)->setStatusCode(200); // Devolver 200 para evitar error en navegador
            }

            // Para peticiones POST/AJAX, dejar que Laravel maneje la respuesta normal (429)
            // return null;
        });
    })->create();
