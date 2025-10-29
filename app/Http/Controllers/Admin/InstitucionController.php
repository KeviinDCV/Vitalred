<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Institucion;
use Illuminate\Http\Request;

class InstitucionController extends Controller
{
    /**
     * Crear una nueva institución
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tipo' => 'required|in:nacional,policia',
            'nombre' => 'required|string|max:255',
            'codigo_habilitacion' => 'nullable|string|max:50',
            'departamento' => 'nullable|string|max:100',
            'municipio' => 'nullable|string|max:100',
        ], [
            'tipo.required' => 'El tipo es obligatorio',
            'nombre.required' => 'El nombre es obligatorio',
        ]);

        Institucion::create([
            'tipo' => $validated['tipo'],
            'nombre' => strtoupper($validated['nombre']),
            'codigo_habilitacion' => $validated['codigo_habilitacion'] ?? null,
            'departamento' => $validated['departamento'] ?? null,
            'municipio' => $validated['municipio'] ?? null,
            'activo' => true,
        ]);

        return redirect()->back()->with('success', 'Institución creada exitosamente');
    }

    /**
     * Actualizar una institución
     */
    public function update(Request $request, $id)
    {
        $institucion = Institucion::findOrFail($id);

        $validated = $request->validate([
            'tipo' => 'required|in:nacional,policia',
            'nombre' => 'required|string|max:255',
            'codigo_habilitacion' => 'nullable|string|max:50',
            'departamento' => 'nullable|string|max:100',
            'municipio' => 'nullable|string|max:100',
        ], [
            'tipo.required' => 'El tipo es obligatorio',
            'nombre.required' => 'El nombre es obligatorio',
        ]);

        $institucion->update([
            'tipo' => $validated['tipo'],
            'nombre' => strtoupper($validated['nombre']),
            'codigo_habilitacion' => $validated['codigo_habilitacion'] ?? null,
            'departamento' => $validated['departamento'] ?? null,
            'municipio' => $validated['municipio'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Institución actualizada exitosamente');
    }

    /**
     * Cambiar estado activo/inactivo
     */
    public function toggleStatus($id)
    {
        $institucion = Institucion::findOrFail($id);
        
        $institucion->update([
            'activo' => !$institucion->activo
        ]);

        $mensaje = $institucion->activo ? 'activada' : 'desactivada';
        return redirect()->back()->with('success', "Institución {$mensaje} exitosamente");
    }

    /**
     * Eliminar permanentemente
     */
    public function destroy($id)
    {
        $institucion = Institucion::findOrFail($id);
        $institucion->delete();

        return redirect()->back()->with('success', 'Institución eliminada exitosamente');
    }
}
