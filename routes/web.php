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
            return Inertia::render('dashboard');
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
    });

    // Rutas para Médico
    Route::middleware('medico')->prefix('medico')->name('medico.')->group(function () {
        Route::get('ingresar-registro', [App\Http\Controllers\Medico\MedicoController::class, 'ingresarRegistro'])->name('ingresar-registro');
        Route::get('consulta-pacientes', [App\Http\Controllers\Medico\MedicoController::class, 'consultaPacientes'])->name('consulta-pacientes');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
