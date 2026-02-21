import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const ShortenUrlPage = () => {
    const { url } = useParams();
    const hasRedirected = useRef(false);

    useEffect(() => {
        if (url && !hasRedirected.current) {
            hasRedirected.current = true; 
            
            window.location.href = import.meta.env.VITE_BACKEND_URL + `/${url}`;
        }
    }, [url]);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="w-10 h-10 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
        
        <p className="text-sm font-medium text-gray-400 tracking-wide animate-pulse">
          Redirecting you...
        </p>
      </div>
    </div>
  );
}

export default ShortenUrlPage;