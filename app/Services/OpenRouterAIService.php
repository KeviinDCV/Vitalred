<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Smalot\PdfParser\Parser;

class OpenRouterAIService
{
    private string $apiKey;
    private string $baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
    private string $model = 'deepseek/deepseek-chat-v3.1:free';

    public function __construct()
    {
        $this->apiKey = env('OPENROUTER_API_KEY', '');
        
        if (empty($this->apiKey)) {
            Log::error('OpenRouter API Key no configurada en .env');
            throw new \Exception('API Key de OpenRouter no configurada. Por favor agregue OPENROUTER_API_KEY en el archivo .env');
        }
        
        Log::info('OpenRouterAIService inicializado correctamente');
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
     * Extraer texto de PDF (con fallback automático a OCR para PDFs escaneados)
     */
    private function extractTextFromPdf(string $filePath): string
    {
        try {
            // Intentar extracción de texto nativo primero
            $parser = new Parser();
            $pdf = $parser->parseFile($filePath);
            $text = $pdf->getText();

            // Si el texto extraido tiene contenido significativo, usarlo
            if (!empty(trim($text)) && strlen(trim($text)) > 50) {
                Log::info("PDF con texto nativo extraído exitosamente", ['longitud' => strlen($text)]);
                return $text;
            }

            // Si el PDF no tiene texto o es muy corto, es probablemente un PDF escaneado
            Log::warning("PDF sin texto nativo detectado - Usando OCR");
            
            // Intentar OCR automáticamente
            return $this->extractTextFromPdfWithOCR($filePath);
            
        } catch (\Exception $e) {
            Log::warning("Error con extracción nativa de PDF, intentando OCR: " . $e->getMessage());
            
            // Si falla la extracción nativa, intentar OCR
            try {
                return $this->extractTextFromPdfWithOCR($filePath);
            } catch (\Exception $ocrException) {
                Log::error("Error tanto en extracción nativa como OCR: " . $ocrException->getMessage());
                throw new \Exception("No se pudo extraer el texto del PDF ni con OCR: " . $ocrException->getMessage());
            }
        }
    }

    /**
     * Extraer texto de PDF usando OCR (para PDFs escaneados)
     */
    private function extractTextFromPdfWithOCR(string $filePath): string
    {
        try {
            Log::info("=== INICIANDO EXTRACCIÓN OCR DE PDF ===", [
                'archivo' => basename($filePath),
                'ruta_completa' => $filePath,
                'existe' => file_exists($filePath),
                'tamaño' => file_exists($filePath) ? filesize($filePath) : 0
            ]);
            
            if (!file_exists($filePath)) {
                throw new \Exception("Archivo no encontrado: {$filePath}");
            }
            
            // Usar OCR.space API para PDFs
            Log::info("Enviando archivo a OCR.space API...");
            
            $response = Http::timeout(120)->attach(
                'file', file_get_contents($filePath), basename($filePath)
            )->post('https://api.ocr.space/parse/image', [
                'apikey' => 'helloworld',
                'language' => 'spa',
                'isOverlayRequired' => 'false',
                'detectOrientation' => 'true',
                'scale' => 'true',
                'OCREngine' => '2',
            ]);

            Log::info("Respuesta recibida de OCR.space", [
                'status' => $response->status(),
                'successful' => $response->successful()
            ]);

            if ($response->successful()) {
                $result = $response->json();
                
                Log::info("Contenido respuesta OCR", [
                    'OCRExitCode' => $result['OCRExitCode'] ?? 'no definido',
                    'IsErroredOnProcessing' => $result['IsErroredOnProcessing'] ?? false,
                    'ErrorMessage' => $result['ErrorMessage'] ?? [],
                    'tiene_ParsedResults' => isset($result['ParsedResults'])
                ]);

                if (isset($result['ParsedResults']) && is_array($result['ParsedResults'])) {
                    $allText = '';
                    
                    // Procesar todas las páginas del PDF
                    foreach ($result['ParsedResults'] as $index => $pageResult) {
                        Log::info("Procesando página {$index}", [
                            'tiene_ParsedText' => isset($pageResult['ParsedText']),
                            'longitud' => isset($pageResult['ParsedText']) ? strlen($pageResult['ParsedText']) : 0
                        ]);
                        
                        if (isset($pageResult['ParsedText'])) {
                            $allText .= $pageResult['ParsedText'] . "\n\n";
                        }
                    }

                    if (!empty(trim($allText))) {
                        Log::info("✅ OCR EXITOSO PARA PDF", [
                            'longitud_total' => strlen($allText),
                            'preview' => substr($allText, 0, 200) . '...'
                        ]);
                        return trim($allText);
                    } else {
                        Log::warning("OCR no extrajo texto del PDF (texto vacío)");
                    }
                } else {
                    Log::error("ParsedResults no disponible en respuesta OCR");
                }

                // Si hay un mensaje de error en la respuesta
                $errorMsg = $result['ErrorMessage'][0] ?? $result['ErrorMessage'] ?? 'Error desconocido';
                Log::error("Error en respuesta OCR", ['error' => $errorMsg]);
                throw new \Exception("Error en OCR: " . $errorMsg);
            } else {
                Log::error("Error HTTP al contactar OCR.space", [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new \Exception("Error al contactar el servicio OCR: HTTP " . $response->status());
            }
        } catch (\Exception $e) {
            Log::error("❌ ERROR CRÍTICO EN OCR DE PDF", [
                'mensaje' => $e->getMessage(),
                'archivo' => $filePath,
                'trace' => $e->getTraceAsString()
            ]);
            throw new \Exception("No se pudo extraer texto del PDF con OCR: " . $e->getMessage());
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
                'apikey' => 'helloworld',
                'language' => 'spa',
                'isOverlayRequired' => 'false',
                'detectOrientation' => 'true',
                'scale' => 'true',
                'OCREngine' => '2'
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
                    throw new \Exception("Error en el servicio OCR: " . ($result['ErrorMessage'] ?? 'Error desconocido'));
                }
            } else {
                throw new \Exception("Error al contactar el servicio OCR");
            }
        } catch (\Exception $e) {
            Log::error("Error extrayendo texto de imagen: " . $e->getMessage());
            throw new \Exception("No se pudo extraer el texto de la imagen: " . $e->getMessage());
        }
    }

    /**
     * Extraer texto de documento Word (básico)
     */
    private function extractTextFromWord(string $filePath): string
    {
        throw new \Exception("Extracción de documentos Word no implementada. Por favor convierta a PDF.");
    }

    /**
     * Analizar texto con OpenRouter (DeepSeek 3.1) y extraer datos del paciente
     */
    public function analyzePatientDocument(string $text): array
    {
        try {
            $prompt = $this->buildAnalysisPrompt($text);
            $response = $this->callOpenRouterAPI($prompt);
            $patientData = $this->parseAIResponse($response);
            return $this->validateAndCleanData($patientData);
        } catch (\Exception $e) {
            Log::error("Error analizando documento con OpenRouter: " . $e->getMessage());
            throw new \Exception("No se pudo analizar el documento: " . $e->getMessage());
        }
    }

    /**
     * Análisis libre de historia clínica - La IA analiza libremente el texto completo
     */
    public function analizarHistoriaClinicaLibre(string $textoCompleto): string
    {
        try {
            $prompt = $this->buildPromptAnalisisLibre($textoCompleto);
            $response = $this->callOpenRouterAPI($prompt);
            
            Log::info('Análisis libre completado con OpenRouter');
            
            return $response;
        } catch (\Exception $e) {
            Log::error("Error en análisis libre con OpenRouter: " . $e->getMessage());
            throw new \Exception("No se pudo completar el análisis: " . $e->getMessage());
        }
    }

    /**
     * Analizar con prompt específico personalizado
     */
    public function analizarConPromptEspecifico(string $prompt): string
    {
        try {
            $response = $this->callOpenRouterAPI($prompt);
            
            Log::info('Análisis con prompt específico completado con OpenRouter');
            
            return $response;
        } catch (\Exception $e) {
            Log::error("Error en análisis con prompt específico: " . $e->getMessage());
            throw new \Exception("No se pudo completar el análisis: " . $e->getMessage());
        }
    }

    /**
     * Construir prompt simple para análisis libre de historia clínica
     */
    private function buildPromptAnalisisLibre(string $textoCompleto): string
    {
        $prompt = "Eres un médico experto analizando una historia clínica. ";
        $prompt .= "Por favor, analiza el siguiente documento médico de forma detallada y profesional.\n\n";
        $prompt .= "HISTORIA CLÍNICA:\n";
        $prompt .= $textoCompleto . "\n\n";
        $prompt .= "Proporciona un análisis médico completo que incluya:\n";
        $prompt .= "1. Resumen de datos demográficos del paciente\n";
        $prompt .= "2. Diagnóstico principal y secundarios\n";
        $prompt .= "3. Estado clínico actual y signos vitales relevantes\n";
        $prompt .= "4. Antecedentes médicos importantes\n";
        $prompt .= "5. Tratamiento actual\n";
        $prompt .= "6. Factores de riesgo identificados\n";
        $prompt .= "7. Recomendaciones médicas\n\n";
        $prompt .= "Tu respuesta debe ser clara, profesional y técnicamente precisa.";
        
        return $prompt;
    }

    /**
     * Nuevo método: Análisis completo de historia clínica con priorización integrada
     */
    public function analizarHistoriaClinicaCompleta(string $text): array
    {
        try {
            $prompt = $this->buildHistoriaClinicaCompletaPrompt($text);
            $response = $this->callOpenRouterAPI($prompt);
            return $this->parseHistoriaClinicaResponse($response);
        } catch (\Exception $e) {
            Log::error("Error en análisis completo con OpenRouter: " . $e->getMessage());
            throw new \Exception("Error en el análisis: " . $e->getMessage());
        }
    }

    /**
     * Construir prompt completo para extracción de datos clínicos + análisis de priorización
     */
    private function buildHistoriaClinicaCompletaPrompt(string $text): string
    {
        $prompt = "Eres un sistema de análisis médico especializado. Analiza la siguiente historia clínica y extrae TODA la información disponible.\n\n";
        $prompt .= "HISTORIA CLÍNICA:\n";
        $prompt .= $text . "\n\n";
        $prompt .= "INSTRUCCIONES:\n";
        $prompt .= "1. Extrae TODOS los datos del paciente que encuentres en el documento\n";
        $prompt .= "2. NO inventes ni asumas datos que no estén explícitamente en el texto\n";
        $prompt .= "3. Si un dato no está disponible, usa null\n";
        $prompt .= "4. Presta especial atención a signos vitales, síntomas y datos clínicos\n\n";
        $prompt .= "Responde ÚNICAMENTE con un JSON válido (sin markdown, sin explicaciones adicionales) con esta estructura:\n";
        $prompt .= "{\n";
        $prompt .= '  "nombre": "nombre del paciente",' . "\n";
        $prompt .= '  "apellidos": "apellidos del paciente",' . "\n";
        $prompt .= '  "tipo_identificacion": "CC/TI/RC/etc",' . "\n";
        $prompt .= '  "numero_identificacion": "número",' . "\n";
        $prompt .= '  "fecha_nacimiento": "YYYY-MM-DD",' . "\n";
        $prompt .= '  "edad": número,' . "\n";
        $prompt .= '  "sexo": "masculino/femenino/otro",' . "\n";
        $prompt .= '  "asegurador": "nombre EPS/asegurador",' . "\n";
        $prompt .= '  "departamento": "departamento",' . "\n";
        $prompt .= '  "ciudad": "ciudad",' . "\n";
        $prompt .= '  "institucion_remitente": "nombre institución",' . "\n";
        $prompt .= '  "tipo_paciente": "Adulto/Gestante/Menor de edad",' . "\n";
        $prompt .= '  "diagnostico_principal": "diagnóstico principal",' . "\n";
        $prompt .= '  "diagnostico_1": "diagnóstico secundario 1",' . "\n";
        $prompt .= '  "diagnostico_2": "diagnóstico secundario 2",' . "\n";
        $prompt .= '  "fecha_ingreso": "YYYY-MM-DD",' . "\n";
        $prompt .= '  "dias_hospitalizados": número,' . "\n";
        $prompt .= '  "motivo_consulta": "motivo de consulta",' . "\n";
        $prompt .= '  "clasificacion_triage": "Triage I-V",' . "\n";
        $prompt .= '  "enfermedad_actual": "descripción enfermedad actual",' . "\n";
        $prompt .= '  "antecedentes": "antecedentes médicos",' . "\n";
        $prompt .= '  "frecuencia_cardiaca": número,' . "\n";
        $prompt .= '  "frecuencia_respiratoria": número,' . "\n";
        $prompt .= '  "temperatura": número,' . "\n";
        $prompt .= '  "tension_sistolica": número,' . "\n";
        $prompt .= '  "tension_diastolica": número,' . "\n";
        $prompt .= '  "saturacion_oxigeno": número,' . "\n";
        $prompt .= '  "glucometria": número,' . "\n";
        $prompt .= '  "escala_glasgow": "número o rango",' . "\n";
        $prompt .= '  "examen_fisico": "hallazgos del examen físico",' . "\n";
        $prompt .= '  "tratamiento": "tratamiento actual",' . "\n";
        $prompt .= '  "plan_terapeutico": "plan terapéutico",' . "\n";
        $prompt .= '  "motivo_remision": "motivo de remisión",' . "\n";
        $prompt .= '  "tipo_solicitud": "tipo de solicitud",' . "\n";
        $prompt .= '  "especialidad_solicitada": "especialidad",' . "\n";
        $prompt .= '  "requerimiento_oxigeno": "SI/NO",' . "\n";
        $prompt .= '  "tipo_servicio": "tipo de servicio solicitado",' . "\n";
        $prompt .= '  "tipo_apoyo": "tipo de apoyo diagnóstico"' . "\n";
        $prompt .= "}\n";
        
        return $prompt;
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
            $data = json_decode($jsonString, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception("Error al decodificar JSON: " . json_last_error_msg());
            }
            
            return $data;
        } catch (\Exception $e) {
            Log::error("Error parseando respuesta de OpenRouter: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Construir el prompt para análisis de documento médico
     */
    private function buildAnalysisPrompt(string $text): string
    {
        $prompt = "Eres un sistema experto de análisis de documentos médicos. Analiza el siguiente documento y extrae los datos del paciente.\n\n";
        $prompt .= "DOCUMENTO MÉDICO:\n";
        $prompt .= $text . "\n\n";
        $prompt .= "Extrae la siguiente información y responde ÚNICAMENTE con un JSON válido (sin markdown):\n";
        $prompt .= "{\n";
        $prompt .= '  "nombre": "nombre completo del paciente",' . "\n";
        $prompt .= '  "apellidos": "apellidos del paciente",' . "\n";
        $prompt .= '  "tipo_identificacion": "CC/TI/RC/etc",' . "\n";
        $prompt .= '  "numero_identificacion": "número de documento",' . "\n";
        $prompt .= '  "fecha_nacimiento": "YYYY-MM-DD o null",' . "\n";
        $prompt .= '  "edad": número o null,' . "\n";
        $prompt .= '  "sexo": "masculino/femenino/otro",' . "\n";
        $prompt .= '  "diagnostico_principal": "diagnóstico principal",' . "\n";
        $prompt .= '  "motivo_consulta": "motivo de consulta o ingreso"' . "\n";
        $prompt .= "}\n";
        $prompt .= "Si algún dato no está disponible en el documento, usa null.";
        
        return $prompt;
    }

    /**
     * Llamar a la API de OpenRouter con DeepSeek 3.1
     */
    private function callOpenRouterAPI(string $prompt): string
    {
        try {
            Log::info("Llamando a OpenRouter API con DeepSeek 3.1");
            
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'HTTP-Referer' => config('app.url', 'http://localhost'),
                'X-Title' => 'Vital-Red Medical System',
                'Content-Type' => 'application/json',
            ])->timeout(60)->post($this->baseUrl, [
                'model' => $this->model,
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ]
            ]);

            if (!$response->successful()) {
                $errorBody = $response->body();
                Log::error("Error en llamada a OpenRouter API: " . $errorBody);
                throw new \Exception("Error en la API de OpenRouter: " . $response->status());
            }

            $data = $response->json();
            
            if (!isset($data['choices'][0]['message']['content'])) {
                throw new \Exception("Respuesta inválida de la API de OpenRouter");
            }

            $content = $data['choices'][0]['message']['content'];
            Log::info("Respuesta recibida de OpenRouter, longitud: " . strlen($content));
            
            return $content;
        } catch (\Exception $e) {
            Log::error("Error llamando a OpenRouter API: " . $e->getMessage());
            throw new \Exception("Error al comunicarse con OpenRouter: " . $e->getMessage());
        }
    }

