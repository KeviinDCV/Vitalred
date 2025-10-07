<?php

namespace App\Services;

/**
 * =====================================================
 * SERVICIO DEPRECADO - NO USAR EN NUEVOS DESARROLLOS
 * =====================================================
 * 
 * Este servicio utilizaba Google Gemini AI y ha sido
 * reemplazado por OpenRouterAIService que usa DeepSeek 3.1.
 * 
 * Se mantiene el archivo comentado para referencia histórica,
 * pero todos los controladores ahora usan OpenRouterAIService.
 * 
 * Migración realizada: 2025-01-10
 * Razón: Cambio a OpenRouter con DeepSeek 3.1 (free tier)
 * 
 * @deprecated Use OpenRouterAIService instead
 * @see App\Services\OpenRouterAIService
 * =====================================================
 */

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Smalot\PdfParser\Parser;

/**
 * @deprecated This service is deprecated. Use OpenRouterAIService instead.
 */
class GeminiAIService
{
    private array $apiKeys;
    private int $currentKeyIndex = 0;
    private string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

    public function __construct()
    {
        $this->apiKeys = [
            config('app.gemini_api_key_1', env('GEMINI_API_KEY_1')),
            config('app.gemini_api_key_2', env('GEMINI_API_KEY_2')),
            config('app.gemini_api_key_3', env('GEMINI_API_KEY_3')),
            config('app.gemini_api_key_4', env('GEMINI_API_KEY_4')),
        ];
    }

    /**
     * Rotar entre las API keys disponibles
     */
    private function getNextApiKey(): string
    {
        $apiKey = $this->apiKeys[$this->currentKeyIndex];
        $this->currentKeyIndex = ($this->currentKeyIndex + 1) % count($this->apiKeys);
        return $apiKey;
    }

