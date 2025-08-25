<?php

namespace App\Http\Controllers;

use App\Services\GeminiAIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AIController extends Controller
{
    protected GeminiAIService $geminiService;

    public function __construct(GeminiAIService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    /**
     * Extraer datos del paciente desde un archivo usando IA
     */
    public function extractPatientData(Request $request)
    {
        try {
            // Validar que se haya subido un archivo
            $request->validate([
                'file' => 'required|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240' // 10MB max
            ]);

            $file = $request->file('file');
            
            // Guardar archivo temporalmente
            $tempPath = $file->store('temp/ai_analysis', 'public');
            
            Log::info("Iniciando análisis de IA para archivo: " . $tempPath);

            // Extraer texto del archivo
            $extractedText = $this->geminiService->extractTextFromFile($tempPath);
            
            if (empty(trim($extractedText))) {
                throw new \Exception("No se pudo extraer texto del archivo o el archivo está vacío");
            }

            Log::info("Texto extraído exitosamente, longitud: " . strlen($extractedText));

            // Analizar texto con IA
            $patientData = $this->geminiService->analyzePatientDocument($extractedText);

            // Limpiar archivo temporal
            Storage::disk('public')->delete($tempPath);

            Log::info("Análisis de IA completado exitosamente", $patientData);
            Log::info("Fecha de nacimiento en respuesta: " . ($patientData['fecha_nacimiento'] ?? 'NULL'));

            return response()->json([
                'success' => true,
                'data' => $patientData,
                'extracted_text_preview' => substr($extractedText, 0, 500) . '...',
                'message' => 'Datos extraídos exitosamente del documento'
            ]);

        } catch (\Exception $e) {
            // Limpiar archivo temporal en caso de error
            if (isset($tempPath)) {
                Storage::disk('public')->delete($tempPath);
            }

            Log::error("Error en extracción de datos con IA: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'error' => 'No se pudieron extraer los datos del documento'
            ], 422);
        }
    }

    /**
     * Probar la extracción de texto de un archivo (para debugging)
     */
    public function testTextExtraction(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240'
            ]);

            $file = $request->file('file');
            $tempPath = $file->store('temp/test_extraction', 'public');

            $extractedText = $this->geminiService->extractTextFromFile($tempPath);

            // Limpiar archivo temporal
            Storage::disk('public')->delete($tempPath);

            return response()->json([
                'success' => true,
                'extracted_text' => $extractedText,
                'text_length' => strlen($extractedText),
                'file_info' => [
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize()
                ]
            ]);

        } catch (\Exception $e) {
            if (isset($tempPath)) {
                Storage::disk('public')->delete($tempPath);
            }

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Probar la API de Gemini directamente (para debugging)
     */
    public function testGeminiAPI(Request $request)
    {
        try {
            $request->validate([
                'text' => 'required|string|max:5000'
            ]);

            $text = $request->input('text');
            $patientData = $this->geminiService->analyzePatientDocument($text);

            return response()->json([
                'success' => true,
                'data' => $patientData,
                'input_text' => $text
            ]);

        } catch (\Exception $e) {
            Log::error("Error probando API de Gemini: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }
}
