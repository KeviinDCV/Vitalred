<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // Redirigir automáticamente al login para aplicación médica
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Redirección basada en rol desde dashboard
    Route::get('dashboard', function () {
        $user = auth()->user();

        if ($user->role === 'administrador') {
            return app(App\Http\Controllers\Admin\DashboardController::class)->index(request());
        } else {
            // Médicos van directamente a Ingresar Registro
            return redirect()->route('medico.ingresar-registro');
        }
    })->name('dashboard');

    // Rutas para Administrador
    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('usuarios', [App\Http\Controllers\Admin\UsuarioController::class, 'index'])->name('usuarios');
        Route::post('usuarios', [App\Http\Controllers\Admin\UsuarioController::class, 'store'])->name('usuarios.store');
        Route::put('usuarios/{usuario}', [App\Http\Controllers\Admin\UsuarioController::class, 'update'])->name('usuarios.update');
        Route::patch('usuarios/{usuario}/toggle-status', [App\Http\Controllers\Admin\UsuarioController::class, 'toggleStatus'])->name('usuarios.toggle-status');
        Route::delete('usuarios/{usuario}', [App\Http\Controllers\Admin\UsuarioController::class, 'destroy'])->name('usuarios.destroy');

        Route::get('supervision', function () {
            return Inertia::render('admin/supervision');
        })->name('supervision');

        // Rutas para dashboard de administrador
        Route::get('buscar-registros', [App\Http\Controllers\Admin\DashboardController::class, 'buscarRegistros'])->name('buscar-registros');
        Route::get('descargar-historia/{registro}', [App\Http\Controllers\Admin\DashboardController::class, 'descargarHistoria'])->name('descargar-historia');
    });

    // Rutas para Médico
    Route::middleware('medico')->prefix('medico')->name('medico.')->group(function () {
        Route::get('ingresar-registro', [App\Http\Controllers\Medico\MedicoController::class, 'ingresarRegistro'])->name('ingresar-registro');
        Route::post('ingresar-registro', [App\Http\Controllers\Medico\MedicoController::class, 'storeRegistro'])->name('ingresar-registro.store');
        Route::get('consulta-pacientes', [App\Http\Controllers\Medico\MedicoController::class, 'consultaPacientes'])->name('consulta-pacientes');
        Route::get('buscar-pacientes', [App\Http\Controllers\Medico\MedicoController::class, 'buscarPacientes'])->name('buscar-pacientes');
        Route::get('descargar-historia/{registro}', [App\Http\Controllers\Medico\MedicoController::class, 'descargarHistoria'])->name('descargar-historia');

        // Rutas para IA
        Route::post('ai/extract-patient-data', [App\Http\Controllers\AIController::class, 'extractPatientData'])->name('ai.extract-patient-data');
        Route::post('ai/test-text-extraction', [App\Http\Controllers\AIController::class, 'testTextExtraction'])->name('ai.test-text-extraction');
        Route::post('ai/test-gemini', [App\Http\Controllers\AIController::class, 'testGeminiAPI'])->name('ai.test-gemini');

        // Rutas para Priorización IA
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
        
        // Rutas para análisis manual (pruebas)
        Route::post('priorizacion/guardar-analisis-manual', [App\Http\Controllers\Medico\PriorizacionController::class, 'guardarAnalisisManual'])->name('priorizacion.guardar-analisis-manual');
        Route::get('priorizacion/listar-analisis-guardados', [App\Http\Controllers\Medico\PriorizacionController::class, 'listarAnalisisGuardados'])->name('priorizacion.listar-analisis-guardados');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';