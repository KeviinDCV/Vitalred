<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Configuracion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConfiguracionController extends Controller
{
    public function index()
    {
        $configuraciones = Configuracion::all()->groupBy('categoria');
        
        return Inertia::render('admin/configuracion', [
            'configuraciones' => $configuraciones,
            'user' => auth()->user(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'configuraciones' => 'required|array',
            'configuraciones.*.clave' => 'required|string',
            'configuraciones.*.valor' => 'required',
        ]);

        foreach ($validated['configuraciones'] as $config) {
            Configuracion::where('clave', $config['clave'])
                ->update(['valor' => $config['valor']]);
        }
        
        return back()->with('success', 'Configuración actualizada exitosamente');
    }
}