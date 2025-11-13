<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Institucion;
use App\Models\SolicitudRegistro;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UsuarioController extends Controller
{
    /**
     * Mostrar la lista de usuarios
     */
    public function index()
    {
        $usuarios = User::select('id', 'name', 'email', 'role', 'is_active', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        // Estadísticas
        $stats = [
            'total' => User::count(),
            'administradores' => User::where('role', 'administrador')->count(),
            'medicos' => User::where('role', 'medico')->count(),
            'eps' => User::where('role', 'ips')->count(),
            'activos' => User::where('is_active', true)->count(),
        ];

        // Leer archivo EPS.json
        $epsJsonPath = public_path('Eps.json');
        $epsData = [];
        $nits = [];

        if (file_exists($epsJsonPath)) {
            $jsonContent = file_get_contents($epsJsonPath);
            $jsonData = json_decode($jsonContent, true);

            // Procesar EPS del array principal
            if (isset($jsonData['EPS']) && is_array($jsonData['EPS'])) {
                foreach ($jsonData['EPS'] as $index => $eps) {
                    $epsData[] = [
                        'id' => $index + 1,
                        'nombre' => $eps['ENTIDAD'] ?? '',
                        'nit' => isset($eps['NIT']) ? (string)$eps['NIT'] : null,
                    ];
                    if (isset($eps['NIT'])) {
                        $nits[] = (string)$eps['NIT'];
                    }
                }
            }

            // Procesar Régimen Excepción
            if (isset($jsonData['Regimen Excepción']) && is_array($jsonData['Regimen Excepción'])) {
                $startIndex = count($epsData) + 1;
                foreach ($jsonData['Regimen Excepción'] as $index => $eps) {
                    $epsData[] = [
                        'id' => $startIndex + $index,
                        'nombre' => $eps['ENTIDAD'] ?? '',
                        'nit' => isset($eps['NIT']) ? (string)$eps['NIT'] : null,
                    ];
                    if (isset($eps['NIT'])) {
                        $nits[] = (string)$eps['NIT'];
                    }
                }
            }
        }

        // Eliminar duplicados y ordenar NITs
        $nits = array_unique($nits);
        sort($nits);

        // Obtener solicitudes de registro
        $solicitudes = SolicitudRegistro::with(['institucion:id,nombre', 'aprobador:id,name'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($solicitud) {
                return [
                    'id' => $solicitud->id,
                    'ips_id' => $solicitud->ips_id,
                    'ips_nombre' => $solicitud->ips_nombre,
                    'nit' => $solicitud->nit,
                    'nombre_responsable' => $solicitud->nombre_responsable,
                    'cargo_responsable' => $solicitud->cargo_responsable,
                    'telefono' => $solicitud->telefono,
                    'email' => $solicitud->email,
                    'estado' => $solicitud->estado,
                    'observaciones' => $solicitud->observaciones,
                    'aprobado_por' => $solicitud->aprobado_por,
                    'fecha_aprobacion' => $solicitud->fecha_aprobacion?->toDateTimeString(),
                    'created_at' => $solicitud->created_at->toDateTimeString(),
                    'institucion' => $solicitud->institucion ? [
                        'id' => $solicitud->institucion->id,
                        'nombre' => $solicitud->institucion->nombre,
                    ] : null,
                    'aprobador' => $solicitud->aprobador ? [
                        'id' => $solicitud->aprobador->id,
                        'name' => $solicitud->aprobador->name,
                    ] : null,
                ];
            })
            ->values();

        return Inertia::render('admin/usuarios', [
            'usuarios' => $usuarios,
            'stats' => $stats,
            'eps' => $epsData,
            'nits' => array_values($nits),
            'solicitudes' => $solicitudes,
            'filtroEstado' => '',
        ]);
    }

    /**
     * Crear un nuevo usuario
     */
    public function store(Request $request)
    {
        // Normalizar eps_id: los IDs del JSON son temporales, no existen en la BD
        // Por lo tanto, siempre guardamos solo el nombre de la EPS
        $epsId = null; // Siempre null porque los IDs del JSON no son IDs reales de instituciones
        $epsNombre = trim($request->eps_nombre ?? '');

        // Validar que no exista otro usuario con la misma EPS (solo para rol IPS)
        if ($request->role === 'ips') {
            if (User::where('role', 'ips')
                ->where('ips_nombre', $epsNombre)
                ->exists()) {
                return back()->withErrors([
                    'eps_nombre' => 'Ya existe un usuario registrado con esta EPS. No se puede crear más de un usuario por EPS.',
                ])->withInput();
            }
        }

        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:administrador,medico,ips',
            'is_active' => 'boolean',
            // Campos EPS siempre requeridos
            'eps_id' => 'nullable',
            'eps_nombre' => 'required|string|max:255',
            'nit' => 'required|string|max:255',
            'nombre_responsable' => 'required|string|max:255',
            'cargo_responsable' => 'required|string|max:255',
            'telefono' => 'required|string|max:50',
        ];

        $request->validate($rules, [
            'name.required' => 'El nombre es requerido.',
            'name.string' => 'El nombre debe ser texto.',
            'name.max' => 'El nombre no puede exceder 255 caracteres.',
            'email.required' => 'El correo electrónico es requerido.',
            'email.string' => 'El correo electrónico debe ser texto.',
            'email.email' => 'El correo electrónico debe tener un formato válido.',
            'email.max' => 'El correo electrónico no puede exceder 255 caracteres.',
            'email.unique' => 'Este correo electrónico ya está registrado.',
            'password.required' => 'La contraseña es requerida.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
            'role.required' => 'El rol es requerido.',
            'role.in' => 'El rol seleccionado no es válido.',
            'eps_id.integer' => 'El ID de EPS debe ser un número válido.',
            'eps_nombre.required' => 'Debe seleccionar una EPS de la lista o escribir el nombre manualmente.',
            'eps_nombre.string' => 'El nombre de la EPS debe ser texto.',
            'eps_nombre.max' => 'El nombre de la EPS no puede exceder 255 caracteres.',
            'nit.required' => 'El NIT es requerido.',
            'nit.string' => 'El NIT debe ser texto.',
            'nit.max' => 'El NIT no puede exceder 255 caracteres.',
            'nombre_responsable.required' => 'El nombre del responsable es requerido.',
            'nombre_responsable.string' => 'El nombre del responsable debe ser texto.',
            'nombre_responsable.max' => 'El nombre del responsable no puede exceder 255 caracteres.',
            'cargo_responsable.required' => 'El cargo del responsable es requerido.',
            'cargo_responsable.string' => 'El cargo del responsable debe ser texto.',
            'cargo_responsable.max' => 'El cargo del responsable no puede exceder 255 caracteres.',
            'telefono.required' => 'El teléfono es requerido.',
            'telefono.string' => 'El teléfono debe ser texto.',
            'telefono.max' => 'El teléfono no puede exceder 50 caracteres.',
        ]);

        $userData = [
            'name' => $request->name,
            'email' => strtolower($request->email),
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'is_active' => $request->is_active ?? true,
            'email_verified_at' => now(),
            // Campos EPS siempre se guardan
            'ips_id' => null, // Siempre null porque los IDs del JSON no son IDs reales
            'ips_nombre' => $epsNombre,
            'nit' => $request->nit,
            'nombre_responsable' => $request->nombre_responsable,
            'cargo_responsable' => $request->cargo_responsable,
            'telefono' => $request->telefono,
        ];

        User::create($userData);

        return redirect()->route('admin.usuarios')->with('success', 'Usuario creado exitosamente.');
    }

    /**
     * Actualizar un usuario
     */
    public function update(Request $request, User $usuario)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,' . $usuario->id,
            'role' => 'required|in:administrador,medico,ips',
            'is_active' => 'boolean',
        ]);

        $usuario->update([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'is_active' => $request->is_active ?? true,
        ]);

        return redirect()->route('admin.usuarios')->with('success', 'Usuario actualizado exitosamente.');
    }

    /**
     * Cambiar estado de un usuario (activar/desactivar)
     */
    public function toggleStatus(User $usuario)
    {
        $usuario->update([
            'is_active' => !$usuario->is_active,
        ]);

        $status = $usuario->is_active ? 'activado' : 'desactivado';
        return redirect()->route('admin.usuarios')->with('success', "Usuario {$status} exitosamente.");
    }

    /**
     * Eliminar un usuario
     */
    public function destroy(User $usuario)
    {
        // Prevenir que el administrador se elimine a sí mismo
        if ($usuario->id === auth()->id()) {
            return redirect()->route('admin.usuarios')->with('error', 'No puedes eliminar tu propia cuenta.');
        }

        $usuario->delete();

        return redirect()->route('admin.usuarios')->with('success', 'Usuario eliminado exitosamente.');
    }
}
