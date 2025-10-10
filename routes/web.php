<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [App\Http\Controllers\WelcomeController::class, 'index'])->name('home');
Route::get('/welcome', [App\Http\Controllers\WelcomeController::class, 'index'])->name('welcome');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();
        if ($user->role === 'administrador') {
            return app(App\Http\Controllers\Admin\DashboardController::class)->index(request());
        } elseif ($user->role === 'ips') {
            return redirect()->route('ips.dashboard');
        } else {
            return redirect()->route('medico.ingresar-registro');
        }
    })->name('dashboard');

    // Rutas para Administrador - Acceso completo a todo el sistema
    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        // Rutas específicas de administrador
        Route::get('usuarios', [App\Http\Controllers\Admin\UsuarioController::class, 'index'])->name('usuarios');
        Route::post('usuarios', [App\Http\Controllers\Admin\UsuarioController::class, 'store'])->name('usuarios.store');
        Route::put('usuarios/{usuario}', [App\Http\Controllers\Admin\UsuarioController::class, 'update'])->name('usuarios.update');
        Route::patch('usuarios/{usuario}/toggle-status', [App\Http\Controllers\Admin\UsuarioController::class, 'toggleStatus'])->name('usuarios.toggle-status');
        Route::delete('usuarios/{usuario}', [App\Http\Controllers\Admin\UsuarioController::class, 'destroy'])->name('usuarios.destroy');


        Route::get('referencias', [App\Http\Controllers\Admin\ReferenciasController::class, 'index'])->name('referencias');
        Route::get('reportes', [App\Http\Controllers\Admin\ReportesController::class, 'index'])->name('reportes');
        Route::post('reportes/generar', [App\Http\Controllers\Admin\ReportesController::class, 'generar'])->name('reportes.generar');
        Route::get('monitoreo', [App\Http\Controllers\Admin\MonitoreoController::class, 'index'])->name('monitoreo');
        Route::get('ia', [App\Http\Controllers\Admin\IAController::class, 'index'])->name('ia');
        Route::get('configuracion', [App\Http\Controllers\Admin\ConfiguracionController::class, 'index'])->name('configuracion');
        Route::post('configuracion', [App\Http\Controllers\Admin\ConfiguracionController::class, 'update'])->name('configuracion.update');
        Route::get('supervision', [App\Http\Controllers\Admin\SupervisionController::class, 'index'])->name('supervision');

        Route::get('buscar-registros', [App\Http\Controllers\Admin\DashboardController::class, 'buscarRegistros'])->name('buscar-registros');
        Route::get('descargar-historia/{registro}', [App\Http\Controllers\Admin\DashboardController::class, 'descargarHistoria'])->name('descargar-historia');

        // Admin puede acceder a todas las rutas de médico bajo /admin/medico/*
        Route::prefix('medico')->name('medico.')->group(function () {
            Route::get('dashboard', [App\Http\Controllers\Medico\MedicoDashboardController::class, 'index'])->name('dashboard');
            Route::get('casos-criticos', [App\Http\Controllers\Medico\CasosCriticosController::class, 'index'])->name('casos-criticos');
            Route::get('seguimiento', [App\Http\Controllers\Medico\SeguimientoController::class, 'index'])->name('seguimiento');
            
            Route::get('ingresar-registro', [App\Http\Controllers\Medico\MedicoController::class, 'ingresarRegistro'])->name('ingresar-registro');
            Route::post('ingresar-registro', [App\Http\Controllers\Medico\MedicoController::class, 'storeRegistro'])->name('ingresar-registro.store');
            Route::get('consulta-pacientes', [App\Http\Controllers\Medico\MedicoController::class, 'consultaPacientes'])->name('consulta-pacientes');
            Route::get('buscar-pacientes', [App\Http\Controllers\Medico\MedicoController::class, 'buscarPacientes'])->name('buscar-pacientes');
            Route::get('descargar-historia/{registro}', [App\Http\Controllers\Medico\MedicoController::class, 'descargarHistoria'])->name('descargar-historia');

            // IA y Priorización
            Route::post('ai/extract-patient-data', [App\Http\Controllers\AIController::class, 'extractPatientData'])->name('ai.extract-patient-data');
            Route::post('ai/test-text-extraction', [App\Http\Controllers\AIController::class, 'testTextExtraction'])->name('ai.test-text-extraction');
            Route::post('ai/test-gemini', [App\Http\Controllers\AIController::class, 'testGeminiAPI'])->name('ai.test-gemini');
            
            Route::get('priorizacion/prueba', [App\Http\Controllers\Medico\PriorizacionController::class, 'pruebaAlgoritmo'])->name('priorizacion.prueba');
            Route::post('priorizacion/prueba', [App\Http\Controllers\Medico\PriorizacionController::class, 'procesarArchivoPrueba'])->name('priorizacion.prueba.procesar');
            Route::get('priorizacion/carga-archivo', [App\Http\Controllers\Medico\PriorizacionController::class, 'mostrarCargaArchivo'])->name('priorizacion.carga-archivo');
            Route::get('priorizacion/analisis/{id}', [App\Http\Controllers\Medico\PriorizacionController::class, 'mostrarAnalisis'])->name('priorizacion.analisis');
            Route::post('priorizacion/analizar', [App\Http\Controllers\Medico\PriorizacionController::class, 'analizarPriorizacion'])->name('priorizacion.analizar');
            Route::post('priorizacion/lote', [App\Http\Controllers\Medico\PriorizacionController::class, 'analizarLote'])->name('priorizacion.lote');
            Route::post('priorizacion/actualizar/{id}', [App\Http\Controllers\Medico\PriorizacionController::class, 'actualizarPriorizacion'])->name('priorizacion.actualizar');
            Route::post('ai/extraer-datos-documento', [App\Http\Controllers\Medico\PriorizacionController::class, 'extraerDatosPaciente'])->name('ai.extraer-datos-documento');
            Route::post('priorizacion/debug-analisis', [App\Http\Controllers\Medico\PriorizacionController::class, 'debugAnalisis'])->name('priorizacion.debug-analisis');
            Route::post('priorizacion/analizar-sin-ia', [App\Http\Controllers\Medico\PriorizacionController::class, 'analizarSinIA'])->name('priorizacion.analizar-sin-ia');
            Route::get('priorizacion/test-gemini', [App\Http\Controllers\Medico\PriorizacionController::class, 'testGeminiIA'])->name('priorizacion.test-gemini');
            Route::post('priorizacion/guardar-analisis-manual', [App\Http\Controllers\Medico\PriorizacionController::class, 'guardarAnalisisManual'])->name('priorizacion.guardar-analisis-manual');
            Route::get('priorizacion/listar-analisis-guardados', [App\Http\Controllers\Medico\PriorizacionController::class, 'listarAnalisisGuardados'])->name('priorizacion.listar-analisis-guardados');
            
            // Rutas adicionales para análisis de priorización
            Route::get('analisis-priorizacion', [App\Http\Controllers\Medico\AnalisisPriorizacionController::class, 'index'])->name('analisis-priorizacion');
            Route::get('analisis-priorizacion-campos', [App\Http\Controllers\Medico\AnalisisPriorizacionController::class, 'campos'])->name('analisis-priorizacion-campos');
            Route::get('analisis-priorizacion-nueva', [App\Http\Controllers\Medico\AnalisisPriorizacionController::class, 'nueva'])->name('analisis-priorizacion-nueva');
            Route::get('carga-analisis-ia', [App\Http\Controllers\Medico\AnalisisPriorizacionController::class, 'cargaIA'])->name('carga-analisis-ia');
            Route::post('analisis-priorizacion', [App\Http\Controllers\Medico\AnalisisPriorizacionController::class, 'store'])->name('analisis-priorizacion.store');
        });

        // Admin puede acceder a todas las rutas de IPS bajo /admin/ips/*
        Route::prefix('ips')->name('ips.')->group(function () {
            Route::get('dashboard', [App\Http\Controllers\Ips\IpsController::class, 'dashboard'])->name('dashboard');
            Route::get('ingresar-registro', [App\Http\Controllers\Ips\IpsController::class, 'ingresarRegistro'])->name('ingresar-registro');
            Route::get('solicitudes', [App\Http\Controllers\Ips\IpsController::class, 'solicitudes'])->name('solicitudes');
            Route::post('solicitudes', [App\Http\Controllers\Ips\IpsController::class, 'crearSolicitud'])->name('solicitudes.store');
            Route::patch('solicitudes/{solicitud}', [App\Http\Controllers\Ips\IpsController::class, 'actualizarSolicitud'])->name('solicitudes.update');
            Route::get('seguimiento', [App\Http\Controllers\Ips\IpsController::class, 'seguimiento'])->name('seguimiento');
        });
    });

    // Rutas para Médico (solo médicos, admin ya tiene acceso arriba)
    Route::middleware('medico')->prefix('medico')->name('medico.')->group(function () {
        Route::get('dashboard', [App\Http\Controllers\Medico\MedicoDashboardController::class, 'index'])->name('dashboard');
        Route::get('casos-criticos', [App\Http\Controllers\Medico\CasosCriticosController::class, 'index'])->name('casos-criticos');
        Route::get('seguimiento', [App\Http\Controllers\Medico\SeguimientoController::class, 'index'])->name('seguimiento');
        
        Route::get('ingresar-registro', [App\Http\Controllers\Medico\MedicoController::class, 'ingresarRegistro'])->name('ingresar-registro');
        Route::post('ingresar-registro', [App\Http\Controllers\Medico\MedicoController::class, 'storeRegistro'])->name('ingresar-registro.store');
        Route::get('consulta-pacientes', [App\Http\Controllers\Medico\MedicoController::class, 'consultaPacientes'])->name('consulta-pacientes');
        Route::get('buscar-pacientes', [App\Http\Controllers\Medico\MedicoController::class, 'buscarPacientes'])->name('buscar-pacientes');
        Route::get('descargar-historia/{registro}', [App\Http\Controllers\Medico\MedicoController::class, 'descargarHistoria'])->name('descargar-historia');

        // IA y Priorización
        Route::post('ai/extract-patient-data', [App\Http\Controllers\AIController::class, 'extractPatientData'])->name('ai.extract-patient-data');
        Route::post('ai/test-text-extraction', [App\Http\Controllers\AIController::class, 'testTextExtraction'])->name('ai.test-text-extraction');
        Route::post('ai/test-gemini', [App\Http\Controllers\AIController::class, 'testGeminiAPI'])->name('ai.test-gemini');
        
        Route::get('priorizacion/prueba', [App\Http\Controllers\Medico\PriorizacionController::class, 'pruebaAlgoritmo'])->name('priorizacion.prueba');
        Route::post('priorizacion/prueba', [App\Http\Controllers\Medico\PriorizacionController::class, 'procesarArchivoPrueba'])->name('priorizacion.prueba.procesar');
        Route::get('priorizacion/carga-archivo', [App\Http\Controllers\Medico\PriorizacionController::class, 'mostrarCargaArchivo'])->name('priorizacion.carga-archivo');
        Route::get('priorizacion/analisis/{id}', [App\Http\Controllers\Medico\PriorizacionController::class, 'mostrarAnalisis'])->name('priorizacion.analisis');
        Route::post('priorizacion/analizar', [App\Http\Controllers\Medico\PriorizacionController::class, 'analizarPriorizacion'])->name('priorizacion.analizar');
        Route::post('priorizacion/lote', [App\Http\Controllers\Medico\PriorizacionController::class, 'analizarLote'])->name('priorizacion.lote');
        Route::post('priorizacion/actualizar/{id}', [App\Http\Controllers\Medico\PriorizacionController::class, 'actualizarPriorizacion'])->name('priorizacion.actualizar');
        Route::post('ai/extraer-datos-documento', [App\Http\Controllers\Medico\PriorizacionController::class, 'extraerDatosPaciente'])->name('ai.extraer-datos-documento');
        Route::post('priorizacion/debug-analisis', [App\Http\Controllers\Medico\PriorizacionController::class, 'debugAnalisis'])->name('priorizacion.debug-analisis');
        Route::post('priorizacion/analizar-sin-ia', [App\Http\Controllers\Medico\PriorizacionController::class, 'analizarSinIA'])->name('priorizacion.analizar-sin-ia');
        Route::get('priorizacion/test-gemini', [App\Http\Controllers\Medico\PriorizacionController::class, 'testGeminiIA'])->name('priorizacion.test-gemini');
        Route::post('priorizacion/guardar-analisis-manual', [App\Http\Controllers\Medico\PriorizacionController::class, 'guardarAnalisisManual'])->name('priorizacion.guardar-analisis-manual');
        Route::get('priorizacion/listar-analisis-guardados', [App\Http\Controllers\Medico\PriorizacionController::class, 'listarAnalisisGuardados'])->name('priorizacion.listar-analisis-guardados');
        
        // Rutas adicionales para análisis de priorización
        Route::get('analisis-priorizacion', [App\Http\Controllers\Medico\AnalisisPriorizacionController::class, 'index'])->name('analisis-priorizacion');
        Route::get('analisis-priorizacion-campos', [App\Http\Controllers\Medico\AnalisisPriorizacionController::class, 'campos'])->name('analisis-priorizacion-campos');
        Route::get('analisis-priorizacion-nueva', [App\Http\Controllers\Medico\AnalisisPriorizacionController::class, 'nueva'])->name('analisis-priorizacion-nueva');
        Route::get('carga-analisis-ia', [App\Http\Controllers\Medico\AnalisisPriorizacionController::class, 'cargaIA'])->name('carga-analisis-ia');
        Route::post('analisis-priorizacion', [App\Http\Controllers\Medico\AnalisisPriorizacionController::class, 'store'])->name('analisis-priorizacion.store');
    });

    // Rutas para IPS (solo IPS, admin ya tiene acceso arriba)
    Route::middleware('ips')->prefix('ips')->name('ips.')->group(function () {
        Route::get('dashboard', [App\Http\Controllers\Ips\IpsController::class, 'dashboard'])->name('dashboard');
        Route::get('ingresar-registro', [App\Http\Controllers\Ips\IpsController::class, 'ingresarRegistro'])->name('ingresar-registro');
        Route::post('ingresar-registro', [App\Http\Controllers\Medico\MedicoIpsController::class, 'storeRegistroIps'])->name('ingresar-registro.store');
        Route::get('solicitudes', [App\Http\Controllers\Ips\IpsController::class, 'solicitudes'])->name('solicitudes');
        Route::post('solicitudes', [App\Http\Controllers\Ips\IpsController::class, 'crearSolicitud'])->name('solicitudes.store');
        Route::patch('solicitudes/{solicitud}', [App\Http\Controllers\Ips\IpsController::class, 'actualizarSolicitud'])->name('solicitudes.update');
        Route::get('seguimiento', [App\Http\Controllers\Ips\IpsController::class, 'seguimiento'])->name('seguimiento');
    });
    
    // Rutas compartidas
    Route::get('notificaciones', [App\Http\Controllers\Shared\NotificacionesController::class, 'index'])->name('notificaciones');
    Route::patch('notificaciones/{id}/leida', [App\Http\Controllers\Shared\NotificacionesController::class, 'marcarLeida'])->name('notificaciones.marcar-leida');
    Route::patch('notificaciones/todas-leidas', [App\Http\Controllers\Shared\NotificacionesController::class, 'marcarTodasLeidas'])->name('notificaciones.todas-leidas');
    Route::get('perfil', [App\Http\Controllers\Shared\PerfilController::class, 'index'])->name('perfil');
    Route::patch('perfil', [App\Http\Controllers\Shared\PerfilController::class, 'update'])->name('perfil.update');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';