    /**
     * Extraer texto de un archivo (PDF, imagen, etc.)
     */
    public function extractTextFromFile(string $filePath): string
    {
        $fullPath = storage_path('app/public/' . $filePath);
        $extension = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));

        Log::info("Intentando extraer texto de archivo: {$fullPath}, extensión: {$extension}");

        try {
            switch ($extension) {
                case 'pdf':
                    return $this->extractTextFromPdf($fullPath);

                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'gif':
                case 'bmp':
                case 'tiff':
                    return $this->extractTextFromImage($fullPath);

                case 'doc':
                case 'docx':
                    return $this->extractTextFromWord($fullPath);

                default:
                    throw new \Exception("Tipo de archivo no soportado: {$extension}");
            }
        } catch (\Exception $e) {
            Log::error("Error extrayendo texto del archivo: " . $e->getMessage());
            throw new \Exception("No se pudo extraer el texto del archivo: " . $e->getMessage());
        }
    }

    /**
     * Extraer texto de PDF
     */
    private function extractTextFromPdf(string $filePath): string
    {
        try {
            $parser = new Parser();
            $pdf = $parser->parseFile($filePath);
            $text = $pdf->getText();

            if (empty(trim($text))) {
                throw new \Exception("El PDF no contiene texto extraíble o está protegido");
            }

            return $text;
        } catch (\Exception $e) {
            Log::error("Error extrayendo texto de PDF: " . $e->getMessage());
            throw new \Exception("No se pudo extraer el texto del PDF: " . $e->getMessage());
        }
    }



    /**
     * Extraer texto de imagen usando OCR (API online)
     */
    private function extractTextFromImage(string $filePath): string
    {
        try {
            // Usar OCR.space API (gratuita) para extraer texto de imágenes
            $response = Http::attach(
                'file', file_get_contents($filePath), basename($filePath)
            )->post('https://api.ocr.space/parse/image', [
                'apikey' => 'helloworld', // API key gratuita
                'language' => 'spa', // Español
                'isOverlayRequired' => false,
                'detectOrientation' => true,
                'scale' => true,
                'OCREngine' => 2
            ]);

            if ($response->successful()) {
                $result = $response->json();

                if (isset($result['ParsedResults'][0]['ParsedText'])) {
                    $text = $result['ParsedResults'][0]['ParsedText'];

                    if (empty(trim($text))) {
                        throw new \Exception("No se pudo extraer texto de la imagen");
                    }

                    return $text;
                } else {
                    throw new \Exception("Error en la respuesta del OCR: " . ($result['ErrorMessage'] ?? 'Error desconocido'));
                }
            } else {
                throw new \Exception("Error en la API de OCR: " . $response->status());
            }
        } catch (\Exception $e) {
            Log::error("Error en OCR de imagen: " . $e->getMessage());
            throw new \Exception("No se pudo extraer el texto de la imagen: " . $e->getMessage());
        }
    }

    /**
     * Extraer texto de documento Word (básico)
     */
    private function extractTextFromWord(string $filePath): string
    {
        // Para documentos Word necesitaríamos una librería adicional
        // Por ahora retornamos un mensaje indicativo
        throw new \Exception("Extracción de documentos Word no implementada aún. Use PDF o imágenes.");
    }

    /**
     * Analizar texto con Gemini AI y extraer datos del paciente
     */
    public function analyzePatientDocument(string $text): array
    {
        $prompt = $this->buildAnalysisPrompt($text);
        
        $maxRetries = count($this->apiKeys);
        $attempt = 0;

        while ($attempt < $maxRetries) {
            try {
                $apiKey = $this->getNextApiKey();
                $response = $this->callGeminiAPI($prompt, $apiKey);
                
                if ($response) {
                    return $this->parseGeminiResponse($response);
                }
            } catch (\Exception $e) {
                Log::warning("Error con API key {$attempt}: " . $e->getMessage());
                $attempt++;
                
                if ($attempt >= $maxRetries) {
                    throw new \Exception("Todas las API keys fallaron. Último error: " . $e->getMessage());
                }
            }
        }

        throw new \Exception("No se pudo analizar el documento con ninguna API key");
    }

    /**
     * Analizar con prompt específico personalizado
     */
    public function analizarConPromptEspecifico(string $prompt): string
    {
        \Log::info('INICIANDO ANÁLISIS CON PROMPT ESPECÍFICO');
        
        $maxKeysToTry = count($this->apiKeys);
        $maxAttemptsPerKey = 3;
        $keyTryCount = 0;

        while ($keyTryCount < $maxKeysToTry) {
            $apiKey = $this->getNextApiKey();
            
            for ($attemptPerKey = 1; $attemptPerKey <= $maxAttemptsPerKey; $attemptPerKey++) {
                try {
                    \Log::info('INTENTANDO LLAMADA A GEMINI CON PROMPT ESPECÍFICO', [
                        'api_key_intento' => $keyTryCount + 1,
                        'sub_intento' => $attemptPerKey,
                        'api_key_prefix' => substr($apiKey, 0, 10) . '...'
                    ]);
                    
                    $response = $this->callGeminiAPI($prompt, $apiKey);
                    
                    if ($response) {
                        \Log::info('ANÁLISIS CON PROMPT ESPECÍFICO COMPLETADO EXITOSAMENTE', [
                            'intentos_totales' => ($keyTryCount * $maxAttemptsPerKey) + $attemptPerKey
                        ]);
                        return $response;
                    }
                } catch (\Exception $e) {
                    \Log::warning("ERROR EN INTENTO {$keyTryCount}-{$attemptPerKey} CON GEMINI API", [
                        'error' => $e->getMessage(),
                        'api_key_prefix' => substr($apiKey, 0, 10) . '...'
                    ]);
                    
                    if ($attemptPerKey < $maxAttemptsPerKey) {
                        \Log::info("ESPERANDO 2 SEGUNDOS ANTES DEL SIGUIENTE INTENTO...");
                        sleep(2);
                    } else {
                        \Log::warning("AGOTADOS INTENTOS PARA API KEY {$keyTryCount}, CAMBIANDO A SIGUIENTE KEY");
                        break;
                    }
                }
            }
            
            $keyTryCount++;
        }

        throw new \Exception("Todas las API keys fallaron para análisis con prompt específico después de múltiples intentos. Total intentos: " . ($maxKeysToTry * $maxAttemptsPerKey));
    }

    /**
     * Análisis libre de historia clínica - La IA analiza libremente el texto completo
     */
    public function analizarHistoriaClinicaLibre(string $textoCompleto): string
    {
        \Log::info('INICIANDO ANÁLISIS LIBRE CON GEMINI AI');
        
        $prompt = $this->buildPromptAnalisisLibre($textoCompleto);
        
        $maxKeysToTry = count($this->apiKeys);
        $maxAttemptsPerKey = 3; // Intentos por cada API key
        $keyTryCount = 0;

        while ($keyTryCount < $maxKeysToTry) {
            $apiKey = $this->getNextApiKey();
            
            // Intentar múltiples veces con la misma API key
            for ($attemptPerKey = 1; $attemptPerKey <= $maxAttemptsPerKey; $attemptPerKey++) {
                try {
                    \Log::info('INTENTANDO LLAMADA A GEMINI', [
                        'api_key_intento' => $keyTryCount + 1,
                        'sub_intento' => $attemptPerKey,
                        'api_key_prefix' => substr($apiKey, 0, 10) . '...'
                    ]);
                    
                    $response = $this->callGeminiAPI($prompt, $apiKey);
                    
                    if ($response) {
                        \Log::info('ANÁLISIS LIBRE COMPLETADO EXITOSAMENTE', [
                            'intentos_totales' => ($keyTryCount * $maxAttemptsPerKey) + $attemptPerKey
                        ]);
                        return $response;
                    }
                } catch (\Exception $e) {
                    \Log::warning("ERROR EN INTENTO {$keyTryCount}-{$attemptPerKey} CON GEMINI API", [
                        'error' => $e->getMessage(),
                        'api_key_prefix' => substr($apiKey, 0, 10) . '...'
                    ]);
                    
                    // Si no es el último intento para esta key, esperar antes de reintentar
                    if ($attemptPerKey < $maxAttemptsPerKey) {
                        \Log::info("ESPERANDO 2 SEGUNDOS ANTES DEL SIGUIENTE INTENTO...");
                        sleep(2);
                    } else {
                        // Si ya agotamos todos los intentos para esta key, pasar a la siguiente
                        \Log::warning("AGOTADOS INTENTOS PARA API KEY {$keyTryCount}, CAMBIANDO A SIGUIENTE KEY");
                        break;
                    }
                }
            }
            
            $keyTryCount++;
        }

        throw new \Exception("Todas las API keys fallaron para análisis libre después de múltiples intentos. Total intentos: " . ($maxKeysToTry * $maxAttemptsPerKey));
    }

    /**
     * Construir prompt simple para análisis libre de historia clínica
     */
    private function buildPromptAnalisisLibre(string $textoCompleto): string
    {
        $prompt = "Eres un médico especialista. Analiza esta historia clínica:

HISTORIA CLÍNICA:
{$textoCompleto}

Proporciona un análisis médico detallado incluyendo:
1. Resumen del paciente
2. Diagnóstico principal
3. Estado de gravedad
4. Recomendaciones médicas";

        \Log::info('PROMPT CREADO PARA IA', [
            'longitud_prompt' => strlen($prompt),
            'longitud_texto' => strlen($textoCompleto)
        ]);

        return $prompt;
    }

    /**
     * Nuevo método: Análisis completo de historia clínica con priorización integrada
     */
    public function analizarHistoriaClinicaCompleta(string $text): array
    {
        $prompt = $this->buildHistoriaClinicaCompletaPrompt($text);
        
        $maxRetries = count($this->apiKeys);
        $attempt = 0;

        while ($attempt < $maxRetries) {
            try {
                $apiKey = $this->getNextApiKey();
                $response = $this->callGeminiAPI($prompt, $apiKey);
                
                if ($response) {
                    return $this->parseHistoriaClinicaResponse($response);
                }
            } catch (\Exception $e) {
                Log::warning("Error con API key {$attempt} en análisis completo: " . $e->getMessage());
                $attempt++;
                
                if ($attempt >= $maxRetries) {
                    throw new \Exception("Todas las API keys fallaron para análisis completo. Último error: " . $e->getMessage());
                }
            }
        }

        throw new \Exception("No se pudo analizar la historia clínica completa con ninguna API key");
    }

    /**
     * Construir prompt completo para extracción de datos clínicos + análisis de priorización
     */
    private function buildHistoriaClinicaCompletaPrompt(string $text): string
    {
        return "Eres un médico especialista en medicina de emergencias y análisis de historias clínicas. 
        Analiza COMPLETAMENTE el siguiente documento médico y extrae TODOS los datos disponibles, luego realiza un análisis de priorización.

        TEXTO DE LA HISTORIA CLÍNICA:
        {$text}

        INSTRUCCIONES:
        1. Extrae TODOS los datos disponibles del documento, incluso si algunos están incompletos
        2. Si un dato no está explícito, búscalo en el contexto (ej: edad calculada desde fecha nacimiento)
        3. Aplica el algoritmo de priorización médica según los criterios establecidos
        4. Responde ÚNICAMENTE con JSON válido, sin texto adicional

        ALGORITMO DE PRIORIZACIÓN (Verde=Prioriza, Rojo=No prioriza):
        - EXCLUSIONES: Triage NO se incluye
        - EVALUACIÓN: Convenio se evalúa AL FINAL
        - PUNTAJES: Muy alto=5, Alto=4, Intermedio=3, Bajo=2, Muy bajo=1, No priorizado=0

        CRITERIOS DE PRIORIZACIÓN:
        1. DATOS GENERALES: Edad crítica (<5años=5, 6-17años=4, >70años=4)
        2. DATOS CLÍNICOS: Tipo paciente (Gestante=5, Menor=4, Adulto=1), Fecha ingreso (<24h=5, 24-48h=4)
        3. SIGNOS VITALES: Por tipo paciente con rangos específicos
        4. SÍNTOMAS: Por tipo paciente con diferentes severidades
        5. SERVICIOS: UCI y especializados=5, Urgencias=2, Medicina general=0
        6. ESPECIALIDADES: Oncología, trasplantes, neurocirugía=5, medicina general=3
        7. APOYO DIAGNÓSTICO: Procedimientos invasivos y especializados mayor puntuación
        8. CONVENIOS (ÚLTIMO): Policlínica, SOAT, FOMAG=5, Nueva EPS, Comfenalco=4

        RESPONDE CON ESTE JSON EXACTO:
        {
            \"datos_extraidos\": {
                \"datos_generales\": {
                    \"nombre\": \"string\",
                    \"apellidos\": \"string\", 
                    \"numero_identificacion\": \"string\",
                    \"edad\": numero,
                    \"sexo\": \"masculino|femenino\",
                    \"tipo_paciente\": \"Adulto|Menor|Gestante\",
                    \"institucion_remitente\": \"string\"
                },
                \"datos_clinicos\": {
                    \"fecha_ingreso\": \"YYYY-MM-DD\",
                    \"motivo_consulta\": \"string\",
                    \"enfermedad_actual\": \"string\",
                    \"diagnostico_principal\": \"string\",
                    \"antecedentes\": \"string\"
                },
                \"signos_vitales\": {
                    \"frecuencia_cardiaca\": numero_o_null,
                    \"frecuencia_respiratoria\": numero_o_null,
                    \"presion_sistolica\": numero_o_null,
                    \"presion_diastolica\": numero_o_null,
                    \"temperatura\": numero_o_null,
                    \"saturacion_oxigeno\": numero_o_null,
                    \"glasgow\": numero_o_null
                },
                \"sintomas\": [\"sintoma1\", \"sintoma2\"],
                \"servicios\": [\"servicio_actual\"],
                \"especialidades\": [\"especialidad_solicitada\"],
                \"apoyo_diagnostico\": [\"examen1\", \"procedimiento1\"],
                \"convenio\": {
                    \"tipo_convenio\": \"string\",
                    \"asegurador\": \"string\"
                }
            },
            \"analisis_priorizacion\": {
                \"prioriza\": true_o_false,
                \"puntuacion_total\": numero_0_a_100,
                \"nivel_prioridad\": \"CRÍTICA|ALTA|MEDIA|BAJA\",
                \"criterios_evaluados\": {
                    \"edad\": {\"puntaje\": numero, \"justificacion\": \"string\"},
                    \"tipo_paciente\": {\"puntaje\": numero, \"justificacion\": \"string\"},
                    \"signos_vitales\": {\"puntaje\": numero, \"justificacion\": \"string\"},
                    \"sintomas\": {\"puntaje\": numero, \"justificacion\": \"string\"},
                    \"servicios\": {\"puntaje\": numero, \"justificacion\": \"string\"},
                    \"especialidades\": {\"puntaje\": numero, \"justificacion\": \"string\"},
                    \"apoyo_diagnostico\": {\"puntaje\": numero, \"justificacion\": \"string\"},
                    \"convenio\": {\"puntaje\": numero, \"justificacion\": \"string\"}
                },
                \"razonamiento_clinico\": \"Análisis técnico detallado del estado del paciente y necesidad de priorización\",
                \"factores_riesgo\": [\"factor1\", \"factor2\"],
                \"recomendaciones\": [\"recomendación1\", \"recomendación2\"],
                \"conclusion_tecnica\": \"Conclusión médica profesional\"
            }
        }

        IMPORTANTE: 
        - Extrae TODA la información disponible en el documento
        - Si algo no está disponible, usa null (no inventes datos)
        - Calcula puntajes según el algoritmo exacto
        - Sé específico en justificaciones clínicas
        - Considera el contexto completo del documento";
    }

    /**
     * Parsear respuesta del análisis completo de historia clínica
     */
    private function parseHistoriaClinicaResponse(string $response): array
    {
        try {
            // Buscar el JSON en la respuesta
            $jsonStart = strpos($response, '{');
            $jsonEnd = strrpos($response, '}');
            
            if ($jsonStart === false || $jsonEnd === false) {
                throw new \Exception("No se encontró JSON válido en la respuesta");
            }
            
            $jsonString = substr($response, $jsonStart, $jsonEnd - $jsonStart + 1);
            $resultado = json_decode($jsonString, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception("Error al decodificar JSON: " . json_last_error_msg());
            }
            
            // Validar estructura básica
            if (!isset($resultado['datos_extraidos']) || !isset($resultado['analisis_priorizacion'])) {
                throw new \Exception("Estructura de respuesta inválida - faltan datos_extraidos o analisis_priorizacion");
            }
            
            // Estructurar para compatibilidad con el sistema actual
            $datosExtraidos = $resultado['datos_extraidos'];
            $analisisPriorizacion = $resultado['analisis_priorizacion'];
            
            return [
                'datos_paciente' => [
                    'datos_generales' => $datosExtraidos['datos_generales'] ?? [],
                    'datos_clinicos' => $datosExtraidos['datos_clinicos'] ?? [],
                    'signos_vitales' => $datosExtraidos['signos_vitales'] ?? [],
                    'sintomas' => $datosExtraidos['sintomas'] ?? [],
                    'servicios' => $datosExtraidos['servicios'] ?? [],
                    'especialidades' => $datosExtraidos['especialidades'] ?? [],
                    'apoyo_diagnostico' => $datosExtraidos['apoyo_diagnostico'] ?? [],
                    'convenio' => $datosExtraidos['convenio'] ?? []
                ],
                'analisis_priorizacion' => [
                    'paciente' => [
                        'nombre' => ($datosExtraidos['datos_generales']['nombre'] ?? '') . ' ' . ($datosExtraidos['datos_generales']['apellidos'] ?? ''),
                        'edad' => $datosExtraidos['datos_generales']['edad'] ?? 0,
                        'tipo_paciente' => $datosExtraidos['datos_generales']['tipo_paciente'] ?? 'Adulto'
                    ],
                    'resultado' => [
                        'prioriza' => $analisisPriorizacion['prioriza'] ?? false,
                        'puntuacion_total' => $analisisPriorizacion['puntuacion_total'] ?? 0,
                        'puntuacion_maxima' => 100,
                        'porcentaje' => $analisisPriorizacion['puntuacion_total'] ?? 0,
                        'nivel_prioridad' => $analisisPriorizacion['nivel_prioridad'] ?? 'BAJA'
                    ],
                    'criterios_evaluados' => $analisisPriorizacion['criterios_evaluados'] ?? [],
                    'razonamiento' => $analisisPriorizacion['razonamiento_clinico'] ?? 'Análisis no disponible',
                    'factores_riesgo' => $analisisPriorizacion['factores_riesgo'] ?? [],
                    'recomendaciones' => $analisisPriorizacion['recomendaciones'] ?? [],
                    'conclusion_tecnica' => $analisisPriorizacion['conclusion_tecnica'] ?? 'Conclusión no disponible'
                ]
            ];
            
        } catch (\Exception $e) {
            Log::error("Error parseando respuesta de análisis completo: " . $e->getMessage());
            Log::error("Respuesta recibida: " . substr($response, 0, 500));
            
            // Fallback básico
            return [
                'datos_paciente' => [],
                'analisis_priorizacion' => [
                    'paciente' => [
                        'nombre' => 'Paciente Desconocido',
                        'edad' => 0,
                        'tipo_paciente' => 'Adulto'
                    ],
                    'resultado' => [
                        'prioriza' => false,
                        'puntuacion_total' => 0,
                        'puntuacion_maxima' => 100,
                        'porcentaje' => 0,
                        'nivel_prioridad' => 'BAJA'
                    ],
                    'razonamiento' => 'Error al procesar análisis con IA. Respuesta: ' . substr($response, 0, 200),
                    'factores_riesgo' => [],
                    'recomendaciones' => ['Consultar con médico especialista'],
                    'conclusion_tecnica' => 'Análisis no completado por error técnico'
                ]
            ];
        }
    }

    /**
     * Construir el prompt para análisis de documento médico
     */
    private function buildAnalysisPrompt(string $text): string
    {
        return "Analiza el siguiente documento médico y extrae ÚNICAMENTE la información del paciente que se solicita.
        Responde SOLO con un JSON válido sin texto adicional, comentarios o explicaciones.

        Texto del documento:
        {$text}

        Extrae y devuelve un JSON con esta estructura exacta:
        {
            \"tipo_identificacion\": \"cc|ti|ce|pp|rc\",
            \"numero_identificacion\": \"número sin puntos ni comas\",
            \"nombre\": \"solo nombres\",
            \"apellidos\": \"solo apellidos\",
            \"fecha_nacimiento\": \"YYYY-MM-DD\",
            \"edad\": \"número entero de años\",
            \"sexo\": \"masculino|femenino|otro\"
        }

        Reglas importantes:
        - Si no encuentras un dato, usa null
        - Para tipo_identificacion: cc=Cédula, ti=Tarjeta Identidad, ce=Cédula Extranjería, pp=Pasaporte, rc=Registro Civil
        - Para sexo: usa exactamente \"masculino\", \"femenino\" o \"otro\"
        - Para fecha_nacimiento: OBLIGATORIO formato YYYY-MM-DD (ejemplo: 1985-03-15)
        - Para edad: solo el número entero de años (ejemplo: 38)
        - Para numero_identificacion: solo números, sin puntos, comas o espacios
        - Busca fechas en formatos como: 15/03/1985, 15-03-1985, 15 de marzo de 1985, etc. y conviértelas a YYYY-MM-DD
        - Busca edad en formatos como: 38 años, 38 años de edad, edad: 38, etc.
        - Si encuentras fecha de nacimiento Y edad, usa ambos
        - Si solo encuentras uno de los dos, extrae el que encuentres
        - NO agregues texto explicativo, SOLO el JSON";
    }

    /**
     * Llamar a la API de Gemini
     */
    private function callGeminiAPI(string $prompt, string $apiKey): ?string
    {
        // ⏱️ Aumentar tiempo de ejecución para respuestas largas de IA
        set_time_limit(120); // 2 minutos para análisis médicos complejos
        
        $response = Http::timeout(45)->post($this->baseUrl . '?key=' . $apiKey, [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ],
            'generationConfig' => [
                'temperature' => 0.1,
                'topK' => 1,
                'topP' => 0.8,
                'maxOutputTokens' => 4096, // ✅ Incrementado para razonamientos médicos completos (4x más)
            ]
        ]);

        if ($response->successful()) {
            $data = $response->json();
            return $data['candidates'][0]['content']['parts'][0]['text'] ?? null;
        }

        throw new \Exception("Error en API de Gemini: " . $response->body());
    }

    /**
     * Parsear respuesta de Gemini y extraer JSON
     */
    private function parseGeminiResponse(string $response): array
    {
        // Limpiar la respuesta de posibles caracteres extra
        $response = trim($response);
        
        // Buscar JSON en la respuesta
        if (preg_match('/\{.*\}/s', $response, $matches)) {
            $jsonString = $matches[0];
            $data = json_decode($jsonString, true);
            
            if (json_last_error() === JSON_ERROR_NONE) {
                return $this->validateAndCleanData($data);
            }
        }

        throw new \Exception("No se pudo parsear la respuesta de la IA como JSON válido");
    }

    /**
     * Validar y limpiar los datos extraídos
     */
    private function validateAndCleanData(array $data): array
    {
        $cleanData = [];

        // Validar tipo_identificacion
        $validTypes = ['cc', 'ti', 'ce', 'pp', 'rc'];
        $cleanData['tipo_identificacion'] = in_array($data['tipo_identificacion'] ?? '', $validTypes) 
            ? $data['tipo_identificacion'] 
            : null;

        // Limpiar número de identificación
        $cleanData['numero_identificacion'] = isset($data['numero_identificacion']) 
            ? preg_replace('/[^0-9]/', '', $data['numero_identificacion'])
            : null;

        // Limpiar nombres y apellidos
        $cleanData['nombre'] = isset($data['nombre']) ? trim($data['nombre']) : null;
        $cleanData['apellidos'] = isset($data['apellidos']) ? trim($data['apellidos']) : null;

        // Validar edad
        $cleanData['edad'] = null;
        if (isset($data['edad']) && is_numeric($data['edad'])) {
            $cleanData['edad'] = (int) $data['edad'];
            Log::info("Edad procesada: " . $cleanData['edad']);
        }

        // Validar fecha de nacimiento
        $cleanData['fecha_nacimiento'] = null;
        if (isset($data['fecha_nacimiento']) && $data['fecha_nacimiento']) {
            try {
                $date = new \DateTime($data['fecha_nacimiento']);
                $cleanData['fecha_nacimiento'] = $date->format('Y-m-d');
                Log::info("Fecha de nacimiento procesada: " . $data['fecha_nacimiento'] . " -> " . $cleanData['fecha_nacimiento']);
            } catch (\Exception $e) {
                Log::warning("Fecha de nacimiento inválida: " . $data['fecha_nacimiento'] . " - " . $e->getMessage());
                // Fecha inválida, mantener null
            }
        }

        // Cálculo inverso: si no hay fecha pero sí edad, calcular fecha aproximada
        if (!$cleanData['fecha_nacimiento'] && $cleanData['edad']) {
            $currentYear = date('Y');
            $birthYear = $currentYear - $cleanData['edad'];
            // Usar 1 de enero como fecha aproximada
            $cleanData['fecha_nacimiento'] = $birthYear . '-01-01';
            Log::info("Fecha de nacimiento calculada desde edad {$cleanData['edad']}: {$cleanData['fecha_nacimiento']}");
        }

        if (!$cleanData['fecha_nacimiento'] && !$cleanData['edad']) {
            Log::info("No se encontró fecha_nacimiento ni edad en los datos de IA");
        }

        // Validar sexo
        $validSexes = ['masculino', 'femenino', 'otro'];
        $cleanData['sexo'] = in_array($data['sexo'] ?? '', $validSexes) 
            ? $data['sexo'] 
            : null;

        return $cleanData;
    }

    /**
     * Analizar priorización médica de un paciente usando Google Gemini AI
     */
    public function analizarPriorizacionMedica(array $datosPaciente): array
    {
        $prompt = $this->buildPriorizacionPrompt($datosPaciente);
        
        $maxRetries = count($this->apiKeys);
        $attempt = 0;

        while ($attempt < $maxRetries) {
            try {
                $apiKey = $this->getNextApiKey();
                $response = $this->callGeminiAPI($prompt, $apiKey);
                
                if ($response) {
                    return $this->parsePriorizacionResponse($response, $datosPaciente);
                }
            } catch (\Exception $e) {
                Log::warning("Error con API key {$attempt} en priorización: " . $e->getMessage());
                $attempt++;
                
                if ($attempt >= $maxRetries) {
                    throw new \Exception("Todas las API keys fallaron para análisis de priorización. Último error: " . $e->getMessage());
                }
            }
        }

        throw new \Exception("No se pudo analizar la priorización con ninguna API key");
    }

    /**
     * Construir el prompt para análisis de priorización médica
     */
    private function buildPriorizacionPrompt(array $datosPaciente): string
    {
        $prompt = "Eres un médico especialista en medicina de emergencias y análisis de priorización hospitalaria. ";
        $prompt .= "Analiza los siguientes datos clínicos de un paciente y determina si requiere PRIORIZACIÓN INMEDIATA.\n\n";
        
        $prompt .= "DATOS DEL PACIENTE:\n";
        $prompt .= "Nombre: " . ($datosPaciente['nombre'] ?? 'No especificado') . "\n";
        $prompt .= "Edad: " . ($datosPaciente['edad'] ?? 'No especificada') . " años\n";
        $prompt .= "Sexo: " . ($datosPaciente['sexo'] ?? 'No especificado') . "\n";
        $prompt .= "Tipo de paciente: " . ($datosPaciente['tipo_paciente'] ?? 'Adulto') . "\n";
        
        if (!empty($datosPaciente['diagnostico_principal'])) {
            $prompt .= "Diagnóstico principal: " . $datosPaciente['diagnostico_principal'] . "\n";
        }
        
        $prompt .= "\nSIGNOS VITALES:\n";
        if (!empty($datosPaciente['frecuencia_cardiaca'])) {
            $prompt .= "Frecuencia cardíaca: " . $datosPaciente['frecuencia_cardiaca'] . " lpm\n";
        }
        if (!empty($datosPaciente['frecuencia_respiratoria'])) {
            $prompt .= "Frecuencia respiratoria: " . $datosPaciente['frecuencia_respiratoria'] . " rpm\n";
        }
        if (!empty($datosPaciente['tension_sistolica']) && !empty($datosPaciente['tension_diastolica'])) {
            $prompt .= "Tensión arterial: " . $datosPaciente['tension_sistolica'] . "/" . $datosPaciente['tension_diastolica'] . " mmHg\n";
        }
        if (!empty($datosPaciente['temperatura'])) {
            $prompt .= "Temperatura: " . $datosPaciente['temperatura'] . "°C\n";
        }
        if (!empty($datosPaciente['saturacion_oxigeno'])) {
            $prompt .= "Saturación de oxígeno: " . $datosPaciente['saturacion_oxigeno'] . "%\n";
        }
        if (!empty($datosPaciente['escala_glasgow'])) {
            $prompt .= "Escala de Glasgow: " . $datosPaciente['escala_glasgow'] . "/15\n";
        }
        
        $prompt .= "\nCRITERIOS DE PRIORIZACIÓN:\n";
        $prompt .= "• Edad crítica: <5 años o >70 años = Alta prioridad\n";
        $prompt .= "• Gestantes = Prioridad máxima\n";
        $prompt .= "• Menores de edad = Alta prioridad\n";
        $prompt .= "• Signos vitales alterados = Según severidad\n";
        $prompt .= "• Glasgow <13 = Prioridad crítica\n";
        $prompt .= "• Saturación <90% = Prioridad crítica\n";
        
        $prompt .= "\nINSTRUCCIONES:\n";
        $prompt .= "1. Analiza CADA criterio médico detalladamente\n";
        $prompt .= "2. Evalúa factores de riesgo y correlaciones clínicas\n";
        $prompt .= "3. Determina si el paciente requiere PRIORIZACIÓN (SÍ/NO)\n";
        $prompt .= "4. Proporciona un análisis técnico EXHAUSTIVO y PROFESIONAL\n";
        $prompt .= "5. Explica CADA factor que influye en la decisión\n";
        $prompt .= "6. Incluye recomendaciones clínicas específicas\n\n";
        
        $prompt .= "RESPONDE EN FORMATO JSON:\n";
        $prompt .= "{\n";
        $prompt .= '  "prioriza": true/false,' . "\n";
        $prompt .= '  "nivel_prioridad": "CRÍTICA/ALTA/MEDIA/BAJA",' . "\n";
        $prompt .= '  "puntuacion": 0-100,' . "\n";
        $prompt .= '  "razonamiento": "Análisis técnico exhaustivo de 200+ palabras explicando CADA criterio evaluado, factores de riesgo identificados, correlaciones clínicas, y justificación completa de la decisión",' . "\n";
        $prompt .= '  "factores_riesgo": ["factor1", "factor2", ...],' . "\n";
        $prompt .= '  "recomendaciones": ["recomendación1", "recomendación2", ...],' . "\n";
        $prompt .= '  "conclusion_tecnica": "Conclusión médica profesional del análisis"' . "\n";
        $prompt .= "}\n\n";
        
        $prompt .= "IMPORTANTE: Tu análisis debe ser técnico, detallado y comprensible para médicos profesionales.";
        
        return $prompt;
    }

    /**
     * Parsear respuesta de Gemini para análisis de priorización
     */
    private function parsePriorizacionResponse(string $response, array $datosPaciente): array
    {
        try {
            // Buscar el JSON en la respuesta
            $jsonStart = strpos($response, '{');
            $jsonEnd = strrpos($response, '}');
            
            if ($jsonStart === false || $jsonEnd === false) {
                throw new \Exception("No se encontró JSON válido en la respuesta");
            }
            
            $jsonString = substr($response, $jsonStart, $jsonEnd - $jsonStart + 1);
            $analisis = json_decode($jsonString, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception("Error al decodificar JSON: " . json_last_error_msg());
            }
            
            // Validar campos requeridos
            $analisis['prioriza'] = $analisis['prioriza'] ?? false;
            $analisis['nivel_prioridad'] = $analisis['nivel_prioridad'] ?? 'BAJA';
            $analisis['puntuacion'] = $analisis['puntuacion'] ?? 0;
            $analisis['razonamiento'] = $analisis['razonamiento'] ?? 'Análisis no disponible';
            $analisis['factores_riesgo'] = $analisis['factores_riesgo'] ?? [];
            $analisis['recomendaciones'] = $analisis['recomendaciones'] ?? [];
            $analisis['conclusion_tecnica'] = $analisis['conclusion_tecnica'] ?? 'Conclusión no disponible';
            
            // Estructurar respuesta para compatibilidad con frontend
            return [
                'paciente' => [
                    'nombre' => $datosPaciente['nombre'] ?? 'Paciente Desconocido',
                    'edad' => $datosPaciente['edad'] ?? 0,
                    'tipo_paciente' => $datosPaciente['tipo_paciente'] ?? 'Adulto'
                ],
                'resultado' => [
                    'prioriza' => $analisis['prioriza'],
                    'puntuacion_total' => $analisis['puntuacion'],
                    'puntuacion_maxima' => 100,
                    'porcentaje' => $analisis['puntuacion'],
                    'nivel_prioridad' => $analisis['nivel_prioridad']
                ],
                'razonamiento' => $analisis['razonamiento'],
                'factores_riesgo' => $analisis['factores_riesgo'],
                'recomendaciones' => $analisis['recomendaciones'],
                'conclusion_tecnica' => $analisis['conclusion_tecnica']
            ];
            
        } catch (\Exception $e) {
            Log::error("Error parseando respuesta de priorización: " . $e->getMessage());
            
            // Fallback con análisis básico - estructura compatible con frontend
            return [
                'paciente' => [
                    'nombre' => $datosPaciente['nombre'] ?? 'Paciente Desconocido',
                    'edad' => $datosPaciente['edad'] ?? 0,
                    'tipo_paciente' => $datosPaciente['tipo_paciente'] ?? 'Adulto'
                ],
                'resultado' => [
                    'prioriza' => false,
                    'puntuacion_total' => 0,
                    'puntuacion_maxima' => 100,
                    'porcentaje' => 0,
                    'nivel_prioridad' => 'BAJA'
                ],
                'razonamiento' => 'Error al procesar análisis con IA. Se requiere revisión manual.',
                'factores_riesgo' => [],
                'recomendaciones' => ['Consultar con médico especialista'],
                'conclusion_tecnica' => 'Análisis no completado por error técnico'
            ];
        }
    }
}
