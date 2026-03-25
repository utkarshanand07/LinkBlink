import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axiosApi';
import toast from 'react-hot-toast';
import { useStoreContext } from '../contextApi/ContextApi';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FaQrcode, FaRedoAlt } from 'react-icons/fa';
import { IoCopy } from 'react-icons/io5';
import { LiaCheckSolid } from 'react-icons/lia';
import { QRCodeCanvas } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';

const GuestShortenBox = () => {
    const { token } = useStoreContext();
    const [loading, setLoading] = useState(false);
    const [shortenedUrl, setShortenedUrl] = useState(null);
    const [shortCode, setShortCode] = useState("");
    const [isCopied, setIsCopied] = useState(false);
    
    // QR Code Panel States
    const [showQrPanel, setShowQrPanel] = useState(false);
    const [customText, setCustomText] = useState("");

    const frontendUrl = import.meta.env.VITE_REACT_FRONT_END_URL || "http://localhost:5173";

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { originalUrl: "" },
        mode: "onSubmit",
    });

    const onSubmit = async (data) => {
        setLoading(true);
        setShowQrPanel(false); 
        try {
            const headers = { "Content-Type": "application/json", Accept: "application/json" };
            if (token) headers.Authorization = "Bearer " + token;

            const { data: res } = await api.post("/api/urls/shorten", data, { headers });

            const finalUrl = `${frontendUrl}/s/${res.shortUrl}`;
            const displayUrl = finalUrl.replace(/^https?:\/\//, ""); 
            
            setShortenedUrl(finalUrl);
            setShortCode(res.shortUrl);
            setCustomText(displayUrl); 
            
            toast.success("URL Shortened Successfully!");
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to shorten URL.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        setIsCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setIsCopied(false), 2500);
    };

    const downloadQRCode = () => {
        const qrCanvas = document.getElementById("guest-qr-canvas");
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
        link.download = `QR-${shortCode}.png`;
        link.click();
        toast.success("QR Code Downloaded!");
    };

    const resetBox = () => {
        setShortenedUrl(null);
        setShortCode("");
        setCustomText("");
        setShowQrPanel(false);
        reset();
    };

    return (
        <div className="w-full mx-auto mt-8 relative flex justify-center">
            <AnimatePresence mode="wait">
                {!shortenedUrl ? (
                    // --- INPUT FORM ---
                    <motion.form 
                        key="input-form"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        onSubmit={handleSubmit(onSubmit)} 
                        className="bg-white p-2 sm:p-3 rounded-2xl shadow-2xl shadow-black/5 border border-gray-100 flex flex-col sm:flex-row gap-3 w-full max-w-3xl"
                    >
                        <div className="flex-1 relative">
                            <input 
                                type="url" 
                                placeholder="Paste your long link here..." 
                                className={`w-full h-full min-h-[56px] px-5 bg-gray-50 rounded-xl outline-none border focus:border-black focus:ring-1 focus:ring-black transition-all text-gray-800 ${errors.originalUrl ? 'border-red-400' : 'border-transparent'}`}
                                {...register("originalUrl", { required: "Please enter a URL" })}
                            />
                            {errors.originalUrl && <span className="absolute -bottom-6 left-2 text-xs text-red-500 font-medium">{errors.originalUrl.message}</span>}
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full sm:w-auto px-8 py-4 bg-black text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-black/10 ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-800 hover:-translate-y-0.5"}`}
                        >
                            {loading ? "Shortening..." : "Shorten Now"}
                        </button>
                    </motion.form>

                ) : (

                    // --- SUCCESS RESULT BOX ---
                    <motion.div 
                        key="result-box"
                        layout 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl shadow-black/10 border border-gray-100 flex flex-col items-center text-center relative overflow-hidden w-full max-w-2xl"
                    >
                        {!token && (
                            <div className="absolute top-0 left-0 w-full bg-orange-50 text-orange-600 text-xs font-bold py-1.5 uppercase tracking-widest">
                                Guest Link • Expires in 7 Days
                            </div>
                        )}

                        <h3 className="text-gray-500 font-medium text-sm mb-2 mt-4">Your shortened link is ready!</h3>
                        
                        <a href={shortenedUrl} target="_blank" rel="noreferrer" className="text-2xl sm:text-3xl font-extrabold text-blue-600 hover:text-blue-700 transition-colors tracking-tight mb-8 break-all">
                            {shortenedUrl.replace(/^https?:\/\//, "")}
                        </a>

                        {/* Primary Action Buttons */}
                        <div className="flex flex-col sm:flex-row w-full gap-3 max-w-lg">
                            <CopyToClipboard text={shortenedUrl} onCopy={handleCopy}>
                                <button className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all ${isCopied ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/10'}`}>
                                    {isCopied ? <LiaCheckSolid className="text-xl" /> : <IoCopy className="text-xl" />}
                                    {isCopied ? "Copied!" : "Copy Link"}
                                </button>
                            </CopyToClipboard>
                            
                            <button 
                                onClick={() => setShowQrPanel(!showQrPanel)} 
                                className={`flex-1 flex items-center justify-center gap-2 py-3.5 border rounded-xl font-bold transition-all shadow-sm ${showQrPanel ? 'bg-gray-100 border-gray-200 text-gray-700' : 'bg-white border-gray-200 text-black hover:bg-gray-50 hover:border-gray-300'}`}
                            >
                                <FaQrcode className="text-lg" /> {showQrPanel ? "Hide QR Panel" : "Create QR Code"}
                            </button>
                        </div>

                        {/* --- EXPANDING BOTTOM QR PANEL --- */}
                        <AnimatePresence>
                            {showQrPanel && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="w-full overflow-hidden"
                                >
                                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-100 text-left">
                                        
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 shadow-inner shrink-0 flex flex-col items-center justify-center min-w-[180px]">
                                            <QRCodeCanvas 
                                                id="guest-qr-canvas"
                                                value={shortenedUrl} 
                                                size={140} 
                                                level={"H"} 
                                                includeMargin={false}
                                            />
                                            {customText.trim() && (
                                                <p className="mt-3 font-bold text-black text-xs text-center truncate w-full px-2 max-w-[140px]">
                                                    {customText}
                                                </p>
                                            )}
                                        </div>
                                        
                                        <div className="flex flex-col flex-1 w-full max-w-sm">
                                            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider ml-1">
                                                Text Below QR (Optional)
                                            </label>
                                            <input 
                                                type="text"
                                                value={customText}
                                                onChange={(e) => setCustomText(e.target.value)}
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm font-medium shadow-sm mb-4"
                                                placeholder="Leave blank for no text"
                                                maxLength={35}
                                            />
                                            <button 
                                                onClick={downloadQRCode} 
                                                className="w-full py-3.5 bg-black text-white rounded-xl font-bold text-sm shadow-lg shadow-black/10 hover:bg-gray-800 transition-colors"
                                            >
                                                Download PNG Image
                                            </button>
                                        </div>

                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Conspicuous Text-Link Reset Button */}
                        <button 
                            onClick={resetBox} 
                            className="mt-8 group flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors"
                        >
                            <FaRedoAlt className="text-xs group-hover:-rotate-180 transition-transform duration-500" /> 
                            <span className="border-b border-transparent group-hover:border-black transition-colors pb-0.5">
                                Shorten another link
                            </span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GuestShortenBox;