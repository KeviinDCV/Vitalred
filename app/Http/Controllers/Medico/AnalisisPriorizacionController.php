<?php

namespace App\Http\Controllers\Medico;

use App\Http\Controllers\Controller;
use App\Models\AnalisisPruebaIA;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnalisisPriorizacionController extends Controller
{
    public function index()
    {
        $analisis = AnalisisPruebaIA::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('medico/analisis-priorizacion', [
            'analisis' => $analisis,
            'user' => auth()->user(),
        ]);
    }

    public function campos()
    {
        return Inertia::render('medico/analisis-priorizacion-campos', [
            'user' => auth()->user(),
        ]);
    }

    public function nueva()
    {
        return Inertia::render('medico/analisis-priorizacion-nueva', [
            'user' => auth()->user(),
        ]);
    }

    public function cargaIA()
    {
        $analisis_recientes = AnalisisPruebaIA::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('medico/carga-analisis-ia', [
            'analisis_recientes' => $analisis_recientes,
            'user' => auth()->user(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'archivo' => 'required|file|mimes:pdf,doc,docx|max:10240',
            'tipo_analisis' => 'required|in:priorizacion,diagnostico,completo',
        ]);

        $path = $request->file('archivo')->store('analisis_ia', 'public');

        AnalisisPruebaIA::create([
            'user_id' => auth()->id(),
            'archivo_path' => $path,
            'tipo_analisis' => $validated['tipo_analisis'],
            'estado' => 'procesando',
        ]);

        return redirect()->route('medico.priorizacion.analisis')
            ->with('success', 'Análisis iniciado exitosamente');
    }
}