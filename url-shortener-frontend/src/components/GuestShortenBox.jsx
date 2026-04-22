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
            ctx.font = "600 16px sans-serif";
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
                    <motion.form 
                        key="input-form"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        onSubmit={handleSubmit(onSubmit)} 
                        className="bg-white dark:bg-slate-900 p-2.5 rounded-[2rem] shadow-premium dark:shadow-glass-dark border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 w-full max-w-3xl relative z-10 transition-all duration-300"
                    >
                        <div className="flex-1 relative">
                            <input 
                                type="url" 
                                placeholder="Paste your long link here..." 
                                className={`w-full h-full min-h-[60px] px-6 bg-slate-50 dark:bg-slate-950 rounded-[1.5rem] outline-none border focus:border-slate-900 dark:focus:border-slate-100 focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-100 transition-all text-slate-900 dark:text-white font-medium placeholder-slate-400 dark:placeholder-slate-500 ${errors.originalUrl ? 'border-red-400 dark:border-red-500' : 'border-transparent'}`}
                                {...register("originalUrl", { required: "Please enter a URL" })}
                            />
                            {errors.originalUrl && <span className="absolute -bottom-6 left-4 text-xs text-red-500 dark:text-red-400 font-semibold">{errors.originalUrl.message}</span>}
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full sm:w-auto px-10 py-4 min-h-[60px] bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold tracking-wide uppercase text-sm rounded-[1.5rem] transition-all duration-200 shadow-lg shadow-black/5 dark:shadow-white/5 active:scale-95 ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-slate-800 dark:hover:bg-slate-100"}`}
                        >
                            {loading ? "Shortening..." : "Shorten Now"}
                        </button>
                    </motion.form>

                ) : (
                    <motion.div 
                        key="result-box" layout 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-premium dark:shadow-glass-dark border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center relative overflow-hidden w-full max-w-2xl transition-all duration-300"
                    >
                        {!token && (
                            <div className="absolute top-0 left-0 w-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-bold py-1.5 uppercase tracking-widest border-b border-orange-100 dark:border-orange-500/20">
                                Guest Link • Expires in 7 Days
                            </div>
                        )}

                        <h3 className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mb-2 mt-4">Your shortened link is ready!</h3>
                        
                        <a href={shortenedUrl} target="_blank" rel="noreferrer" className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors tracking-tight mb-8 break-all">
                            {shortenedUrl.replace(/^https?:\/\//, "")}
                        </a>

                        <div className="flex flex-col sm:flex-row w-full gap-3 max-w-lg">
                            <CopyToClipboard text={shortenedUrl} onCopy={handleCopy}>
                                <button className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold transition-all active:scale-95 ${isCopied ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-md'}`}>
                                    {isCopied ? <LiaCheckSolid className="text-xl" /> : <IoCopy className="text-xl" />}
                                    {isCopied ? "Copied!" : "Copy Link"}
                                </button>
                            </CopyToClipboard>
                            
                            <button 
                                onClick={() => setShowQrPanel(!showQrPanel)} 
                                className={`flex-1 flex items-center justify-center gap-2 py-4 border rounded-2xl font-semibold transition-all active:scale-95 ${showQrPanel ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300' : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm'}`}
                            >
                                <FaQrcode className="text-lg" /> {showQrPanel ? "Hide QR" : "Create QR"}
                            </button>
                        </div>

                        <AnimatePresence>
                            {showQrPanel && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="w-full overflow-hidden">
                                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-left">
                                        
                                        {/* EXPLICITLY WHITE BACKGROUND FOR QR CODE SCANNABILITY */}
                                        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm shrink-0 flex flex-col items-center justify-center min-w-[180px]">
                                            <QRCodeCanvas 
                                                id="guest-qr-canvas"
                                                value={shortenedUrl} 
                                                size={140} 
                                                level={"H"} 
                                                includeMargin={false}
                                                fgColor="#0f172a" 
                                            />
                                            {customText.trim() && (
                                                <p className="mt-3 font-semibold text-slate-900 text-xs text-center truncate w-full px-2 max-w-[140px]">
                                                    {customText}
                                                </p>
                                            )}
                                        </div>
                                        
                                        <div className="flex flex-col flex-1 w-full max-w-sm">
                                            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest ml-1">
                                                Text Below QR (Optional)
                                            </label>
                                            <input 
                                                type="text" value={customText} onChange={(e) => setCustomText(e.target.value)}
                                                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-100 outline-none transition-all text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 mb-4"
                                                placeholder="Leave blank for no text" maxLength={35}
                                            />
                                            <button 
                                                onClick={downloadQRCode} 
                                                className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold text-sm shadow-md hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors active:scale-95"
                                            >
                                                Download PNG Image
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button 
                            onClick={resetBox} 
                            className="mt-8 group flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            <FaRedoAlt className="text-xs group-hover:-rotate-180 transition-transform duration-500" /> 
                            <span className="border-b border-transparent group-hover:border-slate-900 dark:group-hover:border-white transition-colors pb-0.5">
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