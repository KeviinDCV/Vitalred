import { useEffect, useState } from 'react';
import { ErrorModal } from './error-modal';

interface ErrorState {
  open: boolean;
  type: 'rate-limit' | 'error' | 'warning' | 'forbidden';
  title?: string;
  description?: string;
}

export function GlobalErrorHandler() {
  const [errorState, setErrorState] = useState<ErrorState>({
    open: false,
    type: 'error',
  });

  useEffect(() => {
    // Escuchar evento personalizado para mostrar el modal de error
    const handleShowErrorModal = (event: CustomEvent) => {
      const { type, title, description } = event.detail;

      setErrorState({
        open: true,
        type: type || 'error',
        title,
        description,
      });
    };

    window.addEventListener('show-error-modal', handleShowErrorModal as EventListener);

    return () => {
      window.removeEventListener('show-error-modal', handleShowErrorModal as EventListener);
    };
  }, []);

  const handleClose = () => {
    setErrorState((prev) => ({ ...prev, open: false }));
  };

  return (
    <ErrorModal
      open={errorState.open}
      onClose={handleClose}
      type={errorState.type}
      title={errorState.title}
      description={errorState.description}
    />
  );
}
