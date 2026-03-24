import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", isDanger = true }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all">
                <h2 className="text-xl font-bold text-black tracking-tight mb-2">
                    {title}
                </h2>
                <p className="text-sm font-medium text-gray-500 mb-6 leading-relaxed">
                    {message}
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-4 py-2.5 text-sm font-bold text-white rounded-xl transition-all shadow-md ${
                            isDanger 
                            ? "bg-red-600 hover:bg-red-700 shadow-red-200/50" 
                            : "bg-black hover:bg-gray-800 shadow-gray-300/50"
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;