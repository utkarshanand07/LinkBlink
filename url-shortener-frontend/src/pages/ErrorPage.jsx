import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ErrorPage = ({ message }) => {
    const navigate = useNavigate();
    
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-white p-6">
        
        {/* Softened Icon Treatment */}
        <div className="bg-gray-50 p-6 rounded-full mb-8">
            <FaExclamationTriangle className="text-4xl text-black" />
        </div>
        
        {/* Premium Typography */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-black tracking-tight mb-4 text-center">
            Oops! Something went wrong.
        </h1>
        
        <p className="text-gray-500 text-base md:text-lg mb-10 text-center max-w-md leading-relaxed">
            {message ? message : "An unexpected error has occurred while processing your request. Please try again."}
        </p>
        
        {/* Consistent Action Button */}
        <button 
            onClick={() => navigate("/")}
            className="px-8 py-3.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
            Go back home
        </button>
        
    </div>
  );
}

export default ErrorPage;