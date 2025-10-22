<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RegistroMedico;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Mostrar el dashboard del administrador con todos los registros médicos
     */
    public function index(Request $request)
    {
        $search = $request->get('search');

        $registros = RegistroMedico::with('user')
            ->when($search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('nombre', 'like', "%{$search}%")
                      ->orWhere('apellidos', 'like', "%{$search}%")
                      ->orWhere('numero_identificacion', 'like', "%{$search}%")
                      ->orWhere('diagnostico_principal', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        // Últimos 6 usuarios registrados
        $usuariosRecientes = User::select('id', 'name', 'email', 'role', 'is_active', 'created_at')
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get();

        // Estadísticas generales
        $stats = [
            'total_usuarios' => User::count(),
            'referencias_pendientes' => 15, // TODO: Implementar cuando tengamos modelo de referencias
            'casos_criticos' => 3, // TODO: Implementar con lógica real
            'sistema_activo' => '99.9%',
        ];

        return Inertia::render('admin/admin-dashboard', [
            'registros' => $registros,
            'search' => $search,
            'usuariosRecientes' => $usuariosRecientes,
            'stats' => $stats,
        ]);
    }

    /**
     * Buscar registros médicos (para AJAX)
     */
    public function buscarRegistros(Request $request)
    {
        $search = $request->get('search');

        $registros = RegistroMedico::with('user')
            ->when($search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('nombre', 'like', "%{$search}%")
                      ->orWhere('apellidos', 'like', "%{$search}%")
                      ->orWhere('numero_identificacion', 'like', "%{$search}%")
                      ->orWhere('diagnostico_principal', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return response()->json($registros);
    }

    /**
     * Descargar historia clínica (administrador puede descargar cualquier historia)
     */
    public function descargarHistoria(RegistroMedico $registro)
    {
        // Verificar que existe el archivo
        if (!$registro->historia_clinica_path) {
            abort(404, 'No hay historia clínica adjunta para este registro.');
        }

        $filePath = storage_path('app/public/' . $registro->historia_clinica_path);

        // Verificar que el archivo existe físicamente
        if (!file_exists($filePath)) {
            abort(404, 'El archivo de historia clínica no se encuentra en el servidor.');
        }

        // Obtener información del archivo
        $fileName = 'historia_clinica_' . $registro->numero_identificacion . '_' . $registro->nombre . '_' . $registro->apellidos;
        $fileExtension = pathinfo($registro->historia_clinica_path, PATHINFO_EXTENSION);
        $downloadName = $fileName . '.' . $fileExtension;

        // Retornar el archivo para descarga
        return response()->download($filePath, $downloadName, [
            'Content-Type' => mime_content_type($filePath),
        ]);
    }
}
