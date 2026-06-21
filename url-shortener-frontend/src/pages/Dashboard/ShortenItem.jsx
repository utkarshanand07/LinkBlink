import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FaExternalLinkAlt, FaRegCalendarAlt, FaTrash, FaPen, FaQrcode, FaChartBar, FaGlobe, FaLaptopCode, FaLock } from 'react-icons/fa';
import { IoCopy } from 'react-icons/io5';
import { LiaCheckSolid } from 'react-icons/lia';
import { MdAnalytics, MdOutlineAdsClick } from 'react-icons/md';
import api from '../../api/axiosApi';
import { Link, useNavigate } from 'react-router-dom';
import { useStoreContext } from '../../contextApi/ContextApi';
import { Hourglass } from 'react-loader-spinner';
import Graph from './Graph';
import ConfirmModal from '../../components/ConfirmModal'; 
import EditUrlModal from './EditUrlModal';
import QrCodeModal from './QrCodeModal';

import { useFetchAdvancedAnalyticsUrl, useFetchCurrentUser } from '../../hooks/useQuery';
import PremiumLockOverlay from '../../components/PremiumLockOverlay';
// Import all chart components
import { DonutChartCard, PieChartCard, HorizontalBarCard, ReferrerListCard } from '../../components/AnalyticsCharts';

