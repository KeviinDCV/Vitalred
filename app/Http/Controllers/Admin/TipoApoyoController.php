<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TipoApoyo;
use Illuminate\Http\Request;

class TipoApoyoController extends Controller
{
    /**
     * Crear un nuevo tipo de apoyo
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigo' => 'required|string|max:20|unique:tipos_apoyo,codigo',
            'nombre' => 'required|string|max:255',
        ], [
            'codigo.required' => 'El código es obligatorio',
            'codigo.unique' => 'Este código ya existe',
            'nombre.required' => 'El nombre es obligatorio',
        ]);

        TipoApoyo::create([
            'codigo' => strtoupper($validated['codigo']),
            'nombre' => strtoupper($validated['nombre']),
            'activo' => true,
        ]);

        return redirect()->back()->with('success', 'Tipo de apoyo creado exitosamente');
    }

    /**
     * Actualizar un tipo de apoyo
     */
    public function update(Request $request, $id)
    {
        $tipoApoyo = TipoApoyo::findOrFail($id);

        $validated = $request->validate([
            'codigo' => 'required|string|max:20|unique:tipos_apoyo,codigo,' . $id,
            'nombre' => 'required|string|max:255',
        ], [
            'codigo.required' => 'El código es obligatorio',
            'codigo.unique' => 'Este código ya existe',
            'nombre.required' => 'El nombre es obligatorio',
        ]);

        $tipoApoyo->update([
            'codigo' => strtoupper($validated['codigo']),
            'nombre' => strtoupper($validated['nombre']),
        ]);

        return redirect()->back()->with('success', 'Tipo de apoyo actualizado exitosamente');
    }

    /**
     * Cambiar estado activo/inactivo
     */
    public function toggleStatus($id)
    {
        $tipoApoyo = TipoApoyo::findOrFail($id);
        
        $tipoApoyo->update([
            'activo' => !$tipoApoyo->activo
        ]);

        $mensaje = $tipoApoyo->activo ? 'activado' : 'desactivado';
        return redirect()->back()->with('success', "Tipo de apoyo {$mensaje} exitosamente");
    }

    /**
     * Eliminar permanentemente
     */
    public function destroy($id)
    {
        $tipoApoyo = TipoApoyo::findOrFail($id);
        $tipoApoyo->delete();

        return redirect()->back()->with('success', 'Tipo de apoyo eliminado exitosamente');
    }
}