    /**
     * Parsear respuesta de la IA y extraer JSON
     */
    private function parseAIResponse(string $response): array
    {
        try {
            // Buscar JSON en la respuesta (puede venir con markdown o texto adicional)
            $jsonStart = strpos($response, '{');
            $jsonEnd = strrpos($response, '}');
            
            if ($jsonStart === false || $jsonEnd === false) {
                throw new \Exception("No se encontró JSON en la respuesta de la IA");
            }
            
            $jsonString = substr($response, $jsonStart, $jsonEnd - $jsonStart + 1);
            $data = json_decode($jsonString, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception("Error al parsear JSON: " . json_last_error_msg());
            }
            
            return $data;
        } catch (\Exception $e) {
            Log::error("Error parseando respuesta de IA: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Validar y limpiar los datos extraídos
     */
    private function validateAndCleanData(array $data): array
    {
        // Establecer valores por defecto para campos requeridos
        $cleanData = [
            'nombre' => $data['nombre'] ?? '',
            'apellidos' => $data['apellidos'] ?? '',
            'tipo_identificacion' => $data['tipo_identificacion'] ?? 'CC',
            'numero_identificacion' => $data['numero_identificacion'] ?? '',
            'fecha_nacimiento' => $data['fecha_nacimiento'] ?? null,
            'edad' => $data['edad'] ?? null,
            'sexo' => $data['sexo'] ?? 'otro',
            'diagnostico_principal' => $data['diagnostico_principal'] ?? '',
            'motivo_consulta' => $data['motivo_consulta'] ?? '',
        ];

        // Validar y limpiar edad
        if (isset($cleanData['edad']) && is_numeric($cleanData['edad'])) {
            $cleanData['edad'] = (int) $cleanData['edad'];
        }

        // Validar fecha de nacimiento
        if (isset($cleanData['fecha_nacimiento']) && !empty($cleanData['fecha_nacimiento'])) {
            try {
                $date = new \DateTime($cleanData['fecha_nacimiento']);
                $cleanData['fecha_nacimiento'] = $date->format('Y-m-d');
            } catch (\Exception $e) {
                $cleanData['fecha_nacimiento'] = null;
            }
        }

        // Normalizar sexo
        $cleanData['sexo'] = strtolower($cleanData['sexo']);
        if (!in_array($cleanData['sexo'], ['masculino', 'femenino', 'otro'])) {
            $cleanData['sexo'] = 'otro';
        }

        return $cleanData;
    }

    /**
     * Analizar priorización médica de un paciente usando OpenRouter con DeepSeek 3.1
     */
    public function analizarPriorizacionMedica(array $datosPaciente): array
    {
        try {
            $prompt = $this->buildPriorizacionPrompt($datosPaciente);
            $response = $this->callOpenRouterAPI($prompt);
            return $this->parsePriorizacionResponse($response, $datosPaciente);
        } catch (\Exception $e) {
            Log::error("Error en análisis de priorización con OpenRouter: " . $e->getMessage());
            throw new \Exception("Error en análisis de priorización: " . $e->getMessage());
        }
    }

    /**
     * Construir el prompt para análisis de priorización médica
     */
    private function buildPriorizacionPrompt(array $datosPaciente): string
    {
        $prompt = "Eres un sistema experto de priorización médica. Analiza los siguientes datos del paciente y determina su nivel de prioridad.\n\n";
        $prompt .= "CRITERIOS DE PRIORIZACIÓN:\n";
        $prompt .= "- Edad: <5 años (5), 6-17 años (4), 18-69 años (1), >70 años (4)\n";
        $prompt .= "- Tipo Paciente: Gestante (5), Menor (4), Adulto (1)\n";
        $prompt .= "- Signos vitales críticos: valores fuera de rangos normales\n";
        $prompt .= "- Diagnósticos de alta complejidad\n";
        $prompt .= "- Servicios UCI y especializados\n\n";
        $prompt .= "DATOS DEL PACIENTE:\n";
        $prompt .= json_encode($datosPaciente, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n\n";
        $prompt .= "Responde con un JSON que contenga:\n";
        $prompt .= "{\n";
        $prompt .= '  "prioriza": true/false,' . "\n";
        $prompt .= '  "nivel_prioridad": "ALTA/MEDIA/BAJA",' . "\n";
        $prompt .= '  "puntuacion": número de 0-100,' . "\n";
        $prompt .= '  "razonamiento": "explicación detallada",' . "\n";
        $prompt .= '  "factores_riesgo": ["factor1", "factor2"],' . "\n";
        $prompt .= '  "recomendaciones": ["recomendación1", "recomendación2"],' . "\n";
        $prompt .= '  "conclusion_tecnica": "conclusión médica profesional"' . "\n";
        $prompt .= "}\n";
        
        return $prompt;
    }

    /**
     * Parsear respuesta para análisis de priorización
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
            
            // Fallback con análisis básico
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
