import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QrCodeModal = ({ isOpen, onClose, shortUrl }) => {
    const frontendUrl = import.meta.env.VITE_REACT_FRONT_END_URL || "http://localhost:5173";
    const fullUrl = `${frontendUrl}/s/${shortUrl}`;
    const displayUrl = fullUrl.replace(/^https?:\/\//, ""); 

    const [customText, setCustomText] = useState(displayUrl);

    useEffect(() => {
        if (isOpen) setCustomText(displayUrl);
    }, [isOpen, displayUrl]);

    if (!isOpen) return null;

    const downloadQRCode = () => {
        const qrCanvas = document.getElementById("qr-canvas-modal");
        if (!qrCanvas) return;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const padding = 24;
        const qrSize = qrCanvas.width;
        const textSpace = customText.trim() ? 40 : 0; 

        canvas.width = qrSize + padding * 2;
        canvas.height = qrSize + padding * 2 + textSpace;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(qrCanvas, padding, padding);

        if (customText.trim()) {
            ctx.font = "bold 16px sans-serif";
            ctx.fillStyle = "#000000";
            ctx.textAlign = "center";
            ctx.fillText(customText, canvas.width / 2, canvas.height - padding + 5);
        }

        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `QR-${shortUrl}.png`;
        link.click();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 w-full max-w-sm shadow-premium dark:shadow-glass-dark border border-slate-200 dark:border-slate-700 transform transition-all flex flex-col items-center animate-fade-in">
                
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2 text-center">
                    QR Code
                </h2>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 text-center">
                    Scan to instantly redirect to your destination.
                </p>

                {/* Explicitly White QR Container */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-8 flex flex-col items-center justify-center w-full relative">
                    <QRCodeCanvas 
                        id="qr-canvas-modal"
                        value={fullUrl} 
                        size={180} 
                        level={"H"} 
                        includeMargin={false}
                        fgColor="#0f172a" // Deep slate for premium look
                    />
                    {customText.trim() && (
                        <p className="mt-4 font-bold text-slate-900 text-sm text-center truncate w-full px-2">
                            {customText}
                        </p>
                    )}
                </div>
                
                <div className="w-full mb-8">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-widest ml-1">
                        Text Below QR (Optional)
                    </label>
                    <input 
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-brand-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-100 outline-none transition-all text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder="Leave blank for no text"
                        maxLength={35}
                    />
                </div>

                <div className="flex w-full gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={downloadQRCode}
                        className="flex-1 px-4 py-3.5 text-sm font-bold text-white dark:text-slate-900 bg-slate-900 dark:bg-white rounded-xl transition-all shadow-md active:scale-95"
                    >
                        Download
                    </button>
                </div>

            </div>
        </div>
    );
};

export default QrCodeModal;