import React, { useState, useEffect } from 'react';

const EditUrlModal = ({ isOpen, onClose, onConfirm, currentOriginalUrl }) => {
    const [newUrl, setNewUrl] = useState("");

    useEffect(() => {
        if (currentOriginalUrl) {
            setNewUrl(currentOriginalUrl);
        }
    }, [currentOriginalUrl, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 w-full max-w-md shadow-premium dark:shadow-glass-dark border border-slate-200 dark:border-slate-700 transform transition-all animate-fade-in">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                    Edit Destination
                </h2>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8">
                    Update where your shortened URL redirects to.
                </p>
                
                <div className="mb-8">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-widest ml-1">
                        Original URL
                    </label>
                    <input 
                        type="url"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-brand-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-100 outline-none transition-all text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder="https://example.com"
                    />
                </div>

                <div className="flex justify-end gap-3 w-full sm:w-auto">
                    <button
                        onClick={onClose}
                        className="flex-1 sm:flex-none px-6 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm(newUrl);
                            onClose();
                        }}
                        disabled={!newUrl || newUrl === currentOriginalUrl}
                        className="flex-1 sm:flex-none px-6 py-3.5 text-sm font-bold text-white dark:text-slate-900 bg-slate-900 dark:bg-white rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditUrlModal;