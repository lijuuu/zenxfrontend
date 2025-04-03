
import React from "react";

const LoadingFallback: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
      <div className="h-12 w-full bg-zinc-200 dark:bg-zinc-800 rounded"></div>
      <div className="h-[600px] w-full bg-zinc-200 dark:bg-zinc-800 rounded"></div>
    </div>
  );
};

export default LoadingFallback;
