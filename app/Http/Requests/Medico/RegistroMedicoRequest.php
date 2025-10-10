<?php

namespace App\Http\Requests\Medico;

use Illuminate\Foundation\Http\FormRequest;

class RegistroMedicoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->isMedico() || auth()->user()->isAdministrator() || auth()->user()->isIps();
    }

    public function rules(): array
    {
        return [
            'tipo_identificacion' => 'required|in:CC,TI,CE,RC,PA',
            'numero_identificacion' => 'required|string|max:20|unique:registros_medicos,numero_identificacion',
            'nombre' => 'required|string|max:100',
            'apellidos' => 'required|string|max:100',
            'fecha_nacimiento' => 'required|date|before:today',
            'sexo' => 'required|in:M,F',
            'asegurador' => 'required|string|max:100',
            'departamento' => 'required|string|max:50',
            'ciudad' => 'required|string|max:50',
            'diagnostico_principal' => 'required|string|max:500',
            'motivo_consulta' => 'required|string|max:1000',
            'enfermedad_actual' => 'required|string|max:2000',
            'antecedentes' => 'nullable|string|max:1000',
            'frecuencia_cardiaca' => 'nullable|numeric|min:30|max:200',
            'frecuencia_respiratoria' => 'nullable|numeric|min:8|max:40',
            'temperatura' => 'nullable|numeric|min:35|max:42',
            'tension_sistolica' => 'nullable|numeric|min:70|max:250',
            'tension_diastolica' => 'nullable|numeric|min:40|max:150',
            'saturacion_oxigeno' => 'nullable|numeric|min:70|max:100',
            'historia_clinica' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
        ];
    }

    public function messages(): array
    {
        return [
            'numero_identificacion.unique' => 'Ya existe un registro con este número de identificación.',
            'fecha_nacimiento.before' => 'La fecha de nacimiento debe ser anterior a hoy.',
            'historia_clinica.max' => 'El archivo no puede ser mayor a 10MB.',
        ];
    }
}