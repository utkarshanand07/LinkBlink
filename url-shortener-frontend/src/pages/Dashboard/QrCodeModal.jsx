import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QrCodeModal = ({ isOpen, onClose, shortUrl }) => {
    // Determine the full frontend URL dynamically
    const frontendUrl = import.meta.env.VITE_REACT_FRONT_END_URL || "http://localhost:5173";
    const fullUrl = `${frontendUrl}/s/${shortUrl}`;
    const displayUrl = fullUrl.replace(/^https?:\/\//, ""); // Removes http:// for a cleaner look

    const [customText, setCustomText] = useState(displayUrl);

    // Reset text to default when modal opens
    useEffect(() => {
        if (isOpen) setCustomText(displayUrl);
    }, [isOpen, displayUrl]);

    if (!isOpen) return null;

    const downloadQRCode = () => {
        const qrCanvas = document.getElementById("qr-canvas");
        if (!qrCanvas) return;

        // Create a new master canvas to combine the QR code and the text
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const padding = 24;
        const qrSize = qrCanvas.width;
        const textSpace = customText.trim() ? 40 : 0; // Only add space if there is text

        // Set dimensions for the final downloaded image
        canvas.width = qrSize + padding * 2;
        canvas.height = qrSize + padding * 2 + textSpace;

        // Draw a clean white background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the QR Code onto the master canvas
        ctx.drawImage(qrCanvas, padding, padding);

        // Draw the text below the QR Code
        if (customText.trim()) {
            ctx.font = "bold 16px sans-serif";
            ctx.fillStyle = "#000000";
            ctx.textAlign = "center";
            ctx.fillText(customText, canvas.width / 2, canvas.height - padding + 5);
        }

        // Trigger the download
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `QR-${shortUrl}.png`;
        link.click();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl transform transition-all flex flex-col items-center">
                
                <h2 className="text-xl font-bold text-black tracking-tight mb-1 text-center">
                    Download QR Code
                </h2>
                <p className="text-sm font-medium text-gray-500 mb-6 text-center">
                    Scan to instantly redirect to your destination.
                </p>

                {/* The QR Code Preview */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col items-center justify-center w-full">
                    <QRCodeCanvas 
                        id="qr-canvas"
                        value={fullUrl} 
                        size={200} 
                        level={"H"} 
                        includeMargin={false}
                    />
                    {customText.trim() && (
                        <p className="mt-4 font-bold text-black text-sm text-center truncate w-full px-2">
                            {customText}
                        </p>
                    )}
                </div>
                
                {/* Custom Text Input */}
                <div className="w-full mb-6">
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                        Text Below QR (Optional)
                    </label>
                    <input 
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm"
                        placeholder="Leave blank for no text"
                    />
                </div>

                <div className="flex w-full gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-black bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={downloadQRCode}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200/50"
                    >
                        Download PNG
                    </button>
                </div>

            </div>
        </div>
    );
};

export default QrCodeModal;