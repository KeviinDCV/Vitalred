<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Smalot\PdfParser\Parser;

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
        $response = Http::timeout(30)->post($this->baseUrl . '?key=' . $apiKey, [
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
                'maxOutputTokens' => 1024,
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
}
