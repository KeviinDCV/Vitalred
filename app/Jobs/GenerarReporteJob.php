<?php

namespace App\Jobs;

use App\Models\Reporte;
use App\Models\RegistroMedico;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class GenerarReporteJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Reporte $reporte
    ) {}

    public function handle(): void
    {
        $this->reporte->update(['estado' => 'procesando']);

        try {
            $data = $this->obtenerDatos();
            $archivo = $this->generarArchivo($data);
            
            $this->reporte->update([
                'estado' => 'completado',
                'archivo_path' => $archivo,
                'fecha_generacion' => now(),
                'fecha_expiracion' => now()->addDays(30),
            ]);

        } catch (\Exception $e) {
            $this->reporte->update(['estado' => 'error']);
            throw $e;
        }
    }

    private function obtenerDatos(): array
    {
        return match($this->reporte->tipo) {
            'registros' => RegistroMedico::with('user')->get()->toArray(),
            'usuarios' => User::all()->toArray(),
            default => []
        };
    }

    private function generarArchivo(array $data): string
    {
        $filename = 'reportes/' . $this->reporte->id . '_' . time() . '.json';
        Storage::put($filename, json_encode($data, JSON_PRETTY_PRINT));
        return $filename;
    }
}