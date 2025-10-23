import { Component, ReactNode } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // eslint-disable-next-line no-console
    console.error("Runtime error captured by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
          <div className="max-w-xl w-full rounded-xl border border-red-200 bg-white/80 backdrop-blur-md shadow-elevated p-6">
            <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
            <p className="text-sm text-muted-foreground mb-4">An unexpected error occurred while rendering the page.</p>
            <pre className="text-xs overflow-auto p-3 rounded-md bg-red-50 border border-red-100 text-red-700">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center px-4 py-2 rounded-md bg-primary text-white hover:opacity-90"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
