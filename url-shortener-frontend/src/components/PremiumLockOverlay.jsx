import React from 'react';
import { FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PremiumLockOverlay = ({ title }) => {
    const navigate = useNavigate();

    return (
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-[2rem] transition-all duration-300">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-lg shadow-slate-200/50 dark:shadow-black/50 mb-4">
                <FaLock className="text-2xl text-slate-400 dark:text-slate-500" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                {title}
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 text-center max-w-xs">
                Upgrade to the Enterprise plan to unlock deep insights into your audience.
            </p>
            <button 
                onClick={() => navigate('/pricing')}
                className="px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-95 shadow-md"
            >
                Upgrade to Enterprise
            </button>
        </div>
    );
};

export default PremiumLockOverlay;