import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorBoundaryState: React.FC<ErrorBoundaryStateProps> = ({ message, onRetry }) => {
  return (
          <div className="min-h-screen bg-rvscream text-rvsslate flex items-center justify-center px-4">
            <div className="max-w-md w-full rounded-lg border border-rvsmaroon/30 bg-white p-8 text-center shadow-lg">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-rvsmaroon/10 border border-rvsmaroon/30 text-rvsmaroon">
                <AlertTriangle className="w-7 h-7" />
              </div>
                <h1 className="font-display text-2xl font-bold text-rvsslate">
                  Unable to Load Lab Data
                </h1>
                <p className="mt-3 text-sm text-zinc-600 leading-relaxed">{message}</p>
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-6 inline-flex items-center gap-2 rounded-md bg-rvsmaroon px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-rvsmaroon-dark transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-rvsgold" />
                  <span>Retry Loading</span>
                </button>
            </div>
          </div>
          );
};
