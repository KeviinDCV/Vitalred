import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ShieldAlert, Clock, AlertTriangle, XCircle } from 'lucide-react';

interface ErrorModalProps {
  open: boolean;
  onClose: () => void;
  type?: 'rate-limit' | 'error' | 'warning' | 'forbidden';
  title?: string;
  description?: string;
}

export function ErrorModal({
  open,
  onClose,
  type = 'error',
  title,
  description
}: ErrorModalProps) {
  const errorConfigs = {
    'rate-limit': {
      icon: Clock,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
      defaultTitle: 'Demasiados intentos',
      defaultDescription: 'Por tu seguridad, hemos bloqueado temporalmente los intentos de inicio de sesión. Por favor, espera unos minutos antes de volver a intentar.',
    },
    'error': {
      icon: XCircle,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-50',
      defaultTitle: 'Error',
      defaultDescription: 'Ha ocurrido un error. Por favor, intenta nuevamente.',
    },
    'warning': {
      icon: AlertTriangle,
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-50',
      defaultTitle: 'Advertencia',
      defaultDescription: 'Se ha detectado un problema.',
    },
    'forbidden': {
      icon: ShieldAlert,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-50',
      defaultTitle: 'Acceso denegado',
      defaultDescription: 'No tienes permisos para realizar esta acción.',
    },
  };

  const config = errorConfigs[type];
  const Icon = config.icon;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex flex-col items-center gap-4 mb-2">
            <div className={`${config.iconBg} p-3 rounded-full`}>
              <Icon className={`h-8 w-8 ${config.iconColor}`} />
            </div>
            <AlertDialogTitle className="text-center text-xl">
              {title || config.defaultTitle}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-center text-base leading-relaxed">
            {description || config.defaultDescription}
          </AlertDialogDescription>

          {type === 'rate-limit' && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-blue-800 font-medium">
                    ¿Por qué veo este mensaje?
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Detectamos múltiples intentos de inicio de sesión en un corto período de tiempo.
                    Este límite ayuda a proteger tu cuenta contra accesos no autorizados.
                  </p>
                  <p className="text-xs text-blue-700 mt-2 font-medium">
                    Tiempo de espera: aproximadamente 1-2 minutos
                  </p>
                </div>
              </div>
            </div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction
            onClick={onClose}
            className="w-full sm:w-auto px-8"
          >
            Entendido
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
