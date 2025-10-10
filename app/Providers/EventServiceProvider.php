<?php

namespace App\Providers;

use App\Events\RegistroMedicoCreado;
use App\Listeners\NotificarRegistroCreado;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        RegistroMedicoCreado::class => [
            NotificarRegistroCreado::class,
        ],
    ];

    public function boot(): void
    {
        //
    }

    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}