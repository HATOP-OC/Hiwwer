import React from 'react';
import { useTranslation } from 'react-i18next';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const { t } = useTranslation();
  const [state, setState] = React.useState<ErrorBoundaryState>({ hasError: false });

  const componentDidCatch = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  };

  const getDerivedStateFromError = (error: Error): ErrorBoundaryState => {
    return { hasError: true, error };
  };

  try {
    if (state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-card border rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              {t('errorBoundary.title')}
            </h1>
            <p className="text-muted-foreground mb-4">
              {t('errorBoundary.subtitle')}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {state.error?.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
            >
              {t('errorBoundary.reloadButton')}
            </button>
          </div>
        </div>
      );
    }
    return <>{children}</>;
  } catch (error) {
    const derivedState = getDerivedStateFromError(error as Error);
    setState(derivedState);
    componentDidCatch(error as Error, { componentStack: '' });
    return null;
  }
};

export default ErrorBoundary;