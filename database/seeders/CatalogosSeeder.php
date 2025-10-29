<?php

namespace Database\Seeders;

use App\Models\CodigoCIE10;
use App\Models\Institucion;
use App\Models\Asegurador;
use App\Models\Especialidad;
use App\Models\TipoServicio;
use App\Models\TipoApoyo;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CatalogosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🚀 Iniciando migración de catálogos desde JSON...');

        // 1. Migrar Códigos CIE-10
        $this->migrarCIE10();

        // 2. Migrar Instituciones
        $this->migrarInstituciones();

        // 3. Seed datos predeterminados
        $this->seedAseguradores();
        $this->seedEspecialidades();
        $this->seedTiposServicio();
        $this->seedTiposApoyo();

        $this->command->info('✅ Migración de catálogos completada exitosamente');
    }

    /**
     * Migrar códigos CIE-10 desde JSON
     */
    private function migrarCIE10(): void
    {
        $this->command->info('📋 Migrando códigos CIE-10...');

        $jsonPath = public_path('TablaCIE10.json');

        if (!file_exists($jsonPath)) {
            $this->command->error('❌ Archivo TablaCIE10.json no encontrado');
            return;
        }

        $cie10Data = json_decode(file_get_contents($jsonPath), true);

        if (!$cie10Data) {
            $this->command->error('❌ Error al decodificar TablaCIE10.json');
            return;
        }

        $this->command->info("   Total de códigos a migrar: " . count($cie10Data));

        // Procesar en lotes de 1000 para mejor performance
        $chunks = array_chunk($cie10Data, 1000);
        $totalProcesados = 0;

        DB::beginTransaction();
        try {
            foreach ($chunks as $index => $chunk) {
                $records = [];

                foreach ($chunk as $item) {
                    if (!isset($item['Codigo']) || !isset($item['Nombre'])) {
                        continue;
                    }

                    $records[] = [
                        'codigo' => $item['Codigo'],
                        'descripcion' => $item['Nombre'],
                        'activo' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                if (!empty($records)) {
                    DB::table('codigos_cie10')->insert($records);
                    $totalProcesados += count($records);
                }

                $this->command->info("   Procesado lote " . ($index + 1) . "/" . count($chunks) . " ({$totalProcesados} códigos)");
            }

            DB::commit();
            $this->command->info("✅ {$totalProcesados} códigos CIE-10 migrados exitosamente");

        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error("❌ Error migrando CIE-10: " . $e->getMessage());
            Log::error('Error migrando CIE-10', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Migrar instituciones desde JSON
     */
    private function migrarInstituciones(): void
    {
        $this->command->info('🏥 Migrando instituciones...');

        $jsonPath = public_path('Prestservi.json');

        if (!file_exists($jsonPath)) {
            $this->command->error('❌ Archivo Prestservi.json no encontrado');
            return;
        }

        $prestserviData = json_decode(file_get_contents($jsonPath), true);

        if (!$prestserviData) {
            $this->command->error('❌ Error al decodificar Prestservi.json');
            return;
        }

        DB::beginTransaction();
        try {
            $totalProcesadas = 0;

            // Migrar IPS Nacional
            if (isset($prestserviData['IPS Nacional']) && is_array($prestserviData['IPS Nacional'])) {
                $this->command->info('   Migrando IPS Nacional...');
                $ipsNacional = $prestserviData['IPS Nacional'];
                $chunks = array_chunk($ipsNacional, 500);

                foreach ($chunks as $index => $chunk) {
                    $records = [];

                    foreach ($chunk as $item) {
                        if (empty($item['sede_nombre'])) {
                            continue;
                        }

                        $records[] = [
                            'tipo' => 'nacional',
                            'nombre' => $item['sede_nombre'],
                            'codigo_habilitacion' => $item['codigo_habilitacion'] ?? null,
                            'departamento' => $item['depa_nombre'] ?? null,
                            'municipio' => $item['muni_nombre'] ?? null,
                            'activo' => true,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }

                    if (!empty($records)) {
                        DB::table('instituciones')->insert($records);
                        $totalProcesadas += count($records);
                    }

                    $this->command->info("      Lote " . ($index + 1) . "/" . count($chunks) . " ({$totalProcesadas} IPS)");
                }

                $this->command->info("   ✅ {$totalProcesadas} IPS Nacional migradas");
            }

            // Migrar IPS Policía
            if (isset($prestserviData['IPS Policia Nacional']) && is_array($prestserviData['IPS Policia Nacional'])) {
                $this->command->info('   Migrando IPS Policía Nacional...');
                $ipsPolicia = $prestserviData['IPS Policia Nacional'];
                $chunks = array_chunk($ipsPolicia, 500);
                $totalPolicia = 0;

                foreach ($chunks as $index => $chunk) {
                    $records = [];

                    foreach ($chunk as $item) {
                        if (empty($item['NOMBRE'])) {
                            continue;
                        }

                        $records[] = [
                            'tipo' => 'policia',
                            'nombre' => $item['NOMBRE'],
                            'codigo_habilitacion' => null,
                            'departamento' => $item['DEPARTAMENTO'] ?? null,
                            'municipio' => null,
                            'activo' => true,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }

                    if (!empty($records)) {
                        DB::table('instituciones')->insert($records);
                        $totalPolicia += count($records);
                        $totalProcesadas += count($records);
                    }

                    $this->command->info("      Lote " . ($index + 1) . "/" . count($chunks) . " ({$totalPolicia} IPS Policía)");
                }

                $this->command->info("   ✅ {$totalPolicia} IPS Policía migradas");
            }

            DB::commit();
            $this->command->info("✅ Total: {$totalProcesadas} instituciones migradas exitosamente");

        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error("❌ Error migrando instituciones: " . $e->getMessage());
            Log::error('Error migrando instituciones', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Seed aseguradores predeterminados
     */
    private function seedAseguradores(): void
    {
        $this->command->info('🏢 Creando aseguradores predeterminados...');

        $aseguradores = [
            // EPS
            ['tipo' => 'eps', 'nombre' => 'NUEVA EPS'],
            ['tipo' => 'eps', 'nombre' => 'SURA EPS'],
            ['tipo' => 'eps', 'nombre' => 'SANITAS EPS'],
            ['tipo' => 'eps', 'nombre' => 'SALUD TOTAL'],
            ['tipo' => 'eps', 'nombre' => 'COMPENSAR'],
            ['tipo' => 'eps', 'nombre' => 'FAMISANAR'],
            ['tipo' => 'eps', 'nombre' => 'COLSANITAS'],
            
            // ARL
            ['tipo' => 'arl', 'nombre' => 'ARL SURA'],
            ['tipo' => 'arl', 'nombre' => 'POSITIVA'],
            ['tipo' => 'arl', 'nombre' => 'COLMENA'],
            
            // Otros
            ['tipo' => 'soat', 'nombre' => 'SOAT'],
            ['tipo' => 'adres', 'nombre' => 'ADRES'],
            ['tipo' => 'particular', 'nombre' => 'PARTICULAR'],
            ['tipo' => 'secretaria_salud_departamental', 'nombre' => 'SECRETARÍA DE SALUD DEPARTAMENTAL'],
            ['tipo' => 'secretaria_salud_distrital', 'nombre' => 'SECRETARÍA DE SALUD DISTRITAL'],
        ];

        foreach ($aseguradores as $asegurador) {
            Asegurador::firstOrCreate(
                ['tipo' => $asegurador['tipo'], 'nombre' => $asegurador['nombre']],
                ['activo' => true]
            );
        }

        $this->command->info("✅ " . count($aseguradores) . " aseguradores creados");
    }

    /**
     * Seed especialidades predeterminadas
     */
    private function seedEspecialidades(): void
    {
        $this->command->info('👨‍⚕️ Creando especialidades predeterminadas...');

        $especialidades = [
            'Anestesiología',
            'Cardiología',
            'Cirugía General',
            'Cirugía Pediátrica',
            'Dermatología',
            'Endocrinología',
            'Gastroenterología',
            'Geriatría',
            'Ginecología y Obstetricia',
            'Hematología',
            'Infectología',
            'Medicina Interna',
            'Nefrología',
            'Neumología',
            'Neurología',
            'Neurocirugía',
            'Oftalmología',
            'Oncología',
            'Ortopedia y Traumatología',
            'Otorrinolaringología',
            'Pediatría',
            'Psiquiatría',
            'Radiología',
            'Reumatología',
            'Urología',
            'Medicina de Urgencias',
            'Cuidado Intensivo',
        ];

        foreach ($especialidades as $nombre) {
            Especialidad::firstOrCreate(
                ['nombre' => $nombre],
                ['activo' => true, 'descripcion' => null]
            );
        }

        $this->command->info("✅ " . count($especialidades) . " especialidades creadas");
    }

    /**
     * Seed tipos de servicio predeterminados
     */
    private function seedTiposServicio(): void
    {
        $this->command->info('🏥 Creando tipos de servicio predeterminados...');

        $servicios = [
            ['codigo' => 'consulta_externa', 'nombre' => 'Consulta Externa'],
            ['codigo' => 'hospitalizacion', 'nombre' => 'Hospitalización'],
            ['codigo' => 'urgencias', 'nombre' => 'Urgencias'],
            ['codigo' => 'cirugia', 'nombre' => 'Cirugía'],
            ['codigo' => 'uci_adultos', 'nombre' => 'UCI Adultos'],
            ['codigo' => 'uci_pediatrica', 'nombre' => 'UCI Pediátrica'],
            ['codigo' => 'uci_neonatal', 'nombre' => 'UCI Neonatal'],
        ];

        foreach ($servicios as $servicio) {
            TipoServicio::firstOrCreate(
                ['codigo' => $servicio['codigo']],
                ['nombre' => $servicio['nombre'], 'activo' => true]
            );
        }

        $this->command->info("✅ " . count($servicios) . " tipos de servicio creados");
    }

    /**
     * Seed tipos de apoyo predeterminados
     */
    private function seedTiposApoyo(): void
    {
        $this->command->info('🔬 Creando tipos de apoyo predeterminados...');

        $apoyos = [
            ['codigo' => 'laboratorio', 'nombre' => 'Laboratorio Clínico'],
            ['codigo' => 'imagenes', 'nombre' => 'Imágenes Diagnósticas'],
            ['codigo' => 'terapias', 'nombre' => 'Terapias'],
            ['codigo' => 'medicamentos', 'nombre' => 'Medicamentos Especiales'],
        ];

        foreach ($apoyos as $apoyo) {
            TipoApoyo::firstOrCreate(
                ['codigo' => $apoyo['codigo']],
                ['nombre' => $apoyo['nombre'], 'activo' => true]
            );
        }

        $this->command->info("✅ " . count($apoyos) . " tipos de apoyo creados");
    }
}
