import React from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error?: Error }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error Boundary caught an error:', error, errorInfo);
        console.error('Error stack:', error.stack);
        console.error('Component stack:', errorInfo.componentStack);
    }

    render() {
        if (this.state.hasError) {
            const FallbackComponent = this.props.fallback;
            
            if (FallbackComponent) {
                return <FallbackComponent error={this.state.error} />;
            }

            return (
                <div className="p-4 border border-red-200 rounded-md bg-red-50">
                    <h2 className="text-lg font-semibold text-red-800 mb-2">
                        Algo salió mal
                    </h2>
                    <p className="text-red-600 text-sm mb-2">
                        Ha ocurrido un error inesperado. Por favor, recarga la página.
                    </p>
                    {this.state.error && (
                        <details className="text-xs text-red-700 mb-3">
                            <summary className="cursor-pointer">Ver detalles del error</summary>
                            <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto">
                                {this.state.error.message}
                            </pre>
                        </details>
                    )}
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Recargar página
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;