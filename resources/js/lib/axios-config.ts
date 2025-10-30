import axios from 'axios';

// Configurar axios para manejar errores HTTP personalizados
export function setupAxiosInterceptors() {
  // Interceptor de respuesta para manejar errores HTTP
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Si es un error 429 (Too Many Requests)
      if (error.response?.status === 429) {
        // Emitir un evento personalizado para mostrar el modal
        window.dispatchEvent(
          new CustomEvent('show-error-modal', {
            detail: {
              type: 'rate-limit',
              title: 'Demasiados intentos de inicio de sesión',
              description: 'Por tu seguridad, hemos bloqueado temporalmente los intentos de inicio de sesión. Has excedido el límite de intentos permitidos.',
            },
          })
        );

        // Suprimir el error en consola creando un error silencioso
        const silentError = new Error('Request rate limited');
        silentError.name = 'RateLimitError';
        (silentError as any).response = error.response;
        (silentError as any).__silent__ = true; // Marcar como silencioso

        return Promise.reject(silentError);
      }

      // Si es un error 403 (Forbidden)
      if (error.response?.status === 403) {
        window.dispatchEvent(
          new CustomEvent('show-error-modal', {
            detail: {
              type: 'forbidden',
              title: 'Acceso denegado',
              description: 'No tienes los permisos necesarios para realizar esta acción. Si crees que esto es un error, contacta al administrador.',
            },
          })
        );

        const silentError = new Error('Access forbidden');
        silentError.name = 'ForbiddenError';
        (silentError as any).response = error.response;
        (silentError as any).__silent__ = true;

        return Promise.reject(silentError);
      }

      // Si es un error 500 (Server Error)
      if (error.response?.status === 500) {
        window.dispatchEvent(
          new CustomEvent('show-error-modal', {
            detail: {
              type: 'error',
              title: 'Error del servidor',
              description: 'Ha ocurrido un error inesperado en el servidor. Por favor, intenta nuevamente más tarde.',
            },
          })
        );

        const silentError = new Error('Server error');
        silentError.name = 'ServerError';
        (silentError as any).response = error.response;
        (silentError as any).__silent__ = true;

        return Promise.reject(silentError);
      }

      // Para otros errores, dejarlos pasar normalmente
      return Promise.reject(error);
    }
  );

}
