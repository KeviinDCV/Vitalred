<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TipoServicio;
use Illuminate\Http\Request;

class TipoServicioController extends Controller
{
    /**
     * Crear un nuevo tipo de servicio
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigo' => 'required|string|max:20|unique:tipos_servicio,codigo',
            'nombre' => 'required|string|max:255',
        ], [
            'codigo.required' => 'El código es obligatorio',
            'codigo.unique' => 'Este código ya existe',
            'nombre.required' => 'El nombre es obligatorio',
        ]);

        TipoServicio::create([
            'codigo' => strtoupper($validated['codigo']),
            'nombre' => strtoupper($validated['nombre']),
            'activo' => true,
        ]);

        return redirect()->back()->with('success', 'Tipo de servicio creado exitosamente');
    }

    /**
     * Actualizar un tipo de servicio
     */
    public function update(Request $request, $id)
    {
        $tipoServicio = TipoServicio::findOrFail($id);

        $validated = $request->validate([
            'codigo' => 'required|string|max:20|unique:tipos_servicio,codigo,' . $id,
            'nombre' => 'required|string|max:255',
        ], [
            'codigo.required' => 'El código es obligatorio',
            'codigo.unique' => 'Este código ya existe',
            'nombre.required' => 'El nombre es obligatorio',
        ]);

        $tipoServicio->update([
            'codigo' => strtoupper($validated['codigo']),
            'nombre' => strtoupper($validated['nombre']),
        ]);

        return redirect()->back()->with('success', 'Tipo de servicio actualizado exitosamente');
    }

    /**
     * Cambiar estado activo/inactivo
     */
    public function toggleStatus($id)
    {
        $tipoServicio = TipoServicio::findOrFail($id);
        
        $tipoServicio->update([
            'activo' => !$tipoServicio->activo
        ]);

        $mensaje = $tipoServicio->activo ? 'activado' : 'desactivado';
        return redirect()->back()->with('success', "Tipo de servicio {$mensaje} exitosamente");
    }

    /**
     * Eliminar permanentemente
     */
    public function destroy($id)
    {
        $tipoServicio = TipoServicio::findOrFail($id);
        $tipoServicio->delete();

        return redirect()->back()->with('success', 'Tipo de servicio eliminado exitosamente');
    }
}
