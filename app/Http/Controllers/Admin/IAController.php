<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AnalisisPruebaIA;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IAController extends Controller
{
    public function index()
    {
        $analisis = AnalisisPruebaIA::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $estadisticas = [
            'total_analisis' => AnalisisPruebaIA::count(),
            'analisis_mes' => AnalisisPruebaIA::whereMonth('created_at', now()->month)->count(),
            'precision_promedio' => AnalisisPruebaIA::avg('precision_ia') ?? 0,
        ];

        return Inertia::render('admin/ia', [
            'analisis' => $analisis,
            'estadisticas' => $estadisticas,
            'user' => auth()->user(),
        ]);
    }
}