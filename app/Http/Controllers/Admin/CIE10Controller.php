<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CodigoCIE10;
use Illuminate\Http\Request;

class CIE10Controller extends Controller
{
    /**
     * Crear un nuevo código CIE-10
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigo' => 'required|string|max:10|unique:codigos_cie10,codigo',
            'descripcion' => 'required|string|max:500',
        ], [
            'codigo.required' => 'El código es obligatorio',
            'codigo.unique' => 'Este código ya existe',
            'descripcion.required' => 'La descripción es obligatoria',
        ]);

        CodigoCIE10::create([
            'codigo' => strtoupper($validated['codigo']),
            'descripcion' => $validated['descripcion'],
            'activo' => true,
        ]);

        return redirect()->back()->with('success', 'Código CIE-10 creado exitosamente');
    }

    /**
     * Actualizar un código CIE-10
     */
    public function update(Request $request, $id)
    {
        $codigo = CodigoCIE10::findOrFail($id);

        $validated = $request->validate([
            'codigo' => 'required|string|max:10|unique:codigos_cie10,codigo,' . $id,
            'descripcion' => 'required|string|max:500',
        ], [
            'codigo.required' => 'El código es obligatorio',
            'codigo.unique' => 'Este código ya existe',
            'descripcion.required' => 'La descripción es obligatoria',
        ]);

        $codigo->update([
            'codigo' => strtoupper($validated['codigo']),
            'descripcion' => $validated['descripcion'],
        ]);

        return redirect()->back()->with('success', 'Código actualizado exitosamente');
    }

    /**
     * Cambiar estado activo/inactivo
     */
    public function toggleStatus($id)
    {
        $codigo = CodigoCIE10::findOrFail($id);
        
        $codigo->update([
            'activo' => !$codigo->activo
        ]);

        $mensaje = $codigo->activo ? 'activado' : 'desactivado';
        return redirect()->back()->with('success', "Código {$mensaje} exitosamente");
    }

    /**
     * Eliminar permanentemente
     */
    public function destroy($id)
    {
        $codigo = CodigoCIE10::findOrFail($id);
        $codigo->delete();

        return redirect()->back()->with('success', 'Código eliminado exitosamente');
    }
}
