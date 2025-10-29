<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Especialidad;
use Illuminate\Http\Request;

class EspecialidadController extends Controller
{
    /**
     * Crear una nueva especialidad
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:especialidades,nombre',
            'descripcion' => 'nullable|string|max:500',
        ], [
            'nombre.required' => 'El nombre es obligatorio',
            'nombre.unique' => 'Esta especialidad ya existe',
        ]);

        Especialidad::create([
            'nombre' => strtoupper($validated['nombre']),
            'descripcion' => $validated['descripcion'] ?? null,
            'activo' => true,
        ]);

        return redirect()->back()->with('success', 'Especialidad creada exitosamente');
    }

    /**
     * Actualizar una especialidad
     */
    public function update(Request $request, $id)
    {
        $especialidad = Especialidad::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:especialidades,nombre,' . $id,
            'descripcion' => 'nullable|string|max:500',
        ], [
            'nombre.required' => 'El nombre es obligatorio',
            'nombre.unique' => 'Esta especialidad ya existe',
        ]);

        $especialidad->update([
            'nombre' => strtoupper($validated['nombre']),
            'descripcion' => $validated['descripcion'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Especialidad actualizada exitosamente');
    }

    /**
     * Cambiar estado activo/inactivo
     */
    public function toggleStatus($id)
    {
        $especialidad = Especialidad::findOrFail($id);
        
        $especialidad->update([
            'activo' => !$especialidad->activo
        ]);

        $mensaje = $especialidad->activo ? 'activada' : 'desactivada';
        return redirect()->back()->with('success', "Especialidad {$mensaje} exitosamente");
    }

    /**
     * Eliminar permanentemente
     */
    public function destroy($id)
    {
        $especialidad = Especialidad::findOrFail($id);
        $especialidad->delete();

        return redirect()->back()->with('success', 'Especialidad eliminada exitosamente');
    }
}
