<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Mantenimiento - HERMES</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
        }
        
        /* Two-Layer Shadows & Gradients */
        .card-shadow {
            box-shadow: 
                0 2px 4px rgba(0,0,0,0.06),
                0 8px 20px rgba(0,0,0,0.1),
                inset 0 1px 0 rgba(255,255,255,1);
        }
        
        /* Spinner animation */
        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
        
        .animate-spin {
            animation: spin 1s linear infinite;
        }
    </style>
</head>
<body class="bg-slate-50/30 min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-2xl">
        <!-- Main Card -->
        <div class="bg-gradient-to-b from-white to-slate-50/20 rounded-lg sm:rounded-xl md:rounded-2xl border border-slate-200/60 card-shadow overflow-hidden">
            
            <!-- Header with Icon -->
            <div class="bg-gradient-to-b from-white/60 to-transparent border-b border-slate-100 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
                <div class="flex flex-col items-center text-center">
                    <!-- Logo HERMES -->
                    <div class="mb-4 sm:mb-6">
                        <img src="/images/logo.png" alt="HERMES" class="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto">
                    </div>
                    
                    <!-- Title -->
                    <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2 sm:mb-3">
                        ESTAMOS EN MANTENIMIENTO
                    </h1>
                    
                    <!-- Subtitle -->
                    <p class="text-sm sm:text-base md:text-lg text-slate-600">
                        Estamos realizando mejoras en el sistema
                    </p>
                </div>
            </div>
            
            <!-- Content -->
            <div class="px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 space-y-4 sm:space-y-5 md:space-y-6">
                
                <!-- Message -->
                <div class="bg-blue-50/50 border border-blue-100 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6">
                    <div class="flex gap-3 sm:gap-4">
                        <!-- Info Icon -->
                        <div class="flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 16v-4"/>
                                <path d="M12 8h.01"/>
                            </svg>
                        </div>
                        
                        <div class="flex-1">
                            <h3 class="text-sm sm:text-base font-semibold text-blue-900 mb-1 sm:mb-2">
                                ¿Qué está pasando?
                            </h3>
                            <p class="text-xs sm:text-sm text-blue-800 leading-relaxed">
                                Nuestro equipo está trabajando en actualizaciones importantes para mejorar tu experiencia. 
                                El sistema estará disponible nuevamente en breve.
                            </p>
                        </div>
                    </div>
                </div>
                
                <!-- Loading Indicator -->
                <div class="pt-2 sm:pt-4">
                    <div class="flex items-center justify-center gap-2 sm:gap-3">
                        <!-- Spinner -->
                        <svg class="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span class="text-xs sm:text-sm text-slate-600 font-medium">Trabajando en las actualizaciones...</span>
                    </div>
                </div>
                
            </div>
            
            <!-- Footer -->
            <div class="bg-slate-50/50 border-t border-slate-100 px-4 sm:px-6 md:px-8 py-4 sm:py-5">
                <div class="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                    <div class="flex items-center gap-2 sm:gap-3">
                        <!-- Logo HERMES -->
                        <img src="/images/logo.png" alt="HERMES" class="w-6 h-6 sm:w-7 sm:h-7">
                        <span class="text-xs sm:text-sm font-semibold text-slate-700">HERMES</span>
                    </div>
                    
                    <p class="text-xs text-slate-500 text-center sm:text-right">
                        Gracias por tu paciencia
                    </p>
                </div>
            </div>
            
        </div>
        
        <!-- Additional Info -->
        <div class="mt-4 sm:mt-6 text-center">
            <p class="text-xs sm:text-sm text-slate-500">
                Si necesitas asistencia urgente, contacta a 
                <a href="mailto:innovacionydesarrollo@correohuv.gov.co" class="text-blue-600 hover:text-blue-700 font-medium underline">innovacionydesarrollo@correohuv.gov.co</a>
            </p>
        </div>
    </div>
</body>
</html>