const ShortenItem = ({ id, originalUrl, shortUrl, clickCount, createdDate, isSelected, onToggleSelect, refetch }) => {
    const { token, theme } = useStoreContext();
    const navigate = useNavigate();
    const [isCopied, setIsCopied] = useState(false);
    const [analyticToggle, setAnalyticToggle] = useState(false);
    const [activeDrawerTab, setActiveDrawerTab] = useState('ENGAGEMENT');

    // UI Modals
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);

    // Basic Analytics State
    const [loader, setLoader] = useState(false);
    const [analyticsData, setAnalyticsData] = useState([]);

    const frontendUrl = import.meta.env.VITE_REACT_FRONT_END_URL || "localhost:5173";
    const subDomain = frontendUrl.replace(/^https?:\/\//, "");

    // User Check for Permissions
    const { data: userProfile } = useFetchCurrentUser(token, () => {});
    const displayRole = userProfile?.role ? userProfile.role.replace('ROLE_', '') : 'BASIC';
    const hasAdvancedAccess = displayRole === 'ENTERPRISE' || displayRole === 'ADMIN';

    // Advanced Analytics Hook
    const shouldFetchAdvanced = analyticToggle && activeDrawerTab !== 'ENGAGEMENT' && hasAdvancedAccess;
    const { data: advancedStats, isLoading: advLoader } = useFetchAdvancedAnalyticsUrl(token, shortUrl, shouldFetchAdvanced);

    const analyticsHandler = () => {
        if (!analyticToggle) {
            fetchBasicAnalytics();
            setActiveDrawerTab('ENGAGEMENT'); 
        }
        setAnalyticToggle(!analyticToggle);
    }

    const fetchBasicAnalytics = async () => {
        setLoader(true);
        try {
            const currentEndDate = dayjs().format("YYYY-MM-DDTHH:mm:ss");
            const { data } = await api.get(`/api/urls/analytics/${shortUrl}?startDate=2025-01-01T00:00:00&endDate=${currentEndDate}`, { 
                headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: "Bearer " + token }
            });
            setAnalyticsData(data);
        } catch (error) {
            console.error("Failed to fetch basic analytics", error);
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

  return (
    <>
        <div className={`bg-white dark:bg-slate-900 border transition-all duration-300 p-6 sm:p-8 rounded-2xl shadow-sm ${isSelected ? 'border-blue-600 dark:border-blue-500 ring-1 ring-blue-600 dark:ring-blue-500 bg-blue-50/30 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'}`}>
          
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
                    onClick={analyticsHandler}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all active:scale-95 border border-transparent ${analyticToggle ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900" : "bg-slate-900 dark:bg-white text-white dark:text-slate-900"}`}
                >
                    <span className="text-xs uppercase tracking-widest">Analytics</span>
                    <MdAnalytics className="text-xl" />
                </button>
            </div>
          </div>

          {/* ================================================== */}
          {/* ANALYTICS GRAPH DRAWER (TABBED) */}
          {/* ================================================== */}
          <div className={`transition-all duration-500 overflow-hidden ${analyticToggle ? "max-h-[2000px] mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 opacity-100" : "max-h-0 opacity-0"}`}>
              
              <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar">
                  <button onClick={() => setActiveDrawerTab("ENGAGEMENT")} className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest font-bold rounded-lg transition-all ${activeDrawerTab === "ENGAGEMENT" ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50"}`}>
                      <FaChartBar /> Clicks
                  </button>
                  <button onClick={() => setActiveDrawerTab("AUDIENCE")} className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest font-bold rounded-lg transition-all ${activeDrawerTab === "AUDIENCE" ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50"}`}>
                      <FaGlobe /> Geo {!hasAdvancedAccess && <FaLock className="ml-1" />}
                  </button>
                  <button onClick={() => setActiveDrawerTab("TECH")} className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest font-bold rounded-lg transition-all ${activeDrawerTab === "TECH" ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50"}`}>
                      <FaLaptopCode /> Tech {!hasAdvancedAccess && <FaLock className="ml-1" />}
                  </button>
              </div>

              {/* Drawer Content Area */}
              <div className="relative min-h-[300px] w-full">
                  
                  {/* TAB 1: BASIC ENGAGEMENT */}
                  {activeDrawerTab === 'ENGAGEMENT' && (
                      loader ? (
                          <div className="h-[300px] flex justify-center items-center w-full">
                              <Hourglass visible={true} height="40" width="40" ariaLabel="hourglass-loading" colors={theme === 'dark' ? ['#ffffff', '#475569'] : ['#0f172a', '#cbd5e1']} />
                          </div>
                      ) : ( 
                          <div className="h-[350px] relative w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                              {analyticsData.length === 0 && (
                                  <div className="absolute inset-0 flex flex-col justify-center items-center bg-white/90 dark:bg-slate-900/90 z-10 rounded-3xl">
                                      <h1 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight mb-2">No data yet.</h1>
                                      <h3 className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm">Share your short link to start tracking.</h3>
                                  </div>
                              )}
                              <div className="h-full w-full"><Graph graphData={analyticsData} /></div>
                          </div>
                      )
                  )}

                  {/* TAB 2: AUDIENCE (Side-by-side) */}
                  {activeDrawerTab === 'AUDIENCE' && (
                      <div className="relative animate-fade-in">
                          {!hasAdvancedAccess && <PremiumLockOverlay title="Audience Insights" />}
                          
                          {/* UPDATED GRID: lg:grid-cols-2 to put them in one row */}
                          <div className={!hasAdvancedAccess ? 'filter blur-[10px] opacity-40 pointer-events-none grid grid-cols-1 lg:grid-cols-2 gap-4' : 'grid grid-cols-1 lg:grid-cols-2 gap-4'}>
                              {advLoader ? (
                                  <div className="h-[300px] col-span-1 lg:col-span-2 flex justify-center items-center"><Hourglass visible={true} height="40" width="40" colors={['#0f172a', '#cbd5e1']} /></div>
                              ) : (
                                  <>
                                      <div className="col-span-1"><HorizontalBarCard title="Top Locations" data={advancedStats?.clicksByCountry} /></div>
                                      <div className="col-span-1"><ReferrerListCard title="Traffic Sources" data={advancedStats?.clicksByReferrer} /></div>
                                  </>
                              )}
                          </div>
                      </div>
                  )}

                  {/* TAB 3: TECH (Three-in-a-row) */}
                  {activeDrawerTab === 'TECH' && (
                      <div className="relative animate-fade-in">
                          {!hasAdvancedAccess && <PremiumLockOverlay title="Technology Insights" />}
                          
                          {/* UPDATED GRID: lg:grid-cols-3 to put all three in one row */}
                          <div className={!hasAdvancedAccess ? 'filter blur-[10px] opacity-40 pointer-events-none grid grid-cols-1 lg:grid-cols-3 gap-4' : 'grid grid-cols-1 lg:grid-cols-3 gap-4'}>
                              {advLoader ? (
                                  <div className="h-[300px] col-span-1 lg:col-span-3 flex justify-center items-center"><Hourglass visible={true} height="40" width="40" colors={['#0f172a', '#cbd5e1']} /></div>
                              ) : (
                                  <>
                                      <div className="col-span-1"><DonutChartCard title="Devices" data={advancedStats?.clicksByDevice} /></div>
                                      <div className="col-span-1"><PieChartCard title="OS" data={advancedStats?.clicksByOs} /></div>
                                      <div className="col-span-1"><DonutChartCard title="Browsers" data={advancedStats?.clicksByBrowser} /></div>
                                  </>
                              )}
                          </div>
                      </div>
                  )}
              </div>
          </div>
        </div>

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