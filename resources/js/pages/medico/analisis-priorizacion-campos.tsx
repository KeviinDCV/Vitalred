import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, FileText, Brain, Stethoscope, Save } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Consulta Pacientes',
        href: '/medico/consulta-pacientes',
    },
    {
        title: 'Análisis de Priorización IA',
        href: '#',
    },
];

export default function AnalisisPriorizacionCampos() {
    const [analisisPrecisa, setAnalisisPrecisa] = useState('');
    const [analisisVitalRed, setAnalisisVitalRed] = useState('');
    const [analisisMedico, setAnalisisMedico] = useState('');

    const handleGuardar = () => {
        // Aquí puedes agregar la lógica para guardar los análisis
        console.log('Guardando análisis:', {
            analisisPrecisa,
            analisisVitalRed,
            analisisMedico
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Análisis de Priorización IA - Vital Red" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.visit('/medico/consulta-pacientes')}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Análisis de Priorización de IA</h1>
                            <p className="text-muted-foreground">
                                Ingrese los diferentes análisis para comparación
                            </p>
                        </div>
                    </div>
                    <Button onClick={handleGuardar} className="gap-2">
                        <Save className="h-4 w-4" />
                        Guardar Análisis
                    </Button>
                </div>

                {/* Campo 1: Análisis Precisa */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-primary" />
                            Análisis Precisa
                        </CardTitle>
                        <CardDescription>
                            Ingrese el análisis generado por el sistema Precisa
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="analisis-precisa">Análisis Precisa</Label>
                            <Textarea
                                id="analisis-precisa"
                                placeholder="Escriba aquí el análisis de Precisa..."
                                value={analisisPrecisa}
                                onChange={(e) => setAnalisisPrecisa(e.target.value)}
                                className="min-h-[200px] resize-y"
                            />
                            <p className="text-xs text-muted-foreground">
                                {analisisPrecisa.length} caracteres
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Campo 2: Análisis Vital Red */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-success" />
                            Análisis Vital Red (esta web)
                        </CardTitle>
                        <CardDescription>
                            Ingrese el análisis generado por el sistema Vital Red
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="analisis-vital-red">Análisis Vital Red</Label>
                            <Textarea
                                id="analisis-vital-red"
                                placeholder="Escriba aquí el análisis de Vital Red..."
                                value={analisisVitalRed}
                                onChange={(e) => setAnalisisVitalRed(e.target.value)}
                                className="min-h-[200px] resize-y"
                            />
                            <p className="text-xs text-muted-foreground">
                                {analisisVitalRed.length} caracteres
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Campo 3: Análisis Médico */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Stethoscope className="h-5 w-5 text-destructive" />
                            Análisis Médico
                        </CardTitle>
                        <CardDescription>
                            Ingrese el análisis médico profesional
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="analisis-medico">Análisis Médico</Label>
                            <Textarea
                                id="analisis-medico"
                                placeholder="Escriba aquí el análisis médico..."
                                value={analisisMedico}
                                onChange={(e) => setAnalisisMedico(e.target.value)}
                                className="min-h-[200px] resize-y"
                            />
                            <p className="text-xs text-muted-foreground">
                                {analisisMedico.length} caracteres
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Información adicional */}
                <Card className="border-dashed border-2 border-primary/20 bg-primary/5">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <Brain className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                                <h4 className="font-medium text-primary mb-2">Instrucciones de uso</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• <strong>Análisis Precisa:</strong> Copie y pegue el análisis generado por el sistema Precisa</li>
                                    <li>• <strong>Análisis Vital Red:</strong> Copie y pegue el análisis generado por esta plataforma</li>
                                    <li>• <strong>Análisis Médico:</strong> Ingrese su análisis profesional como médico</li>
                                    <li>• Los campos son de texto libre y pueden contener cualquier información relevante</li>
                                    <li>• Use el botón "Guardar Análisis" para almacenar la información</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}