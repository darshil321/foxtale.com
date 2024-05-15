import React from 'react';
const LoadingOverlay = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-80">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-black"></div>
    </div>
  );
};
export default LoadingOverlay;
