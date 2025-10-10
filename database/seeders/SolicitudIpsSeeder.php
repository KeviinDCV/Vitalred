<?php

namespace Database\Seeders;

use App\Models\SolicitudIps;
use App\Models\RegistroMedico;
use App\Models\User;
use Illuminate\Database\Seeder;

class SolicitudIpsSeeder extends Seeder
{
    public function run(): void
    {
        $userIps = User::where('role', 'ips')->first();
        $registros = RegistroMedico::take(5)->get();

        foreach ($registros as $registro) {
            SolicitudIps::create([
                'user_id' => $userIps->id,
                'registro_medico_id' => $registro->id,
                'tipo_solicitud' => fake()->randomElement(['INTERCONSULTA', 'REMISION', 'APOYO_DIAGNOSTICO']),
                'especialidad_solicitada' => fake()->randomElement(['CARDIOLOGIA', 'ENDOCRINOLOGIA', 'NEUROLOGIA', 'TRAUMATOLOGIA']),
                'tipo_servicio' => fake()->randomElement(['CONSULTA_EXTERNA', 'HOSPITALIZACION', 'URGENCIAS']),
                'estado' => fake()->randomElement(['pendiente', 'aceptada', 'rechazada']),
                'prioridad' => fake()->randomElement(['baja', 'media', 'alta', 'urgente']),
                'motivo_remision' => 'Requiere valoración especializada para ' . fake()->sentence(),
                'observaciones' => fake()->optional()->sentence(),
                'fecha_solicitud' => fake()->dateTimeBetween('-30 days', 'now'),
            ]);
        }
    }
}