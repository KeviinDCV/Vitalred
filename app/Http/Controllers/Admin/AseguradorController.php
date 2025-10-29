<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Asegurador;
use Illuminate\Http\Request;

class AseguradorController extends Controller
{
    /**
     * Crear un nuevo asegurador
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tipo' => 'required|in:eps,arl,soat,adres,particular,secretaria_salud',
            'nombre' => 'required|string|max:255',
        ], [
            'tipo.required' => 'El tipo es obligatorio',
            'nombre.required' => 'El nombre es obligatorio',
        ]);

        // Verificar que no exista la combinación tipo + nombre
        $existe = Asegurador::where('tipo', $validated['tipo'])
            ->where('nombre', strtoupper($validated['nombre']))
            ->exists();

        if ($existe) {
            return redirect()->back()->withErrors([
                'nombre' => 'Ya existe un asegurador con este nombre y tipo'
            ]);
        }

        Asegurador::create([
            'tipo' => $validated['tipo'],
            'nombre' => strtoupper($validated['nombre']),
            'activo' => true,
        ]);

        return redirect()->back()->with('success', 'Asegurador creado exitosamente');
    }

    /**
     * Actualizar un asegurador
     */
    public function update(Request $request, $id)
    {
        $asegurador = Asegurador::findOrFail($id);

        $validated = $request->validate([
            'tipo' => 'required|in:eps,arl,soat,adres,particular,secretaria_salud',
            'nombre' => 'required|string|max:255',
        ], [
            'tipo.required' => 'El tipo es obligatorio',
            'nombre.required' => 'El nombre es obligatorio',
        ]);

        // Verificar que no exista la combinación tipo + nombre (excepto el registro actual)
        $existe = Asegurador::where('tipo', $validated['tipo'])
            ->where('nombre', strtoupper($validated['nombre']))
            ->where('id', '!=', $id)
            ->exists();

        if ($existe) {
            return redirect()->back()->withErrors([
                'nombre' => 'Ya existe un asegurador con este nombre y tipo'
            ]);
        }

        $asegurador->update([
            'tipo' => $validated['tipo'],
            'nombre' => strtoupper($validated['nombre']),
        ]);

        return redirect()->back()->with('success', 'Asegurador actualizado exitosamente');
    }

    /**
     * Cambiar estado activo/inactivo
     */
    public function toggleStatus($id)
    {
        $asegurador = Asegurador::findOrFail($id);
        
        $asegurador->update([
            'activo' => !$asegurador->activo
        ]);

        $mensaje = $asegurador->activo ? 'activado' : 'desactivado';
        return redirect()->back()->with('success', "Asegurador {$mensaje} exitosamente");
    }

    /**
     * Eliminar permanentemente
     */
    public function destroy($id)
    {
        $asegurador = Asegurador::findOrFail($id);
        $asegurador->delete();

        return redirect()->back()->with('success', 'Asegurador eliminado exitosamente');
    }
}
