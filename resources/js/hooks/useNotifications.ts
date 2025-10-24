import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { router } from '@inertiajs/react';

interface Notificacion {
    id: number;
    tipo: 'aceptado' | 'rechazado';
    titulo: string;
    mensaje: string;
    created_at: string;
    registro_medico: {
        id: number;
        nombre: string;
        apellidos: string;
    };
    medico: {
        nombre: string;
        apellidos: string;
    };
}

interface UseNotificationsOptions {
    enabled?: boolean;
    interval?: number;
    rolePrefix?: string; // 'ips' o 'admin/ips'
}

export const useNotifications = (options: UseNotificationsOptions = {}) => {
    const {
        enabled = true,
        interval = 10000, // 10 segundos
        rolePrefix = 'ips'
    } = options;

    const [notificationsCount, setNotificationsCount] = useState(0);
    const processedNotificationsRef = useRef<Set<number>>(new Set());
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const checkNotifications = async () => {
        try {
            const response = await axios.get(`/${rolePrefix}/notificaciones/no-leidas`);
            
            if (response.data.success) {
                const notificaciones: Notificacion[] = response.data.notificaciones;
                setNotificationsCount(notificaciones.length);

                // Mostrar toast solo para notificaciones nuevas
                notificaciones.forEach((notif) => {
                    if (!processedNotificationsRef.current.has(notif.id)) {
                        // Marcar como procesada
                        processedNotificationsRef.current.add(notif.id);

                        // Mostrar toast según el tipo
                        if (notif.tipo === 'aceptado') {
                            toast.success(notif.titulo, {
                                description: notif.mensaje,
                                duration: 8000,
                                action: {
                                    label: 'Ver Pacientes',
                                    onClick: () => router.visit(`/${rolePrefix}/consulta-pacientes`)
                                },
                            });
                        } else if (notif.tipo === 'rechazado') {
                            toast.error(notif.titulo, {
                                description: notif.mensaje,
                                duration: 8000,
                                action: {
                                    label: 'Ver Pacientes',
                                    onClick: () => router.visit(`/${rolePrefix}/consulta-pacientes`)
                                },
                            });
                        }

                        // Marcar como leída automáticamente después de mostrar
                        markAsRead(notif.id);
                    }
                });
            }
        } catch (error) {
            console.error('Error checking notifications:', error);
        }
    };

    const markAsRead = async (notificationId: number) => {
        try {
            await axios.post(`/${rolePrefix}/notificaciones/${notificationId}/marcar-leida`);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post(`/${rolePrefix}/notificaciones/marcar-todas-leidas`);
            setNotificationsCount(0);
            processedNotificationsRef.current.clear();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    useEffect(() => {
        if (!enabled) return;

        // Verificar inmediatamente
        checkNotifications();

        // Configurar polling
        intervalRef.current = setInterval(checkNotifications, interval);

        // Cleanup
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [enabled, interval, rolePrefix]);

    return {
        notificationsCount,
        checkNotifications,
        markAllAsRead,
    };
};
