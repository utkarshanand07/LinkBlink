import React from 'react';
import { RotatingLines } from 'react-loader-spinner';

function Loader() {
  return (
    <div className="flex justify-center items-center w-full min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <RotatingLines
          visible={true}
          height="40"
          width="40"
          strokeColor="#000000"
          strokeWidth="4"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
        />
        <span className="text-sm font-medium text-gray-400 tracking-wide animate-pulse">
          Loading...
        </span>
      </div>
    </div>
  );
}

export default Loader;