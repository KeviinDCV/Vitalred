import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configuración de contraseña',
        href: '/settings/password',
    },
];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Configuración de contraseña" />

            <SettingsLayout>
                {/* 
                    DESIGN SYSTEM DOCUMENTATION:
                    
                    COLOR LAYERING:
                    - Layer 1 (Background): Implicit darker background
                    - Layer 2 (Base): from-white to-slate-50/20 - Card foundation
                    - Layer 3 (Elevated): from-white/60 to-transparent - Headers
                    - Layer 4 (Most Elevated): from-white to-slate-50/30 - Inputs
                    
                    RESPONSIVE DESIGN PRINCIPLES:
                    
                    Principle 1 - Box System:
                    Every element has clear relationships and natural balance.
                    Structure feels flexible before it responds.
                    
                    Principle 2 - Rearrange with Purpose:
                    Not about shrinking — it's about shifting, flowing, reprioritizing.
                    Elements maintain clarity and rhythm as space changes.
                    
                    BREAKPOINTS & BEHAVIOR:
                    - Mobile (< 640px): Stack vertical, full-width, compact spacing
                    - Tablet (640px-1024px): Moderate spacing, some horizontal flow
                    - Desktop (≥ 1024px): Optimal spacing, horizontal layout
                */}
                
                {/* BOX SYSTEM: Main container with adaptive spacing */}
                <div className="space-y-6 sm:space-y-8 md:space-y-10">
                    {/* Layer 2: Base Card - Foundation with BOX relationships */}
                    <div className="
                        bg-gradient-to-b from-white to-slate-50/20 
                        rounded-md sm:rounded-lg md:rounded-xl 
                        border-0 
                        shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_20px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)] 
                        relative 
                        before:absolute before:inset-0 before:rounded-md sm:before:rounded-lg md:before:rounded-xl before:pointer-events-none
                        overflow-hidden">
                        
                        {/* Layer 3: Header - BOX with clear relationship to parent */}
                        <div className="
                            border-b border-slate-100/80 
                            pb-3 sm:pb-4 md:pb-5 
                            px-3 sm:px-4 md:px-6 
                            pt-3 sm:pt-4 md:pt-6
                            bg-gradient-to-b from-white/60 to-transparent">
                            <HeadingSmall 
                                title="Actualizar contraseña" 
                                description="Asegúrate de que tu cuenta use una contraseña larga y aleatoria para mantenerte seguro" 
                            />
                        </div>

                        {/* Form Content - RESPONSIVE BOX with adaptive padding */}
                        <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6">
                            <Form
                                method="put"
                                action={route('password.update')}
                                options={{
                                    preserveScroll: true,
                                }}
                                resetOnError={['password', 'password_confirmation', 'current_password']}
                                resetOnSuccess
                                onError={(errors) => {
                                    if (errors.password) {
                                        passwordInput.current?.focus();
                                    }

                                    if (errors.current_password) {
                                        currentPasswordInput.current?.focus();
                                    }
                                }}
                                className="space-y-4 sm:space-y-5 md:space-y-6"
                            >
                                {({ errors, processing, recentlySuccessful }) => (
                                    <>
                                        {/* 
                                            TWO-LAYER SHADOWS SYSTEM:
                                            - Small Shadow (Subtle): Inputs at rest
                                            - Medium Shadow (Standard): Cards, containers
                                            - Large Shadow (Prominent): Hover/focus states, modals
                                            - Light from above: Inset light (top) + Outset dark (bottom)
                                            - Gradient + Inner shadow = Shiny elevated effect
                                        */}
                                        
                                        {/* Layer 4: Inputs BOX - Clear parent-child relationship */}
                                        <div className="grid gap-2 sm:gap-2.5">
                                            <Label htmlFor="current_password" className="text-sm font-medium text-slate-700">
                                                Contraseña actual
                                            </Label>

                                            <Input
                                                id="current_password"
                                                ref={currentPasswordInput}
                                                name="current_password"
                                                type="password"
                                                className="mt-1 block w-full
                                                    bg-gradient-to-b from-white to-slate-50/30
                                                    shadow-[0_1px_2px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]
                                                    hover:shadow-[0_1px_3px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)]
                                                    focus:shadow-[0_2px_4px_rgba(0,0,0,0.08),0_4px_12px_rgba(59,130,246,0.18),0_0_0_1px_rgba(59,130,246,0.3),inset_0_2px_4px_rgba(255,255,255,0.9)]
                                                    transition-all duration-200"
                                                autoComplete="current-password"
                                                placeholder="••••••••"
                                            />

                                            <InputError className="mt-1.5" message={errors.current_password} />
                                        </div>

                                        <div className="grid gap-2.5">
                                            <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                                Nueva contraseña
                                            </Label>

                                            <Input
                                                id="password"
                                                ref={passwordInput}
                                                name="password"
                                                type="password"
                                                className="mt-1 block w-full
                                                    bg-gradient-to-b from-white to-slate-50/30
                                                    shadow-[0_1px_2px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]
                                                    hover:shadow-[0_1px_3px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)]
                                                    focus:shadow-[0_2px_4px_rgba(0,0,0,0.08),0_4px_12px_rgba(59,130,246,0.18),0_0_0_1px_rgba(59,130,246,0.3),inset_0_2px_4px_rgba(255,255,255,0.9)]
                                                    transition-all duration-200"
                                                autoComplete="new-password"
                                                placeholder="••••••••"
                                            />

                                            <InputError className="mt-1.5" message={errors.password} />
                                        </div>

                                        <div className="grid gap-2.5">
                                            <Label htmlFor="password_confirmation" className="text-sm font-medium text-slate-700">
                                                Confirmar contraseña
                                            </Label>

                                            <Input
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                type="password"
                                                className="mt-1 block w-full
                                                    bg-gradient-to-b from-white to-slate-50/30
                                                    shadow-[0_1px_2px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]
                                                    hover:shadow-[0_1px_3px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)]
                                                    focus:shadow-[0_2px_4px_rgba(0,0,0,0.08),0_4px_12px_rgba(59,130,246,0.18),0_0_0_1px_rgba(59,130,246,0.3),inset_0_2px_4px_rgba(255,255,255,0.9)]
                                                    transition-all duration-200"
                                                autoComplete="new-password"
                                                placeholder="••••••••"
                                            />

                                            <InputError className="mt-1.5" message={errors.password_confirmation} />
                                        </div>

                                        {/* 
                                            Actions BOX - REARRANGE WITH PURPOSE:
                                            
                                            Mobile (<640px):
                                            - Stack vertical (flex-col)
                                            - Button full-width (w-full)
                                            - Success message below button
                                            - Compact gaps (gap-3)
                                            
                                            Tablet/Desktop (≥640px):
                                            - Horizontal flow (flex-row)
                                            - Button auto-width (w-auto)
                                            - Success message beside button
                                            - Optimal gaps (gap-4)
                                            
                                            This isn't shrinking — it's reprioritizing for clarity.
                                        */}
                                        <div className="
                                            flex flex-col sm:flex-row 
                                            items-stretch sm:items-center 
                                            gap-3 sm:gap-4 md:gap-5 
                                            pt-1 sm:pt-2 md:pt-3
                                            border-t border-slate-100/50 sm:border-0
                                            mt-2 sm:mt-0">
                                            
                                            {/* Primary Action: Button - Most prominent element */}
                                            <Button 
                                                disabled={processing}
                                                className="
                                                    w-full sm:w-auto
                                                    min-w-[140px] sm:min-w-[160px]
                                                    px-4 sm:px-5 md:px-6
                                                    py-2 sm:py-2.5
                                                    text-sm sm:text-base
                                                    shadow-[0_1px_2px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.12),0_6px_20px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.25)]
                                                    hover:shadow-[0_2px_4px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.14),0_8px_24px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.3)]
                                                    active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.2),inset_0_-1px_0_rgba(255,255,255,0.1)]
                                                    active:translate-y-px
                                                    disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-[0_1px_2px_rgba(0,0,0,0.06)]
                                                    transition-all duration-200"
                                            >
                                                {processing ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Guardando...
                                                    </span>
                                                ) : (
                                                    'Guardar contraseña'
                                                )}
                                            </Button>

                                            {/* Success Feedback: Rearranged based on space */}
                                            <Transition
                                                show={recentlySuccessful}
                                                enter="transition ease-out duration-200"
                                                enterFrom="opacity-0 scale-95 translate-y-1 sm:translate-y-0 sm:translate-x-2"
                                                leave="transition ease-in duration-150"
                                                leaveTo="opacity-0 scale-95 translate-y-1 sm:translate-y-0 sm:translate-x-2"
                                            >
                                                <div className="
                                                    bg-gradient-to-b from-green-50 to-green-100/50 
                                                    px-3 sm:px-4 py-2 sm:py-1.5
                                                    rounded-md sm:rounded-lg
                                                    shadow-[0_1px_3px_rgba(0,0,0,0.06),0_2px_6px_rgba(34,197,94,0.1),inset_0_1px_0_rgba(255,255,255,0.6)]
                                                    w-full sm:w-auto
                                                    flex items-center justify-center sm:justify-start">
                                                    <p className="text-sm sm:text-base font-medium text-green-700 flex items-center gap-1.5 sm:gap-2">
                                                        <svg className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="whitespace-nowrap">Contraseña actualizada</span>
                                                    </p>
                                                </div>
                                            </Transition>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
