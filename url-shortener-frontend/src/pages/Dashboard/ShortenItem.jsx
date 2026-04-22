import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FaExternalLinkAlt, FaRegCalendarAlt, FaTrash, FaPen, FaQrcode } from 'react-icons/fa';
import { IoCopy } from 'react-icons/io5';
import { LiaCheckSolid } from 'react-icons/lia';
import { MdAnalytics, MdOutlineAdsClick } from 'react-icons/md';
import api from '../../api/axiosApi';
import { Link, useNavigate } from 'react-router-dom';
import { useStoreContext } from '../../contextApi/ContextApi';
import { Hourglass } from 'react-loader-spinner';
import Graph from './Graph';
// UPDATED IMPORT: Pointing to the global ConfirmModal
import ConfirmModal from '../../components/ConfirmModal'; 
import EditUrlModal from './EditUrlModal';
import QrCodeModal from './QrCodeModal';

const ShortenItem = ({ id, originalUrl, shortUrl, clickCount, createdDate, isSelected, onToggleSelect, refetch }) => {
    const { token, theme } = useStoreContext();
    const navigate = useNavigate();
    const [isCopied, setIsCopied] = useState(false);
    const [analyticToggle, setAnalyticToggle] = useState(false);
    const [loader, setLoader] = useState(false);
    const [selectedUrl, setSelectedUrl] = useState("");
    const [analyticsData, setAnalyticsData] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);

    const frontendUrl = import.meta.env.VITE_REACT_FRONT_END_URL || "localhost:5173";
    const subDomain = frontendUrl.replace(/^https?:\/\//, "");

    const analyticsHandler = (shortUrl) => {
        if (!analyticToggle) setSelectedUrl(shortUrl);
        setAnalyticToggle(!analyticToggle);
    }

    const fetchMyShortUrl = async () => {
        setLoader(true);
        try {
            const currentEndDate = dayjs().format("YYYY-MM-DDTHH:mm:ss");
            const { data } = await api.get(`/api/urls/analytics/${selectedUrl}?startDate=2025-01-01T00:00:00&endDate=${currentEndDate}`, { headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: "Bearer " + token }});
            setAnalyticsData(data);
            setSelectedUrl("");
        } catch (error) {
            navigate("/error");
        } finally {
            setLoader(false);
        }
    }

    const handleDelete = async () => {
        try { await api.delete(`/api/urls/${id}`, { headers: { Authorization: "Bearer " + token }}); refetch(); } 
        catch (error) { alert("Failed to delete URL."); }
    }

    const handleEdit = async (newOriginalUrl) => {
        try { await api.put(`/api/urls/${id}`, { originalUrl: newOriginalUrl }, { headers: { Authorization: "Bearer " + token }}); refetch(); } 
        catch (error) { alert("Failed to update URL."); }
    }

    const handleCopy = () => { setIsCopied(true); setTimeout(() => setIsCopied(false), 2500); };

    useEffect(() => { if (selectedUrl) fetchMyShortUrl(); }, [selectedUrl]);

  return (
    <>
        <div className={`bg-white dark:bg-slate-900 border transition-all duration-300 p-6 sm:p-8 rounded-[2rem] shadow-sm ${isSelected ? 'border-blue-600 dark:border-blue-500 ring-1 ring-blue-600 dark:ring-blue-500 bg-blue-50/30 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-md'}`}>
          
          <div className="flex flex-col sm:flex-row sm:justify-between items-start w-full gap-6">
            
            {/* Left: Info */}
            <div className="flex items-start gap-4 flex-1 w-full">
                <div className="pt-1.5 shrink-0">
                    <input 
                        type="checkbox" 
                        className="w-5 h-5 text-blue-600 bg-white border-slate-300 dark:bg-slate-800 dark:border-slate-600 rounded cursor-pointer transition-all"
                        checked={isSelected}
                        onChange={onToggleSelect}
                    />
                </div>

                <div className="flex-1 space-y-2 overflow-hidden">
                    <div className="flex items-center gap-3">
                        <Link target='_blank' to={`${import.meta.env.VITE_REACT_FRONT_END_URL}/s/${shortUrl}`} className="text-xl font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors tracking-tight truncate">
                            {subDomain}/s/{shortUrl}
                        </Link>
                        <FaExternalLinkAlt className="text-slate-400 text-sm shrink-0" />
                    </div>

                    <div className="flex items-center">
                        <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm truncate w-full max-w-xl">
                            {originalUrl}
                        </h3>
                    </div>

                    <div className="flex items-center gap-6 pt-4">
                        <div className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-300">
                            <MdOutlineAdsClick className="text-slate-400 dark:text-slate-500 text-xl" />
                            <span className="text-xs uppercase tracking-widest font-semibold">{clickCount} Clicks</span>
                        </div>
                        <div className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-300">
                            <FaRegCalendarAlt className="text-slate-400 dark:text-slate-500 text-lg" />
                            <span className="text-xs uppercase tracking-widest font-semibold">{dayjs(createdDate).format("MMM DD, YYYY")}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap w-full sm:w-auto">
                <CopyToClipboard onCopy={handleCopy} text={`${import.meta.env.VITE_REACT_FRONT_END_URL}/s/${shortUrl}`}>
                    <button className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-colors border ${isCopied ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                        <span className="text-xs uppercase tracking-widest">{isCopied ? "Copied" : "Copy"}</span>
                        {isCopied ? <LiaCheckSolid className="text-lg" /> : <IoCopy className="text-lg" />}
                    </button>
                </CopyToClipboard>

                <button onClick={() => setIsQrModalOpen(true)} className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"><FaQrcode className="text-base" /></button>
                <button onClick={() => setIsEditModalOpen(true)} className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"><FaPen className="text-base" /></button>
                <button onClick={() => setIsDeleteModalOpen(true)} className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-xl transition-colors"><FaTrash className="text-base" /></button>

                <button
                    onClick={() => analyticsHandler(shortUrl)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all active:scale-95 border border-transparent ${analyticToggle ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900" : "bg-slate-900 dark:bg-white text-white dark:text-slate-900"}`}
                >
                    <span className="text-xs uppercase tracking-widest">Analytics</span>
                    <MdAnalytics className="text-xl" />
                </button>
            </div>
          </div>

          {/* Analytics Graph Drawer */}
          <div className={`transition-all duration-500 overflow-hidden ${analyticToggle ? "max-h-[500px] mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 opacity-100" : "max-h-0 opacity-0"}`}>
              {loader ? (
                  <div className="h-64 flex justify-center items-center w-full">
                      <div className="flex flex-col items-center gap-3">
                          <Hourglass visible={true} height="40" width="40" ariaLabel="hourglass-loading" colors={theme === 'dark' ? ['#ffffff', '#475569'] : ['#0f172a', '#cbd5e1']} />
                          <p className='text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-widest animate-pulse'>Loading metrics...</p>
                      </div>
                  </div>
              ) : ( 
                  <div className="h-64 relative w-full">
                      {analyticsData.length === 0 && (
                          <div className="absolute inset-0 flex flex-col justify-center items-center bg-white/90 dark:bg-slate-900/90 z-10 rounded-2xl">
                              <h1 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight mb-2">No data yet.</h1>
                              <h3 className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm">Share your short link to start tracking.</h3>
                          </div>
                      )}
                      <div className="h-full w-full"><Graph graphData={analyticsData} /></div>
                  </div>
              )}
          </div>
        </div>

        {/* UPDATED: Passing confirmText to the general modal */}
        <ConfirmModal 
            isOpen={isDeleteModalOpen} 
            onClose={() => setIsDeleteModalOpen(false)} 
            onConfirm={handleDelete} 
            title="Delete URL" 
            message="Permanently delete this URL?" 
            confirmText="Delete"
        />
        <EditUrlModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onConfirm={handleEdit} currentOriginalUrl={originalUrl} />
        <QrCodeModal isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} shortUrl={shortUrl} />
    </>
  );
}

export default ShortenItem;