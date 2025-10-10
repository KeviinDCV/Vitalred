<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

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

        Route::get('supervision', fn() => Inertia::render('admin/supervision'))->name('supervision');
        Route::get('referencias', fn() => Inertia::render('admin/referencias'))->name('referencias');
        Route::get('reportes', fn() => Inertia::render('admin/reportes'))->name('reportes');
        Route::get('monitoreo', fn() => Inertia::render('admin/monitoreo'))->name('monitoreo');
        Route::get('ia', fn() => Inertia::render('admin/ia'))->name('ia');
        Route::get('configuracion', fn() => Inertia::render('admin/configuracion'))->name('configuracion');

        Route::get('buscar-registros', [App\Http\Controllers\Admin\DashboardController::class, 'buscarRegistros'])->name('buscar-registros');
        Route::get('descargar-historia/{registro}', [App\Http\Controllers\Admin\DashboardController::class, 'descargarHistoria'])->name('descargar-historia');

        // Admin puede acceder a todas las rutas de médico bajo /admin/medico/*
        Route::prefix('medico')->name('medico.')->group(function () {
            Route::get('dashboard', fn() => Inertia::render('medico/medico-dashboard'))->name('dashboard');
            Route::get('casos-criticos', fn() => Inertia::render('medico/casos-criticos'))->name('casos-criticos');
            Route::get('seguimiento', fn() => Inertia::render('medico/seguimiento'))->name('seguimiento');
            
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
        Route::get('dashboard', fn() => Inertia::render('medico/medico-dashboard'))->name('dashboard');
        Route::get('casos-criticos', fn() => Inertia::render('medico/casos-criticos'))->name('casos-criticos');
        Route::get('seguimiento', fn() => Inertia::render('medico/seguimiento'))->name('seguimiento');
        
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
    Route::get('notificaciones', fn() => Inertia::render('shared/notificaciones'))->name('notificaciones');
    Route::get('perfil', fn() => Inertia::render('shared/perfil'))->name('perfil');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';