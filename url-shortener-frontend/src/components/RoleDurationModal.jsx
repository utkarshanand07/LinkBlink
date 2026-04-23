import React, { useState, useEffect } from 'react';
import { RxCross2 } from 'react-icons/rx';

const RoleDurationModal = ({ isOpen, onClose, onConfirm, username, newRole }) => {
    const [selectedDuration, setSelectedDuration] = useState(30);

    useEffect(() => {
        if (isOpen) setSelectedDuration(30);
    }, [isOpen]);

    if (!isOpen) return null;

    const roleName = newRole.replace('ROLE_', '');

    const durations = [
        { label: "1 Month", days: 30, desc: "Standard monthly billing" },
        { label: "3 Months", days: 90, desc: "Quarterly subscription" },
        { label: "6 Months", days: 180, desc: "Half-year commitment" },
        { label: "1 Year", days: 365, desc: "Annual subscription" },
        { label: "Lifetime", days: null, desc: "Permanent access" }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 w-full max-w-lg shadow-premium dark:shadow-glass-dark border border-slate-200 dark:border-slate-700 transform transition-all relative animate-fade-in">
                
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2.5 text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors z-10"
                >
                    <RxCross2 className="text-xl" />
                </button>

                <div className="mb-8 pr-12">
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                        Upgrade to {roleName}
                    </h2>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                        Select the subscription duration for <strong className="text-slate-900 dark:text-white font-semibold">{username}</strong>. They will automatically be downgraded to Basic when this expires.
                    </p>
                </div>

                {/* Duration Selection Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {durations.map((duration, index) => {
                        const isSelected = selectedDuration === duration.days;
                        return (
                            <button
                                key={index}
                                onClick={() => setSelectedDuration(duration.days)}
                                className={`flex flex-col text-left p-4 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
                                    isSelected 
                                    ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800 shadow-sm" 
                                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
                                } ${duration.days === null ? "sm:col-span-2" : ""}`}
                            >
                                <span className={`font-semibold text-base mb-1 ${isSelected ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                                    {duration.label}
                                </span>
                                <span className={`text-xs font-medium ${isSelected ? "text-slate-600 dark:text-slate-400" : "text-slate-500 dark:text-slate-500"}`}>
                                    {duration.desc}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 w-full sm:w-auto">
                    <button 
                        onClick={onClose} 
                        className="flex-1 sm:flex-none px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors active:scale-95"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => { onConfirm(selectedDuration); onClose(); }} 
                        className="flex-1 sm:flex-none px-6 py-3.5 text-sm font-semibold text-white dark:text-slate-900 bg-slate-900 dark:bg-white rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-md active:scale-95"
                    >
                        Confirm Upgrade
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleDurationModal;