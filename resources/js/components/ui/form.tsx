import { Form as InertiaForm, FormProps } from '@inertiajs/react';
import React from 'react';

// Wrapper personalizado para el Form de Inertia que maneja el atributo inert correctamente
export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ children, ...props }, ref) => {
    return (
      <InertiaForm {...props} ref={ref}>
        {({ processing, errors, ...formProps }) => {
          // Renderizamos el children con los props del form
          if (typeof children === 'function') {
            return children({ processing, errors, ...formProps });
          }
          return children;
        }}
      </InertiaForm>
    );
  }
);

Form.displayName = 'Form';
