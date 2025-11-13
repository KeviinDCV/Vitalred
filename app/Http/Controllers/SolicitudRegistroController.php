<?php

namespace App\Http\Controllers;

use App\Models\Institucion;
use App\Models\SolicitudRegistro;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class SolicitudRegistroController extends Controller
{
    /**
     * Mostrar el formulario de registro
     */
    public function create(): Response
    {
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
                        'id' => $index + 1, // ID temporal basado en índice
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

        return Inertia::render('auth/register', [
            'eps' => $epsData,
            'nits' => array_values($nits),
        ]);
    }

    /**
     * Guardar una nueva solicitud de registro
     */
    public function store(Request $request)
    {
        // Normalizar eps_id: los IDs del JSON son temporales, no existen en la BD
        // Por lo tanto, siempre guardamos solo el nombre de la EPS
        $epsId = null; // Siempre null porque los IDs del JSON no son IDs reales de instituciones
        $epsNombre = trim($request->eps_nombre ?? '');

        // Validar que no exista otro usuario con la misma EPS
        if (User::where('role', 'ips')
            ->where('ips_nombre', $epsNombre)
            ->exists()) {
            return back()->withErrors([
                'eps_nombre' => 'Ya existe un usuario registrado con esta EPS. No se puede crear más de un usuario por EPS.',
            ])->withInput();
        }

        // Validar que el email no exista en usuarios ni en solicitudes pendientes
        $rules = [
            'eps_id' => 'nullable',
            'eps_nombre' => 'required|string|max:255',
            'nit' => 'required|string|max:255',
            'nombre_responsable' => 'required|string|max:255',
            'cargo_responsable' => 'required|string|max:255',
            'telefono' => 'required|string|max:50',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                function ($attribute, $value, $fail) {
                    // Verificar que no exista en usuarios
                    if (User::where('email', strtolower($value))->exists()) {
                        $fail('Este correo electrónico ya está registrado.');
                    }
                    // Verificar que no exista en solicitudes pendientes
                    if (SolicitudRegistro::where('email', strtolower($value))->where('estado', 'pendiente')->exists()) {
                        $fail('Ya existe una solicitud pendiente con este correo electrónico.');
                    }
                },
            ],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ];

        $request->validate($rules, [
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
            'email.required' => 'El correo electrónico es requerido.',
            'email.string' => 'El correo electrónico debe ser texto.',
            'email.email' => 'El correo electrónico debe tener un formato válido.',
            'email.max' => 'El correo electrónico no puede exceder 255 caracteres.',
            'password.required' => 'La contraseña es requerida.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
        ]);

        // Crear solicitud de registro con contraseña hasheada
        SolicitudRegistro::create([
            'ips_id' => null,
            'ips_nombre' => $epsNombre,
            'nit' => $request->nit,
            'nombre_responsable' => $request->nombre_responsable,
            'cargo_responsable' => $request->cargo_responsable,
            'telefono' => $request->telefono,
            'email' => strtolower($request->email),
            'password' => Hash::make($request->password),
            'estado' => 'pendiente',
        ]);

        return redirect()->route('login')->with('success', 'Registro enviado exitosamente. Será revisado por un administrador.');
    }

    /**
     * Listar solicitudes para administradores
     */
    public function index(Request $request)
    {
        $query = SolicitudRegistro::with(['institucion:id,nombre', 'aprobador:id,name'])
            ->orderBy('created_at', 'desc');

        // Filtrar por estado si se proporciona
        if ($request->has('estado') && $request->estado !== '') {
            $query->where('estado', $request->estado);
        }

        $solicitudes = $query->get();

        // Obtener usuarios y stats para la vista
        $usuarios = \App\Models\User::select('id', 'name', 'email', 'role', 'is_active', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        $stats = [
            'total' => \App\Models\User::count(),
            'administradores' => \App\Models\User::where('role', 'administrador')->count(),
            'medicos' => \App\Models\User::where('role', 'medico')->count(),
            'eps' => \App\Models\User::where('role', 'ips')->count(),
            'activos' => \App\Models\User::where('is_active', true)->count(),
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

        // Serializar solicitudes para evitar problemas de serialización
        $solicitudesSerializadas = $solicitudes->map(function ($solicitud) {
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
            'solicitudes' => $solicitudesSerializadas,
            'filtroEstado' => $request->estado ?? '',
        ]);
    }

    /**
     * Aprobar una solicitud y crear usuario EPS
     */
    public function aprobar(Request $request, $id)
    {
        $solicitud = SolicitudRegistro::findOrFail($id);

        if ($solicitud->estado !== 'pendiente') {
            return redirect()->route('admin.usuarios.solicitudes')
                ->with('error', 'Esta solicitud ya ha sido procesada.');
        }

        // Verificar que el email no exista en usuarios
        if (User::where('email', $solicitud->email)->exists()) {
            return redirect()->route('admin.usuarios.solicitudes')
                ->with('error', 'Ya existe un usuario con este correo electrónico.');
        }

        // Verificar que no exista otro usuario con la misma EPS
        if (User::where('role', 'ips')
            ->where('ips_nombre', $solicitud->ips_nombre)
            ->exists()) {
            return redirect()->route('admin.usuarios.solicitudes')
                ->with('error', 'Ya existe un usuario registrado con esta EPS.');
        }

        // Crear usuario EPS usando la contraseña de la solicitud
        $user = User::create([
            'name' => $solicitud->nombre_responsable,
            'email' => $solicitud->email,
            'password' => $solicitud->password, // Usar la contraseña hasheada de la solicitud
            'role' => 'ips',
            'is_active' => true,
            'ips_id' => $solicitud->ips_id,
            'ips_nombre' => $solicitud->ips_nombre,
            'nit' => $solicitud->nit,
            'nombre_responsable' => $solicitud->nombre_responsable,
            'cargo_responsable' => $solicitud->cargo_responsable,
            'telefono' => $solicitud->telefono,
            'email_verified_at' => now(),
        ]);

        // Actualizar solicitud
        $solicitud->update([
            'estado' => 'aprobada',
            'aprobado_por' => auth()->id(),
            'fecha_aprobacion' => now(),
        ]);

        return redirect()->route('admin.usuarios.solicitudes')
            ->with('success', 'Solicitud aprobada. Usuario creado exitosamente.');
    }

    /**
     * Rechazar una solicitud
     */
    public function rechazar(Request $request, $id)
    {
        $request->validate([
            'observaciones' => 'nullable|string|max:1000',
        ]);

        $solicitud = SolicitudRegistro::findOrFail($id);

        if ($solicitud->estado !== 'pendiente') {
            return redirect()->route('admin.usuarios.solicitudes')
                ->with('error', 'Esta solicitud ya ha sido procesada.');
        }

        $solicitud->update([
            'estado' => 'rechazada',
            'observaciones' => $request->observaciones,
            'aprobado_por' => auth()->id(),
            'fecha_aprobacion' => now(),
        ]);

        return redirect()->route('admin.usuarios.solicitudes')
            ->with('success', 'Solicitud rechazada exitosamente.');
    }
}
