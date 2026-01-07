
import React from 'react';

interface LoadingStateProps {
  message: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-emerald-100 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-emerald-900 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-amber-400 rounded-full"></div>
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-emerald-900">{message}</p>
        <p className="text-sm text-slate-400 mt-1">This may take a minute depending on video length</p>
      </div>
    </div>
  );
};

export default LoadingState;
