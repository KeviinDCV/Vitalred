<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🤖 Test Análisis Directo de IA</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 30px;
        }
        .upload-area {
            border: 2px dashed #3498db;
            border-radius: 10px;
            padding: 40px;
            text-align: center;
            margin-bottom: 20px;
            background-color: #f8f9fa;
        }
        .file-input {
            margin: 20px 0;
        }
        .btn {
            background-color: #3498db;
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        .btn:hover {
            background-color: #2980b9;
        }
        .resultado {
            margin-top: 30px;
            padding: 20px;
            border-radius: 5px;
            display: none;
        }
        .success {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
        }
        .error {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
        }
        .texto-extraido {
            background-color: #e9ecef;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
            font-family: monospace;
            font-size: 12px;
            max-height: 200px;
            overflow-y: auto;
        }
        .analisis-ia {
            background-color: #fff3cd;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
            border: 1px solid #ffeaa7;
        }
        .loading {
            text-align: center;
            color: #6c757d;
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🤖 Test de Análisis Directo de IA</h1>
        <p style="text-align: center; color: #6c757d; margin-bottom: 30px;">
            Sube tu historia clínica para ver exactamente lo que la IA está analizando
        </p>
        
        <form id="uploadForm" enctype="multipart/form-data">
            <div class="upload-area">
                <h3>📄 Selecciona tu archivo</h3>
                <p>PDF, JPG, PNG, DOC, DOCX, TXT (máx. 10MB)</p>
                <input type="file" name="historia_clinica" id="fileInput" class="file-input" 
                       accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt" required>
            </div>
            
            <div style="text-align: center;">
                <button type="submit" class="btn">🚀 Analizar con IA</button>
            </div>
        </form>

        <div class="loading" id="loading">
            <p>⏳ Analizando documento con IA... Esto puede tomar unos segundos.</p>
        </div>

        <div class="resultado" id="resultado">
            <!-- Los resultados aparecerán aquí -->
        </div>
    </div>

    <script>
        document.getElementById('uploadForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const fileInput = document.getElementById('fileInput');
            const loading = document.getElementById('loading');
            const resultado = document.getElementById('resultado');
            
            if (!fileInput.files[0]) {
                alert('Por favor selecciona un archivo');
                return;
            }

            // Mostrar loading
            loading.style.display = 'block';
            resultado.style.display = 'none';

            // Preparar datos
            const formData = new FormData();
            formData.append('historia_clinica', fileInput.files[0]);

            // Token CSRF
            const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            try {
                const response = await fetch('/medico/priorizacion/analizar-directo', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRF-TOKEN': token
                    }
                });

                const data = await response.json();
                
                // Ocultar loading
                loading.style.display = 'none';
                resultado.style.display = 'block';

                if (data.success) {
                    resultado.className = 'resultado success';
                    resultado.innerHTML = `
                        <h3>✅ Análisis Completado</h3>
                        <p><strong>📄 Archivo:</strong> ${data.nombre_archivo}</p>
                        <p><strong>📏 Texto Extraído:</strong> ${data.longitud_texto_extraido} caracteres</p>
                        
                        <h4>🔍 Preview del Texto Extraído:</h4>
                        <div class="texto-extraido">${data.texto_extraido_preview || 'No se pudo extraer texto'}</div>
                        
                        <h4>🤖 Análisis Completo de la IA:</h4>
                        <div class="analisis-ia">${data.analisis_completo_ia || 'La IA no pudo generar análisis'}</div>
                    `;
                } else {
                    resultado.className = 'resultado error';
                    resultado.innerHTML = `
                        <h3>❌ Error</h3>
                        <p><strong>Error:</strong> ${data.error || data.message}</p>
                    `;
                }
            } catch (error) {
                loading.style.display = 'none';
                resultado.style.display = 'block';
                resultado.className = 'resultado error';
                resultado.innerHTML = `
                    <h3>❌ Error de Conexión</h3>
                    <p><strong>Error:</strong> ${error.message}</p>
                `;
            }
        });
    </script>
</body>
</html>
