import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console for debugging
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-premium-darker flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-premium-dark rounded-xl shadow-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-500/20 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The dashboard encountered an unexpected error. This might be due to missing or invalid data.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                <RefreshCw size={16} />
                <span>Try Again</span>
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                Reload Page
              </button>
            </div>
            
            {typeof process !== 'undefined' && process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                  Error Details (Development)
                </summary>
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded text-xs font-mono text-gray-700 dark:text-gray-300 overflow-auto max-h-32">
                  <div className="text-red-600 dark:text-red-400 font-semibold">
                    {this.state.error.toString()}
                  </div>
                  <div className="mt-2 text-gray-600 dark:text-gray-400">
                    {this.state.errorInfo.componentStack}
                  </div>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;