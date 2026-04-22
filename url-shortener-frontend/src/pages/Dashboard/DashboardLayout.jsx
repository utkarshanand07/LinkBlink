import React, { useState } from 'react';
import Graph from './Graph';
import { useStoreContext } from '../../contextApi/ContextApi';
import { useFetchMyShortUrls, useFetchTotalClicks, useFetchCurrentUser } from '../../hooks/useQuery'; 
import ShortenPopUp from './ShortenPopUp';
import { FaLink, FaPlus, FaCrown } from 'react-icons/fa'; 
import ShortenUrlList from './ShortenUrlList';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import dayjs from 'dayjs';
import ManageBillingModal from '../../components/ManageBillingModal';

const DashboardLayout = () => {
    const { token } = useStoreContext();
    const navigate = useNavigate();
    const [shortenPopUp, setShortenPopUp] = useState(false);
    const [billingModalOpen, setBillingModalOpen] = useState(false);
    const [page, setPage] = useState(0);
    const size = 10;

    function onError() { navigate("/error"); }

    const { isLoading, data: myShortenUrlsData, refetch } = useFetchMyShortUrls(token, page, size, onError);
    const { isLoading: loader, data: totalClicks } = useFetchTotalClicks(token, onError);
    const { data: userProfile } = useFetchCurrentUser(token, () => console.log("Failed to fetch profile"));

    const hasUrls = myShortenUrlsData?.content && myShortenUrlsData.content.length > 0;
    const displayRole = userProfile?.role ? userProfile.role.replace('ROLE_', '') : 'BASIC';

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 flex flex-col pb-20 transition-colors duration-300">
        {loader ? ( 
            <Loader />
        ): ( 
        <div className="max-w-7xl w-full mx-auto px-6 lg:px-16 pt-8 lg:pt-12">
            
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pt-4">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                        Analytics Overview
                    </h1>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Track your link performance and engagement.
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    {/* PLAN BADGE */}
                    {userProfile && (
                        <button 
                            onClick={() => setBillingModalOpen(true)}
                            className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-5 h-14 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all text-left group w-full sm:w-auto"
                        >
                            <div className={`p-2 rounded-xl transition-colors ${displayRole === 'BASIC' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300' : 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'}`}>
                                <FaCrown className="text-lg" />
                            </div>
                            <div className="flex flex-col pr-1">
                                <span className="text-[13px] font-bold text-slate-900 dark:text-white uppercase tracking-wide leading-tight">
                                    {displayRole} PLAN
                                </span>
                                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-tight mt-0.5">
                                    {displayRole === 'BASIC' || displayRole === 'ADMIN' || !userProfile.tierExpiresAt
                                        ? "Lifetime Access" 
                                        : `Expires ${dayjs(userProfile.tierExpiresAt).format("MMM DD, YY")}`
                                    }
                                </span>
                            </div>
                        </button>
                    )}

                    <button
                        className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 h-14 rounded-2xl font-semibold transition-all duration-200 shadow-md hover:scale-95 w-full sm:w-auto"
                        onClick={() => setShortenPopUp(true)}
                    >
                        <FaPlus className="text-sm" />
                        <span>Create Link</span>
                    </button>
                </div>
            </div>

            {/* Graph Card Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm rounded-[2rem] p-6 sm:p-8 mb-16 relative h-100 w-full transition-all duration-300">
                {(!totalClicks || totalClicks.length === 0) && (
                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-white/90 dark:bg-slate-900/90 z-10 rounded-[2rem]">
                        <h1 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight mb-2">
                            No data for this time period.
                        </h1>
                        <h3 className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm">
                            Share your short links to view where your engagements are coming from.
                        </h3>
                    </div>
                )}
                <Graph graphData={totalClicks || []} />
            </div>

            {/* URL List Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                    Your Links
                </h2>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8">
                    Manage and view details for all your shortened URLs.
                </p>

                {isLoading ? (
                    <Loader />
                ) : !hasUrls ? (
                    <div className="flex flex-col items-center justify-center py-24 px-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-[2rem] bg-white dark:bg-slate-900 mt-6">
                        <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-full mb-6">
                            <FaLink className="text-slate-400 dark:text-slate-400 text-3xl" />
                        </div>
                        <h1 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight mb-3">
                            No links found
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8 text-center max-w-md">
                            {page === 0 
                                ? "You haven't shortened any URLs. Click the button below to create your first short link."
                                : "No more URLs found on this page."}
                        </p>
                        {page === 0 && (
                            <button
                                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 active:scale-95"
                                onClick={() => setShortenPopUp(true)}
                            >
                                Create your first link
                            </button>
                        )}
                    </div>
                ) : (
                    <ShortenUrlList data={myShortenUrlsData} refetch={refetch} currentPage={page} setPage={setPage} />
                )}
            </div>
        </div>
        )}

        <ShortenPopUp refetch={refetch} open={shortenPopUp} setOpen={setShortenPopUp} />
        <ManageBillingModal isOpen={billingModalOpen} onClose={() => setBillingModalOpen(false)} userProfile={userProfile} />
    </div>
  )
}

export default DashboardLayout;