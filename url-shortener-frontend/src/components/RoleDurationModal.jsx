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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl transform transition-all relative">
                
                {/* FIXED: Adjusted positioning so it doesn't overlap */}
                <button 
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                    <RxCross2 className="text-xl" />
                </button>

                {/* FIXED: Added pr-12 to force text to wrap before hitting the button */}
                <div className="mb-8 pr-12">
                    <h2 className="text-2xl font-extrabold text-black tracking-tight mb-2">
                        Upgrade to {roleName}
                    </h2>
                    <p className="text-sm font-medium text-gray-500 leading-relaxed">
                        Select the subscription duration for <strong className="text-black">{username}</strong>. They will automatically be downgraded to Basic when this expires.
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
                                className={`flex flex-col text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                                    isSelected 
                                    ? "border-black bg-gray-50 shadow-md" 
                                    : "border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50"
                                } ${duration.days === null ? "sm:col-span-2" : ""}`}
                            >
                                <span className={`font-bold text-base mb-1 ${isSelected ? "text-black" : "text-gray-700"}`}>
                                    {duration.label}
                                </span>
                                <span className={`text-xs font-medium ${isSelected ? "text-gray-600" : "text-gray-400"}`}>
                                    {duration.desc}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button onClick={onClose} className="px-6 py-3 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button onClick={() => { onConfirm(selectedDuration); onClose(); }} className="px-8 py-3 text-sm font-bold text-white bg-black rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-black/10">
                        Confirm Upgrade
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleDurationModal;