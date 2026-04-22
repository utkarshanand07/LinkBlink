import React from 'react';

function Loader() {
  return (
    <div className="flex justify-center items-center w-full min-h-[50vh]">
      <div className="flex flex-col items-center gap-5">
        
        {/* Custom Sleek Dual-Ring Spinner */}
        <div className="relative flex items-center justify-center w-12 h-12">
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-slate-200 dark:border-slate-700 animate-[spin_1.5s_linear_infinite]"></div>
            {/* Inner Accent Ring */}
            <div className="absolute inset-1 rounded-full border-b-2 border-l-2 border-blue-500 animate-[spin_1s_ease-in-out_infinite]"></div>
            {/* Pulsing Core */}
            <div className="w-2 h-2 bg-slate-900 dark:bg-white rounded-full animate-pulse"></div>
        </div>

        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] animate-pulse">
          Loading
        </span>
        
      </div>
    </div>
  );
}

export default Loader;