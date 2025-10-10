<?php

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\Authenticate;
use App\Http\Middleware\IpsMiddleware;
use App\Http\Middleware\MedicoMiddleware;
use App\Http\Middleware\RedirectIfAuthenticated;
use App\Http\Middleware\HandleInertiaRequests;
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
        ]);

        // Registrar middleware personalizado
        $middleware->alias([
            'admin' => AdminMiddleware::class,
            'medico' => MedicoMiddleware::class,
            'ips' => IpsMiddleware::class,
            'guest' => RedirectIfAuthenticated::class,
            'auth' => Authenticate::class,
            'auditoria' => \App\Http\Middleware\AuditoriaMiddleware::class,
            'logging' => \App\Http\Middleware\LoggingMiddleware::class,
        ]);

        $middleware->web(append: [
            \App\Http\Middleware\LoggingMiddleware::class,
        ]);

        $middleware->group('api', [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
