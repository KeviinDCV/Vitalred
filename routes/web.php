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

        Route::get('referencias', fn() => Inertia::render('admin/referencias'))->name('referencias');
        // Route::get('reportes', fn() => Inertia::render('admin/reportes'))->name('reportes'); // No se usa por ahora
        
        // Módulo de Configuración - Gestión de Catálogos
        Route::get('configuracion', [App\Http\Controllers\Admin\ConfiguracionController::class, 'index'])->name('configuracion');
        Route::get('configuracion/cie10', [App\Http\Controllers\Admin\ConfiguracionController::class, 'cie10'])->name('configuracion.cie10');
        Route::get('configuracion/instituciones', [App\Http\Controllers\Admin\ConfiguracionController::class, 'instituciones'])->name('configuracion.instituciones');
        Route::get('configuracion/aseguradores', [App\Http\Controllers\Admin\ConfiguracionController::class, 'aseguradores'])->name('configuracion.aseguradores');
        Route::get('configuracion/especialidades', [App\Http\Controllers\Admin\ConfiguracionController::class, 'especialidades'])->name('configuracion.especialidades');
        Route::get('configuracion/servicios', [App\Http\Controllers\Admin\ConfiguracionController::class, 'servicios'])->name('configuracion.servicios');
        Route::get('configuracion/apoyos', [App\Http\Controllers\Admin\ConfiguracionController::class, 'apoyos'])->name('configuracion.apoyos');
        
        // CRUD CIE-10
        Route::post('configuracion/cie10', [App\Http\Controllers\Admin\CIE10Controller::class, 'store'])->name('configuracion.cie10.store');
        Route::put('configuracion/cie10/{id}', [App\Http\Controllers\Admin\CIE10Controller::class, 'update'])->name('configuracion.cie10.update');
        Route::patch('configuracion/cie10/{id}/toggle', [App\Http\Controllers\Admin\CIE10Controller::class, 'toggleStatus'])->name('configuracion.cie10.toggle');
        Route::delete('configuracion/cie10/{id}', [App\Http\Controllers\Admin\CIE10Controller::class, 'destroy'])->name('configuracion.cie10.destroy');
        
        // CRUD Instituciones
        Route::post('configuracion/instituciones', [App\Http\Controllers\Admin\InstitucionController::class, 'store'])->name('configuracion.instituciones.store');
        Route::put('configuracion/instituciones/{id}', [App\Http\Controllers\Admin\InstitucionController::class, 'update'])->name('configuracion.instituciones.update');
        Route::patch('configuracion/instituciones/{id}/toggle', [App\Http\Controllers\Admin\InstitucionController::class, 'toggleStatus'])->name('configuracion.instituciones.toggle');
        Route::delete('configuracion/instituciones/{id}', [App\Http\Controllers\Admin\InstitucionController::class, 'destroy'])->name('configuracion.instituciones.destroy');
        
        // CRUD Aseguradores
        Route::post('configuracion/aseguradores', [App\Http\Controllers\Admin\AseguradorController::class, 'store'])->name('configuracion.aseguradores.store');
        Route::put('configuracion/aseguradores/{id}', [App\Http\Controllers\Admin\AseguradorController::class, 'update'])->name('configuracion.aseguradores.update');
        Route::patch('configuracion/aseguradores/{id}/toggle', [App\Http\Controllers\Admin\AseguradorController::class, 'toggleStatus'])->name('configuracion.aseguradores.toggle');
        Route::delete('configuracion/aseguradores/{id}', [App\Http\Controllers\Admin\AseguradorController::class, 'destroy'])->name('configuracion.aseguradores.destroy');
        
        // CRUD Especialidades
        Route::post('configuracion/especialidades', [App\Http\Controllers\Admin\EspecialidadController::class, 'store'])->name('configuracion.especialidades.store');
        Route::put('configuracion/especialidades/{id}', [App\Http\Controllers\Admin\EspecialidadController::class, 'update'])->name('configuracion.especialidades.update');
        Route::patch('configuracion/especialidades/{id}/toggle', [App\Http\Controllers\Admin\EspecialidadController::class, 'toggleStatus'])->name('configuracion.especialidades.toggle');
        Route::delete('configuracion/especialidades/{id}', [App\Http\Controllers\Admin\EspecialidadController::class, 'destroy'])->name('configuracion.especialidades.destroy');
        
        // CRUD Tipos de Servicio
        Route::post('configuracion/servicios', [App\Http\Controllers\Admin\TipoServicioController::class, 'store'])->name('configuracion.servicios.store');
        Route::put('configuracion/servicios/{id}', [App\Http\Controllers\Admin\TipoServicioController::class, 'update'])->name('configuracion.servicios.update');
        Route::patch('configuracion/servicios/{id}/toggle', [App\Http\Controllers\Admin\TipoServicioController::class, 'toggleStatus'])->name('configuracion.servicios.toggle');
        Route::delete('configuracion/servicios/{id}', [App\Http\Controllers\Admin\TipoServicioController::class, 'destroy'])->name('configuracion.servicios.destroy');
        
        // CRUD Tipos de Apoyo
        Route::post('configuracion/apoyos', [App\Http\Controllers\Admin\TipoApoyoController::class, 'store'])->name('configuracion.apoyos.store');
        Route::put('configuracion/apoyos/{id}', [App\Http\Controllers\Admin\TipoApoyoController::class, 'update'])->name('configuracion.apoyos.update');
        Route::patch('configuracion/apoyos/{id}/toggle', [App\Http\Controllers\Admin\TipoApoyoController::class, 'toggleStatus'])->name('configuracion.apoyos.toggle');
        Route::delete('configuracion/apoyos/{id}', [App\Http\Controllers\Admin\TipoApoyoController::class, 'destroy'])->name('configuracion.apoyos.destroy');

        Route::get('buscar-registros', [App\Http\Controllers\Admin\DashboardController::class, 'buscarRegistros'])->name('buscar-registros');
        Route::get('descargar-historia/{registro}', [App\Http\Controllers\Admin\DashboardController::class, 'descargarHistoria'])->name('descargar-historia');

        // Admin puede acceder a todas las rutas de médico bajo /admin/medico/*
        Route::prefix('medico')->name('medico.')->group(function () {
            Route::get('dashboard', fn() => redirect('/admin/medico/ingresar-registro'))->name('dashboard');
            
            Route::get('ingresar-registro', [App\Http\Controllers\Medico\MedicoController::class, 'ingresarRegistro'])->name('ingresar-registro');
            Route::post('ingresar-registro', [App\Http\Controllers\Medico\MedicoController::class, 'storeRegistro'])->name('ingresar-registro.store');
            Route::get('consulta-pacientes', [App\Http\Controllers\Medico\MedicoController::class, 'consultaPacientes'])->name('consulta-pacientes');
            Route::get('buscar-pacientes', [App\Http\Controllers\Medico\MedicoController::class, 'buscarPacientes'])->name('buscar-pacientes');
            Route::get('descargar-historia/{registro}', [App\Http\Controllers\Medico\MedicoController::class, 'descargarHistoria'])->name('descargar-historia');
            
            // Acciones de casos
            Route::post('atender-caso/{registro}', [App\Http\Controllers\Medico\MedicoController::class, 'atenderCaso'])->name('atender-caso');
            Route::post('rechazar-caso/{registro}', [App\Http\Controllers\Medico\MedicoController::class, 'rechazarCaso'])->name('rechazar-caso');

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
            Route::get('dashboard', fn() => redirect('/admin/ips/ingresar-registro'))->name('dashboard');
            Route::get('ingresar-registro', [App\Http\Controllers\Ips\IpsController::class, 'ingresarRegistro'])->name('ingresar-registro');
            Route::post('ingresar-registro', [App\Http\Controllers\Ips\IpsController::class, 'storeRegistro'])->name('ingresar-registro.store');
            Route::get('consulta-pacientes', [App\Http\Controllers\Ips\IpsController::class, 'consultaPacientes'])->name('consulta-pacientes');
            
            // Rutas de IA
            Route::post('ai/extraer-datos-documento', [App\Http\Controllers\Medico\PriorizacionController::class, 'extraerDatosPaciente'])->name('ai.extraer-datos-documento');
            
            // Notificaciones en tiempo real
            Route::get('notificaciones/no-leidas', [App\Http\Controllers\NotificacionController::class, 'getNoLeidas'])->name('notificaciones.no-leidas');
            Route::post('notificaciones/{notificacion}/marcar-leida', [App\Http\Controllers\NotificacionController::class, 'marcarComoLeida'])->name('notificaciones.marcar-leida');
            Route::post('notificaciones/marcar-todas-leidas', [App\Http\Controllers\NotificacionController::class, 'marcarTodasComoLeidas'])->name('notificaciones.marcar-todas-leidas');
        });
    });

    // Rutas para Médico (solo médicos, admin ya tiene acceso arriba)
    Route::middleware('medico')->prefix('medico')->name('medico.')->group(function () {
        Route::get('dashboard', fn() => redirect('/medico/ingresar-registro'))->name('dashboard');
        
        Route::get('ingresar-registro', [App\Http\Controllers\Medico\MedicoController::class, 'ingresarRegistro'])->name('ingresar-registro');
        Route::post('ingresar-registro', [App\Http\Controllers\Medico\MedicoController::class, 'storeRegistro'])->name('ingresar-registro.store');
        Route::get('consulta-pacientes', [App\Http\Controllers\Medico\MedicoController::class, 'consultaPacientes'])->name('consulta-pacientes');
        Route::get('buscar-pacientes', [App\Http\Controllers\Medico\MedicoController::class, 'buscarPacientes'])->name('buscar-pacientes');
        Route::get('descargar-historia/{registro}', [App\Http\Controllers\Medico\MedicoController::class, 'descargarHistoria'])->name('descargar-historia');
        
        // Acciones de casos
        Route::post('atender-caso/{registro}', [App\Http\Controllers\Medico\MedicoController::class, 'atenderCaso'])->name('atender-caso');
        Route::post('rechazar-caso/{registro}', [App\Http\Controllers\Medico\MedicoController::class, 'rechazarCaso'])->name('rechazar-caso');

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
        Route::get('dashboard', fn() => redirect('/ips/ingresar-registro'))->name('dashboard');
        Route::get('ingresar-registro', [App\Http\Controllers\Ips\IpsController::class, 'ingresarRegistro'])->name('ingresar-registro');
        Route::post('ingresar-registro', [App\Http\Controllers\Ips\IpsController::class, 'storeRegistro'])->name('ingresar-registro.store');
        Route::get('consulta-pacientes', [App\Http\Controllers\Ips\IpsController::class, 'consultaPacientes'])->name('consulta-pacientes');
        
        // Rutas de IA (IPS necesita las mismas funcionalidades que médico)
        Route::post('ai/extraer-datos-documento', [App\Http\Controllers\Medico\PriorizacionController::class, 'extraerDatosPaciente'])->name('ai.extraer-datos-documento');
        
        // Notificaciones en tiempo real
        Route::get('notificaciones/no-leidas', [App\Http\Controllers\NotificacionController::class, 'getNoLeidas'])->name('notificaciones.no-leidas');
        Route::post('notificaciones/{notificacion}/marcar-leida', [App\Http\Controllers\NotificacionController::class, 'marcarComoLeida'])->name('notificaciones.marcar-leida');
        Route::post('notificaciones/marcar-todas-leidas', [App\Http\Controllers\NotificacionController::class, 'marcarTodasComoLeidas'])->name('notificaciones.marcar-todas-leidas');
    });
    
    // Rutas compartidas
    Route::get('notificaciones', fn() => Inertia::render('shared/notificaciones'))->name('notificaciones');
    Route::get('perfil', fn() => Inertia::render('shared/perfil'))->name('perfil');
});

require __DIR__.'/settings.php';

// Rutas de autenticación con rate limiting
Route::middleware('throttle:5,1')->group(function () {
    require __DIR__.'/auth.php';
});