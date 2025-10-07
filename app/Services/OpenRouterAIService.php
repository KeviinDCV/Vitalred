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
            // ✅ CONECTAR: Pasar el texto original para que funcione el fallback parsing
            return $this->parseHistoriaClinicaResponse($response, $text);
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
        $prompt .= "⚠️ IMPORTANTE - SEPARACIÓN DE NOMBRES Y APELLIDOS:\n";
        $prompt .= "- Si el nombre completo del paciente aparece junto (ejemplo: 'Ricaute Ulchur Choque'), debes separarlo correctamente en nombre(s) y apellido(s)\n";
        $prompt .= "- En Colombia/América Latina, generalmente las primeras 1-2 palabras son NOMBRES y las últimas 1-2 son APELLIDOS\n";
        $prompt .= "- Ejemplos de separación correcta:\n";
        $prompt .= "  * 'Juan Pérez' → nombre: 'Juan', apellidos: 'Pérez'\n";
        $prompt .= "  * 'María García López' → nombre: 'María', apellidos: 'García López'\n";
        $prompt .= "  * 'Carlos Andrés Ramírez' → nombre: 'Carlos Andrés', apellidos: 'Ramírez'\n";
        $prompt .= "  * 'Ricaute Ulchur Choque' → nombre: 'Ricaute', apellidos: 'Ulchur Choque'\n";
        $prompt .= "  * 'Ana María Rodríguez Sánchez' → nombre: 'Ana María', apellidos: 'Rodríguez Sánchez'\n";
        $prompt .= "- Si no estás seguro de la separación, asume: 1 nombre + resto apellidos\n";
        $prompt .= "- NUNCA pongas el nombre completo en un solo campo\n\n";
        $prompt .= "⚠️ IMPORTANTE - EXTRACCIÓN DEL TIPO DE IDENTIFICACIÓN:\n";
        $prompt .= "- Busca e identifica el tipo de documento de identidad del paciente en el texto\n";
        $prompt .= "- Tipos de identificación válidos en Colombia:\n";
        $prompt .= "  * CC = Cédula de Ciudadanía (adultos mayores de 18 años)\n";
        $prompt .= "  * TI = Tarjeta de Identidad (menores de edad entre 7-17 años)\n";
        $prompt .= "  * RC = Registro Civil (menores de 7 años)\n";
        $prompt .= "  * CE = Cédula de Extranjería (extranjeros residentes)\n";
        $prompt .= "  * PA = Pasaporte (extranjeros no residentes)\n";
        $prompt .= "  * AS = Adulto Sin Identificación\n";
        $prompt .= "  * MS = Menor Sin Identificación\n";
        $prompt .= "- Busca palabras clave como: 'Cédula', 'C.C.', 'CC', 'Documento', 'Identificación', 'TI', 'RC', etc.\n";
        $prompt .= "- Si no encuentras el tipo explícito pero hay edad, infiere: edad >= 18 años = 'CC', edad 7-17 = 'TI', edad < 7 = 'RC'\n";
        $prompt .= "- Si definitivamente no puedes determinar el tipo, usa null\n\n";
        $prompt .= "⚠️ IMPORTANTE - EXTRACCIÓN DE DEPARTAMENTO Y CIUDAD:\n";
        $prompt .= "- Busca e identifica el departamento y ciudad de residencia del paciente en el texto\n";
        $prompt .= "- Departamentos de Colombia: Amazonas, Antioquia, Arauca, Atlántico, Bolívar, Boyacá, Caldas, Caquetá, Casanare, Cauca, Cesar, Chocó, Córdoba, Cundinamarca, Guainía, Guaviare, Huila, La Guajira, Magdalena, Meta, Nariño, Norte de Santander, Putumayo, Quindío, Risaralda, San Andrés y Providencia, Santander, Sucre, Tolima, Valle del Cauca, Vaupés, Vichada\n";
        $prompt .= "- Capitales principales: Leticia, Medellín, Arauca, Barranquilla, Cartagena, Tunja, Manizales, Florencia, Yopal, Popayán, Valledupar, Quibdó, Montería, Bogotá, Inírida, San José del Guaviare, Neiva, Riohacha, Santa Marta, Villavicencio, Pasto, Cúcuta, Mocoa, Armenia, Pereira, San Andrés, Bucaramanga, Sincelejo, Ibagué, Cali, Mitú, Puerto Carreño\n";
        $prompt .= "- Si encuentra abreviaciones como 'Bog' = Bogotá, 'Med' = Medellín, 'Cali' = Cali, etc.\n";
        $prompt .= "- Busca palabras clave como: 'Procedencia:', 'Residencia:', 'Dirección:', 'Domicilio:', 'Vive en:', etc.\n";
        $prompt .= "- Si solo tienes ciudad, infiere el departamento más probable (ej: Medellín = Antioquia, Cali = Valle del Cauca)\n";
        $prompt .= "- Si no encuentras datos geográficos explícitos, usa null\n\n";
        $prompt .= "⚠️ CRÍTICO - EXTRACCIÓN DEL ASEGURADOR (OBLIGATORIO):\n";
        $prompt .= "- BUSCA exactamente estas palabras: 'Entidad:', 'EPS', 'NUEVA EMPRESA PROMOTORA', 'Régimen:', 'DATOS DE AFILIACIÓN'\n";
        $prompt .= "- Si encuentras 'NUEVA EMPRESA PROMOTORA DE SALUD' → usa 'Nueva EPS'\n";
        $prompt .= "- Si encuentras 'Entidad:' seguido de cualquier nombre → usa ese nombre\n";
        $prompt .= "- Variaciones: 'Nueva EPS', 'NUEVA EPS', 'Nueva Empresa Promotora'\n";
        $prompt .= "- OBLIGATORIO: SIEMPRE incluye el campo 'asegurador' en el JSON, aunque sea null\n\n";

        $prompt .= "⚠️ CRÍTICO - EXTRACCIÓN GEOGRÁFICA (OBLIGATORIO):\n";
        $prompt .= "- BUSCA exactamente: 'Lugar Residencia:', 'POPAYAN', 'Dirección:', 'Residencia:', 'Domicilio:'\n";
        $prompt .= "- Si encuentras 'POPAYAN' o 'Popayán' → ciudad: 'Popayán', departamento: 'Cauca'\n";
        $prompt .= "- Si encuentras cualquier ciudad después de 'Lugar Residencia:' → úsa esa ciudad\n";
        $prompt .= "- Inferencias críticas: POPAYAN=Popayán,Cauca | BOGOTA=Bogotá,Cundinamarca | MEDELLIN=Medellín,Antioquia | CALI=Cali,Valle del Cauca\n";
        $prompt .= "- OBLIGATORIO: SIEMPRE incluye los campos 'departamento' y 'ciudad' en el JSON, aunque sean null\n\n";

        $prompt .= "⚠️ CRÍTICO - INSTITUCIÓN REMITENTE:\n";
        $prompt .= "- BUSCA nombres de hospitales, clínicas, centros de salud, IPS\n";
        $prompt .= "- Palabras clave: 'Hospital', 'Clínica', 'Centro', 'IPS', 'Remite', 'Referido por', 'Enviado desde'\n";
        $prompt .= "- SIEMPRE incluye el campo 'institucion_remitente' en el JSON, aunque sea null\n\n";
        $prompt .= "Responde ÚNICAMENTE con un JSON válido (sin markdown, sin explicaciones adicionales) con esta estructura:\n";
        $prompt .= "{\n";
        $prompt .= '  "asegurador": "nombre EPS/asegurador",' . "\n";
        $prompt .= '  "departamento": "departamento",' . "\n";
        $prompt .= '  "ciudad": "ciudad",' . "\n";
        $prompt .= '  "institucion_remitente": "nombre institución",' . "\n";
        $prompt .= '  "nombre": "nombre(s) del paciente - separado correctamente",' . "\n";
        $prompt .= '  "apellidos": "apellido(s) del paciente - separado correctamente",' . "\n";
        $prompt .= '  "tipo_identificacion": "CC/TI/RC/CE/PA/AS/MS - extraído o inferido según edad",' . "\n";
        $prompt .= '  "numero_identificacion": "número",' . "\n";
        $prompt .= '  "fecha_nacimiento": "YYYY-MM-DD",' . "\n";
        $prompt .= '  "edad": número,' . "\n";
        $prompt .= '  "sexo": "masculino/femenino/otro",' . "\n";
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
    private function parseHistoriaClinicaResponse(string $response, string $originalText = ''): array
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
            
            // ✅ FALLBACK: Si la IA no devolvió campos sociodemográficos, extraerlos directamente del texto
            $data = $this->addMissingSociodemographicData($data, $originalText);
            
            return $data;
        } catch (\Exception $e) {
            Log::error("Error parseando respuesta de OpenRouter: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Agregar datos sociodemográficos faltantes extrayéndolos directamente del texto
     */
    private function addMissingSociodemographicData(array $data, string $text): array
    {
        Log::info("🔍 FALLBACK: Verificando campos sociodemográficos faltantes");
        
        // Si no hay asegurador, buscarlo en el texto
        if (empty($data['asegurador'])) {
            $asegurador = $this->extractAseguradorFromText($text);
            if ($asegurador) {
                $data['asegurador'] = $asegurador;
                Log::info("✅ FALLBACK: Asegurador extraído del texto: {$asegurador}");
            }
        }
        
        // Si no hay ciudad, buscarla en el texto
        if (empty($data['ciudad'])) {
            $ciudad = $this->extractCiudadFromText($text);
            if ($ciudad) {
                $data['ciudad'] = $ciudad;
                Log::info("✅ FALLBACK: Ciudad extraída del texto: {$ciudad}");
            }
        }
        
        // Si no hay departamento pero sí ciudad, inferirlo
        if (empty($data['departamento'])) {
            $departamento = $this->extractDepartamentoFromText($text, $data['ciudad'] ?? '');
            if ($departamento) {
                $data['departamento'] = $departamento;
                Log::info("✅ FALLBACK: Departamento extraído/inferido: {$departamento}");
            }
        }
        
        // Si no hay institución remitente, buscarla en el texto
        if (empty($data['institucion_remitente'])) {
            $institucion = $this->extractInstitucionFromText($text);
            if ($institucion) {
                $data['institucion_remitente'] = $institucion;
                Log::info("✅ FALLBACK: Institución extraída del texto: {$institucion}");
            }
        }
        
        return $data;
    }

    /**
     * Extraer asegurador directamente del texto
     */
    private function extractAseguradorFromText(string $text): ?string
    {
        // Buscar patrones específicos del asegurador
        $patterns = [
            '/Entidad:\s*([^\n\r\t]+)/i',
            '/EPS:\s*([^\n\r\t]+)/i',
            '/NUEVA EMPRESA PROMOTORA DE SALUD/i',
            '/Asegurador:\s*([^\n\r\t]+)/i',
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $text, $matches)) {
                $asegurador = trim($matches[1] ?? $matches[0]);
                
                // Mapear nombres comunes
                if (stripos($asegurador, 'NUEVA EMPRESA PROMOTORA') !== false) {
                    return 'Nueva EPS';
                }
                if (stripos($asegurador, 'SANITAS') !== false) {
                    return 'Sanitas';
                }
                
                return $asegurador;
            }
        }
        
        return null;
    }

    /**
     * Extraer ciudad directamente del texto
     */
    private function extractCiudadFromText(string $text): ?string
    {
        // Buscar patrones específicos de ciudad
        $patterns = [
            '/Lugar Residencia:\s*([^\n\r\t]+)/i',
            '/Residencia:\s*([^\n\r\t]+)/i',
            '/Procedencia:\s*([^\n\r\t]+)/i',
            '/Domicilio:\s*([^\n\r\t]+)/i',
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $text, $matches)) {
                $ciudad = trim($matches[1]);
                
                // Mapear nombres comunes
                if (stripos($ciudad, 'POPAYAN') !== false) {
                    return 'Popayán';
                }
                if (stripos($ciudad, 'BOGOTA') !== false) {
                    return 'Bogotá';
                }
                
                return $ciudad;
            }
        }
        
        return null;
    }

    /**
     * Extraer/inferir departamento directamente del texto o desde ciudad
     */
    private function extractDepartamentoFromText(string $text, string $ciudad = ''): ?string
    {
        // Primero buscar departamento explícito en el texto
        $patterns = [
            '/Departamento:\s*([^\n\r\t]+)/i',
            '/Depto:\s*([^\n\r\t]+)/i',
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $text, $matches)) {
                return trim($matches[1]);
            }
        }
        
        // Inferir departamento desde ciudad
        $ciudadDepartamento = [
            'Popayán' => 'Cauca',
            'POPAYAN' => 'Cauca',
            'Bogotá' => 'Cundinamarca',
            'BOGOTA' => 'Cundinamarca',
            'Medellín' => 'Antioquia',
            'MEDELLIN' => 'Antioquia',
            'Cali' => 'Valle del Cauca',
            'CALI' => 'Valle del Cauca',
            'Barranquilla' => 'Atlántico',
            'BARRANQUILLA' => 'Atlántico',
        ];
        
        if ($ciudad && isset($ciudadDepartamento[$ciudad])) {
            return $ciudadDepartamento[$ciudad];
        }
        
        return null;
    }

    /**
     * Extraer institución remitente directamente del texto
     */
    private function extractInstitucionFromText(string $text): ?string
    {
        // Buscar patrones específicos de institución
        $patterns = [
            '/Hospital\s+([^\n\r\t]+)/i',
            '/Clínica\s+([^\n\r\t]+)/i',
            '/Centro\s+([^\n\r\t]+)/i',
            '/IPS\s+([^\n\r\t]+)/i',
            '/Remitente:\s*([^\n\r\t]+)/i',
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $text, $matches)) {
                return trim($matches[1]);
            }
        }
        
        return null;
    }

    /**
     * Construir el prompt para análisis de documento médico
     */
    private function buildAnalysisPrompt(string $text): string
    {
        $prompt = "Eres un sistema experto de análisis de documentos médicos. Analiza el siguiente documento y extrae los datos del paciente.\n\n";
        $prompt .= "DOCUMENTO MÉDICO:\n";
        $prompt .= $text . "\n\n";
        $prompt .= "⚠️ IMPORTANTE - SEPARACIÓN DE NOMBRES Y APELLIDOS:\n";
        $prompt .= "- Separa correctamente el nombre completo en nombre(s) y apellido(s)\n";
        $prompt .= "- En Colombia/América Latina: primeras 1-2 palabras = NOMBRES, últimas 1-2 = APELLIDOS\n";
        $prompt .= "- Ejemplos: 'Juan Pérez' → nombre: 'Juan', apellidos: 'Pérez' | 'María García López' → nombre: 'María', apellidos: 'García López'\n";
        $prompt .= "- NUNCA pongas el nombre completo en un solo campo\n\n";
        $prompt .= "⚠️ EXTRACCIÓN DEL TIPO DE IDENTIFICACIÓN:\n";
        $prompt .= "- Busca el tipo de documento: CC (Cédula), TI (Tarjeta Identidad), RC (Registro Civil), CE (Cédula Extranjería), PA (Pasaporte)\n";
        $prompt .= "- Si no está explícito, infiere según edad: >= 18 años = CC, 7-17 = TI, < 7 = RC\n\n";
        
        $prompt .= "🚨 CAMPOS OBLIGATORIOS QUE DEBES EXTRAER SÍ O SÍ:\n";
        $prompt .= "1. ASEGURADOR: Busca 'Entidad:', 'EPS:', 'NUEVA EMPRESA PROMOTORA', cualquier mención de seguro médico\n";
        $prompt .= "2. CIUDAD: Busca 'Lugar Residencia:', 'POPAYAN', 'Procedencia:', cualquier mención de ciudad\n";
        $prompt .= "3. DEPARTAMENTO: Si encuentras ciudad, infiere departamento (POPAYAN = Cauca)\n\n";
        $prompt .= "🔥 RESPONDE ÚNICAMENTE CON JSON - INCLUYE TODOS LOS CAMPOS:\n";
        $prompt .= "{\n";
        $prompt .= '  "asegurador": "OBLIGATORIO - busca EPS/entidad o usa null",' . "\n";
        $prompt .= '  "departamento": "OBLIGATORIO - busca o infiere o usa null",' . "\n";
        $prompt .= '  "ciudad": "OBLIGATORIO - busca residencia o usa null",' . "\n";
        $prompt .= '  "nombre": "nombre(s) del paciente",' . "\n";
        $prompt .= '  "apellidos": "apellido(s) del paciente",' . "\n";
        $prompt .= '  "tipo_identificacion": "CC/TI/RC/CE/PA",' . "\n";
        $prompt .= '  "numero_identificacion": "número de documento",' . "\n";
        $prompt .= '  "fecha_nacimiento": "YYYY-MM-DD o null",' . "\n";
        $prompt .= '  "edad": número o null,' . "\n";
        $prompt .= '  "sexo": "masculino/femenino/otro",' . "\n";
        $prompt .= '  "diagnostico_principal": "diagnóstico principal",' . "\n";
        $prompt .= '  "motivo_consulta": "motivo de consulta"' . "\n";
        $prompt .= "}\n";
        $prompt .= "⚠️ DEBES INCLUIR TODOS LOS CAMPOS, INCLUSO SI SON null.\n";
        
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
        
            // 🔍 DEBUG: Mostrar respuesta RAW de la IA para depuración
            Log::info("🔍 RESPUESTA RAW DE LA IA:", ['content' => $content]);

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
            // 🔧 MEJORADO: Manejar bloques markdown ```json ... ```
            $jsonString = $response;
            
            // Si viene en bloque markdown, extraer solo el contenido JSON
            if (strpos($response, '```json') !== false) {
                preg_match('/```json\s*(.*?)\s*```/s', $response, $matches);
                if (isset($matches[1])) {
                    $jsonString = trim($matches[1]);
                }
            } else {
                // Fallback: Buscar JSON en la respuesta (método anterior)
                $jsonStart = strpos($response, '{');
                $jsonEnd = strrpos($response, '}');
                
                if ($jsonStart !== false && $jsonEnd !== false) {
                    $jsonString = substr($response, $jsonStart, $jsonEnd - $jsonStart + 1);
                }
            }
            
            $data = json_decode($jsonString, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error("Error al parsear JSON de IA: " . json_last_error_msg() . " | JSON: " . $jsonString);
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
            // ✅ CAMPOS PERSONALES
            'nombre' => $data['nombre'] ?? '',
            'apellidos' => $data['apellidos'] ?? '',
            'tipo_identificacion' => $data['tipo_identificacion'] ?? 'CC',
            'numero_identificacion' => $data['numero_identificacion'] ?? '',
            'fecha_nacimiento' => $data['fecha_nacimiento'] ?? null,
            'edad' => $data['edad'] ?? null,
            'sexo' => $data['sexo'] ?? 'otro',
            
            // ✅ CAMPOS SOCIODEMOGRÁFICOS (que estaban siendo filtrados)
            'asegurador' => $data['asegurador'] ?? '',
            'departamento' => $data['departamento'] ?? '',
            'ciudad' => $data['ciudad'] ?? '',
            'institucion_remitente' => $data['institucion_remitente'] ?? '',
            
            // ✅ CAMPOS MÉDICOS
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
