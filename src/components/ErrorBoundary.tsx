
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white p-8 font-mono">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong.</h1>
          <div className="bg-gray-800 p-4 rounded border border-gray-700 overflow-auto">
             <p className="text-lg font-semibold mb-2">{this.state.error?.toString()}</p>
             <pre className="text-sm text-gray-400 whitespace-pre-wrap">
               {this.state.errorInfo?.componentStack}
             </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
