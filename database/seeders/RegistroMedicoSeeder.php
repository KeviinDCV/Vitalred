<?php

namespace Database\Seeders;

use App\Models\RegistroMedico;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RegistroMedicoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buscar un usuario médico para asignar los registros
        $medico = User::where('role', 'medico')->first();

        if (!$medico) {
            $this->command->error('No se encontró ningún usuario con rol médico. Crea uno primero.');
            return;
        }

        $registros = [
            [
                'user_id' => $medico->id,
                'tipo_identificacion' => 'cc',
                'numero_identificacion' => '12345678',
                'nombre' => 'Juan Carlos',
                'apellidos' => 'Pérez González',
                'fecha_nacimiento' => '1985-03-15',
                'edad' => 39,
                'sexo' => 'masculino',
                'asegurador' => 'EPS Sura',
                'departamento' => 'Antioquia',
                'ciudad' => 'Medellín',
                'institucion_remitente' => 'Hospital San Vicente',
                'tipo_paciente' => 'ambulatorio',
                'diagnostico_principal' => 'K35.9 - Apendicitis aguda, no especificada',
                'diagnostico_1' => 'Z51.1 - Quimioterapia para neoplasia',
                'diagnostico_2' => '',
                'fecha_ingreso' => '2025-08-20',
                'dias_hospitalizados' => 5,
                'motivo_consulta' => 'Dolor abdominal intenso en fosa ilíaca derecha',
                'clasificacion_triage' => 'triage_2',
                'enfermedad_actual' => 'Paciente presenta dolor abdominal de 12 horas de evolución',
                'antecedentes' => 'Sin antecedentes médicos relevantes',
                'frecuencia_cardiaca' => 85,
                'frecuencia_respiratoria' => 18,
                'temperatura' => 37.2,
                'tension_sistolica' => 120,
                'tension_diastolica' => 80,
                'saturacion_oxigeno' => 98,
                'glucometria' => 95,
                'escala_glasgow' => '15',
                'examen_fisico' => 'Paciente consciente, orientado, con dolor a la palpación en fosa ilíaca derecha',
                'tratamiento' => 'Analgésicos IV, antibióticos profilácticos',
                'plan_terapeutico' => 'Cirugía laparoscópica programada',
                'motivo_remision' => 'Requiere evaluación por cirugía general para apendicectomía',
                'tipo_solicitud' => 'interconsulta',
                'especialidad_solicitada' => 'cirugia_general',
                'requerimiento_oxigeno' => 'NO',
                'tipo_servicio' => 'cirugia',
                'tipo_apoyo' => 'diagnostico',
                'estado' => 'enviado',
                'fecha_envio' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $medico->id,
                'tipo_identificacion' => 'cc',
                'numero_identificacion' => '87654321',
                'nombre' => 'María Elena',
                'apellidos' => 'Rodríguez López',
                'fecha_nacimiento' => '1992-07-22',
                'edad' => 32,
                'sexo' => 'femenino',
                'asegurador' => 'Nueva EPS',
                'departamento' => 'Cundinamarca',
                'ciudad' => 'Bogotá',
                'institucion_remitente' => 'Clínica del Country',
                'tipo_paciente' => 'hospitalizado',
                'diagnostico_principal' => 'I10 - Hipertensión esencial',
                'diagnostico_1' => 'E11.9 - Diabetes mellitus tipo 2',
                'diagnostico_2' => 'Z87.891 - Antecedente personal de tabaquismo',
                'fecha_ingreso' => '2025-08-22',
                'dias_hospitalizados' => 3,
                'motivo_consulta' => 'Control de hipertensión arterial y diabetes',
                'clasificacion_triage' => 'triage_3',
                'enfermedad_actual' => 'Paciente con hipertensión arterial no controlada',
                'antecedentes' => 'Diabetes mellitus tipo 2, hipertensión arterial',
                'frecuencia_cardiaca' => 92,
                'frecuencia_respiratoria' => 16,
                'temperatura' => 36.8,
                'tension_sistolica' => 150,
                'tension_diastolica' => 95,
                'saturacion_oxigeno' => 97,
                'glucometria' => 180,
                'escala_glasgow' => '15',
                'examen_fisico' => 'Paciente estable, signos vitales alterados por HTA',
                'tratamiento' => 'Antihipertensivos, hipoglucemiantes orales',
                'plan_terapeutico' => 'Ajuste de medicación antihipertensiva',
                'motivo_remision' => 'Requiere evaluación por endocrinología para control diabético',
                'tipo_solicitud' => 'remision',
                'especialidad_solicitada' => 'endocrinologia',
                'requerimiento_oxigeno' => 'NO',
                'tipo_servicio' => 'consulta_externa',
                'tipo_apoyo' => 'terapeutico',
                'estado' => 'procesado',
                'fecha_envio' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $medico->id,
                'tipo_identificacion' => 'ti',
                'numero_identificacion' => '1098765432',
                'nombre' => 'Carlos Andrés',
                'apellidos' => 'Martínez Silva',
                'fecha_nacimiento' => '2010-12-05',
                'edad' => 14,
                'sexo' => 'masculino',
                'asegurador' => 'Compensar',
                'departamento' => 'Valle del Cauca',
                'ciudad' => 'Cali',
                'institucion_remitente' => 'Hospital Universitario del Valle',
                'tipo_paciente' => 'urgencias',
                'diagnostico_principal' => 'S72.001A - Fractura de cuello de fémur derecho',
                'diagnostico_1' => '',
                'diagnostico_2' => '',
                'fecha_ingreso' => '2025-08-25',
                'dias_hospitalizados' => 0,
                'motivo_consulta' => 'Trauma en miembro inferior derecho por caída',
                'clasificacion_triage' => 'triage_2',
                'enfermedad_actual' => 'Paciente pediátrico con trauma por caída de bicicleta',
                'antecedentes' => 'Sin antecedentes patológicos',
                'frecuencia_cardiaca' => 110,
                'frecuencia_respiratoria' => 22,
                'temperatura' => 36.5,
                'tension_sistolica' => 100,
                'tension_diastolica' => 65,
                'saturacion_oxigeno' => 99,
                'glucometria' => 85,
                'escala_glasgow' => '15',
                'examen_fisico' => 'Paciente consciente, dolor intenso en cadera derecha',
                'tratamiento' => 'Analgésicos, inmovilización',
                'plan_terapeutico' => 'Evaluación quirúrgica urgente',
                'motivo_remision' => 'Fractura de cadera requiere evaluación por ortopedia pediátrica',
                'tipo_solicitud' => 'interconsulta',
                'especialidad_solicitada' => 'ortopedia',
                'requerimiento_oxigeno' => 'NO',
                'tipo_servicio' => 'urgencias',
                'tipo_apoyo' => 'diagnostico',
                'estado' => 'completado',
                'fecha_envio' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        foreach ($registros as $registro) {
            RegistroMedico::create($registro);
        }

        $this->command->info('Se crearon 3 registros médicos de prueba.');
    }
}
