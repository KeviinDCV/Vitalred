import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configuración de perfil',
        href: '/settings/profile',
    },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Configuración de perfil" />

            <SettingsLayout>
                {/* Card con Color Layering + Dual Shadows */}
                <div className="space-y-8">
                    {/* Información del Perfil - Elevated Card */}
                    <div className="bg-gradient-to-b from-white to-slate-50/20 rounded-lg sm:rounded-xl 
                        border-0 
                        shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_20px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)] 
                        relative 
                        before:absolute before:inset-0 before:rounded-lg sm:before:rounded-xl before:pointer-events-none">
                        
                        {/* Header con jerarquía visual */}
                        <div className="border-b border-slate-100/80 pb-4 sm:pb-5 p-4 sm:p-6 
                            bg-gradient-to-b from-white/60 to-transparent">
                            <HeadingSmall 
                                title="Información del perfil" 
                                description="Actualiza tu nombre y dirección de correo electrónico" 
                            />
                        </div>

                        {/* Form Content con spacing mejorado */}
                        <div className="p-4 sm:p-6">
                            <Form
                                method="patch"
                                action={route('profile.update')}
                                options={{
                                    preserveScroll: true,
                                }}
                                className="space-y-5 sm:space-y-6"
                            >
                                {({ processing, recentlySuccessful, errors }) => (
                                    <>
                                        {/* Campo Nombre - Elevated Input */}
                                        <div className="grid gap-2.5">
                                            <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                                                Nombre
                                            </Label>

                                            <Input
                                                id="name"
                                                className="mt-1 block w-full
                                                    shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.8)]
                                                    focus:shadow-[0_2px_8px_rgba(59,130,246,0.15),0_1px_3px_rgba(0,0,0,0.1)]
                                                    transition-shadow duration-200"
                                                defaultValue={auth.user.name}
                                                name="name"
                                                required
                                                autoComplete="name"
                                                placeholder="Nombre completo"
                                            />

                                            <InputError className="mt-1.5" message={errors.name} />
                                        </div>

                                        {/* Campo Email - Elevated Input */}
                                        <div className="grid gap-2.5">
                                            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                                Dirección de correo electrónico
                                            </Label>

                                            <Input
                                                id="email"
                                                type="email"
                                                className="mt-1 block w-full
                                                    shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.8)]
                                                    focus:shadow-[0_2px_8px_rgba(59,130,246,0.15),0_1px_3px_rgba(0,0,0,0.1)]
                                                    transition-shadow duration-200"
                                                defaultValue={auth.user.email}
                                                name="email"
                                                required
                                                autoComplete="username"
                                                placeholder="correo@ejemplo.com"
                                            />

                                            <InputError className="mt-1.5" message={errors.email} />
                                        </div>

                                        {/* Email Verification Notice - Subtle Card */}
                                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                                            <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-4
                                                shadow-[0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.5)]">
                                                <p className="text-sm text-amber-800/90">
                                                    Tu dirección de correo electrónico no está verificada.{' '}
                                                    <Link
                                                        href={route('verification.send')}
                                                        method="post"
                                                        as="button"
                                                        className="font-medium text-amber-900 underline decoration-amber-300 underline-offset-4 
                                                            transition-colors duration-200 hover:decoration-amber-900"
                                                    >
                                                        Haz clic aquí para reenviar el correo de verificación.
                                                    </Link>
                                                </p>

                                                {status === 'verification-link-sent' && (
                                                    <div className="mt-3 text-sm font-medium text-green-700 
                                                        bg-green-50 border border-green-100 rounded-md p-2.5
                                                        shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                                                        ✓ Se ha enviado un nuevo enlace de verificación a tu dirección de correo electrónico.
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Actions con Button Elevated */}
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pt-2">
                                            <Button 
                                                disabled={processing}
                                                className="w-full sm:w-auto
                                                    shadow-[0_1px_3px_rgba(0,0,0,0.1),0_4px_12px_rgba(59,130,246,0.15),inset_0_1px_0_rgba(255,255,255,0.2)]
                                                    hover:shadow-[0_2px_6px_rgba(0,0,0,0.12),0_6px_20px_rgba(59,130,246,0.2)]
                                                    active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]
                                                    transition-all duration-200"
                                            >
                                                {processing ? 'Guardando...' : 'Guardar cambios'}
                                            </Button>

                                            <Transition
                                                show={recentlySuccessful}
                                                enter="transition ease-out duration-200"
                                                enterFrom="opacity-0 scale-95"
                                                leave="transition ease-in duration-150"
                                                leaveTo="opacity-0 scale-95"
                                            >
                                                <p className="text-sm font-medium text-green-600 
                                                    bg-green-50 px-3 py-1.5 rounded-md
                                                    shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.5)]">
                                                    ✓ Guardado exitosamente
                                                </p>
                                            </Transition>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>

                    <DeleteUser />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
