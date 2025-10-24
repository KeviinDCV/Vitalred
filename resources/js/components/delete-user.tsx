import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@inertiajs/react';
import { useRef } from 'react';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-6">
            {/* Danger Zone Card - Elevated con Dual Shadows */}
            <div className="bg-gradient-to-b from-white to-red-50/20 rounded-lg sm:rounded-xl 
                border-0 
                shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_20px_rgba(220,38,38,0.1),inset_0_1px_0_rgba(255,255,255,1)] 
                relative 
                before:absolute before:inset-0 before:rounded-lg sm:before:rounded-xl before:pointer-events-none">
                
                {/* Header con jerarquía visual */}
                <div className="border-b border-red-100/80 pb-4 sm:pb-5 p-4 sm:p-6 
                    bg-gradient-to-b from-white/60 to-transparent">
                    <HeadingSmall 
                        title="Zona de peligro" 
                        description="Elimina tu cuenta y todos sus recursos permanentemente" 
                    />
                </div>

                {/* Warning Content */}
                <div className="p-4 sm:p-6 space-y-4">
                    {/* Warning Notice - Inset Shadow (sunken effect) */}
                    <div className="bg-red-50/70 border border-red-200/60 rounded-lg p-4
                        shadow-[inset_0_2px_4px_rgba(220,38,38,0.08),0_1px_2px_rgba(0,0,0,0.05)]">
                        <div className="flex gap-3">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="font-semibold text-sm text-red-800">Advertencia: Acción irreversible</p>
                                <p className="text-sm text-red-700/90">
                                    Esta acción no se puede deshacer. Todos tus datos serán eliminados permanentemente de nuestros servidores.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Delete Button - Prominent Shadow */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button 
                                variant="destructive"
                                className="w-full sm:w-auto
                                    shadow-[0_1px_3px_rgba(0,0,0,0.1),0_4px_12px_rgba(220,38,38,0.15),inset_0_1px_0_rgba(255,255,255,0.2)]
                                    hover:shadow-[0_2px_6px_rgba(0,0,0,0.12),0_6px_20px_rgba(220,38,38,0.2)]
                                    active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]
                                    transition-all duration-200"
                            >
                                Eliminar cuenta
                            </Button>
                        </DialogTrigger>
                        
                        {/* Modal con Elevated Effect */}
                        <DialogContent className="sm:max-w-lg
                            shadow-[0_10px_40px_rgba(0,0,0,0.15),0_4px_12px_rgba(0,0,0,0.1)]">
                            <DialogTitle className="text-lg sm:text-xl font-semibold text-slate-900">
                                ¿Estás seguro de que quieres eliminar tu cuenta?
                            </DialogTitle>
                            <DialogDescription className="text-sm text-slate-600 leading-relaxed">
                                Una vez que tu cuenta sea eliminada, todos sus recursos y datos también serán eliminados permanentemente. 
                                Por favor ingresa tu contraseña para confirmar esta acción.
                            </DialogDescription>

                            <Form
                                method="delete"
                                action={route('profile.destroy')}
                                options={{
                                    preserveScroll: true,
                                }}
                                onError={() => passwordInput.current?.focus()}
                                resetOnSuccess
                                className="space-y-5 mt-2"
                            >
                                {({ resetAndClearErrors, processing, errors }) => (
                                    <>
                                        <div className="grid gap-2.5">
                                            <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                                Confirmar contraseña
                                            </Label>

                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                ref={passwordInput}
                                                placeholder="Ingresa tu contraseña"
                                                autoComplete="current-password"
                                                className="shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.8)]
                                                    focus:shadow-[0_2px_8px_rgba(220,38,38,0.15),0_1px_3px_rgba(0,0,0,0.1)]
                                                    transition-shadow duration-200"
                                            />

                                            <InputError message={errors.password} />
                                        </div>

                                        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3">
                                            <DialogClose asChild>
                                                <Button 
                                                    variant="secondary" 
                                                    onClick={() => resetAndClearErrors()}
                                                    className="w-full sm:w-auto order-2 sm:order-1
                                                        shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.8)]
                                                        hover:shadow-[0_2px_4px_rgba(0,0,0,0.08)]
                                                        transition-shadow duration-200"
                                                >
                                                    Cancelar
                                                </Button>
                                            </DialogClose>

                                            <Button 
                                                variant="destructive" 
                                                disabled={processing} 
                                                asChild
                                                className="w-full sm:w-auto order-1 sm:order-2
                                                    shadow-[0_1px_3px_rgba(0,0,0,0.1),0_4px_12px_rgba(220,38,38,0.15)]
                                                    hover:shadow-[0_2px_6px_rgba(0,0,0,0.12),0_6px_20px_rgba(220,38,38,0.2)]
                                                    active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]
                                                    transition-all duration-200"
                                            >
                                                <button type="submit">
                                                    {processing ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
                                                </button>
                                            </Button>
                                        </DialogFooter>
                                    </>
                                )}
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
