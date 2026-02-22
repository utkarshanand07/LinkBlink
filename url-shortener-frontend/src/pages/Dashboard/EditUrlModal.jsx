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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all">
                <h2 className="text-xl font-bold text-black tracking-tight mb-2">
                    Edit Link Destination
                </h2>
                <p className="text-sm font-medium text-gray-500 mb-6">
                    Update where your shortened URL redirects to.
                </p>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Original URL
                    </label>
                    <input 
                        type="url"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm"
                        placeholder="https://example.com"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 text-sm font-medium text-black bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm(newUrl);
                            onClose();
                        }}
                        disabled={!newUrl || newUrl === currentOriginalUrl}
                        className="px-4 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-200/50"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditUrlModal;