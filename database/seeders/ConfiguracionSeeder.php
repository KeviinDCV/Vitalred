<?php

namespace Database\Seeders;

use App\Models\Configuracion;
use Illuminate\Database\Seeder;

class ConfiguracionSeeder extends Seeder
{
    public function run(): void
    {
        $configuraciones = [
            ['clave' => 'app.nombre', 'valor' => 'Vital Red', 'tipo' => 'string', 'descripcion' => 'Nombre de la aplicación', 'categoria' => 'sistema'],
            ['clave' => 'app.version', 'valor' => '1.0.0', 'tipo' => 'string', 'descripcion' => 'Versión de la aplicación', 'categoria' => 'sistema'],
            ['clave' => 'app.mantenimiento', 'valor' => false, 'tipo' => 'boolean', 'descripcion' => 'Modo mantenimiento', 'categoria' => 'sistema'],
            ['clave' => 'notificaciones.email_habilitado', 'valor' => true, 'tipo' => 'boolean', 'descripcion' => 'Notificaciones por email', 'categoria' => 'notificaciones'],
            ['clave' => 'notificaciones.sms_habilitado', 'valor' => false, 'tipo' => 'boolean', 'descripcion' => 'Notificaciones por SMS', 'categoria' => 'notificaciones'],
            ['clave' => 'seguridad.sesion_timeout', 'valor' => 120, 'tipo' => 'integer', 'descripcion' => 'Timeout de sesión en minutos', 'categoria' => 'seguridad'],
            ['clave' => 'seguridad.intentos_login', 'valor' => 3, 'tipo' => 'integer', 'descripcion' => 'Intentos máximos de login', 'categoria' => 'seguridad'],
        ];

        foreach ($configuraciones as $config) {
            Configuracion::create($config);
        }
    }
}