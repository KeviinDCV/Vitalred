<?php

namespace App\Jobs;

use App\Models\Notificacion;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class EnviarNotificacionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public string $titulo,
        public string $mensaje,
        public string $tipo = 'info',
        public ?string $url = null
    ) {}

    public function handle(): void
    {
        Notificacion::create([
            'user_id' => $this->user->id,
            'titulo' => $this->titulo,
            'mensaje' => $this->mensaje,
            'tipo' => $this->tipo,
            'url' => $this->url,
        ]);
    }
}