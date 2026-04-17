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
    
    // Billing Modal State
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
    <div className="min-h-[calc(100vh-80px)] bg-gray-100 flex flex-col pb-20">
        {loader ? ( 
            <Loader />
        ): ( 
        <div className="max-w-7xl w-full mx-auto px-6 lg:px-16 pt-8">
            
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pt-4">
                
                {/* Left Side: Title */}
                <div>
                    <h1 className="text-3xl font-extrabold text-black tracking-tight mb-1">
                        Analytics Overview
                    </h1>
                    <p className="text-sm font-medium text-gray-500">
                        Track your link performance and engagement.
                    </p>
                </div>
                
                {/* Right Side: Equal & Sleek Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    
                    {/* PLAN BADGE BUTTON */}
                    {userProfile && (
                        <button 
                            onClick={() => setBillingModalOpen(true)}
                            className="flex items-center gap-3 bg-white border border-gray-200 px-5 h-14 rounded-2xl shadow-sm hover:border-gray-300 hover:shadow-md transition-all text-left group w-full sm:w-auto"
                        >
                            <div className={`p-2 rounded-xl transition-colors ${displayRole === 'BASIC' ? 'bg-gray-100 text-gray-400 group-hover:text-black' : 'bg-yellow-50 text-yellow-500 group-hover:bg-yellow-100'}`}>
                                <FaCrown className="text-lg" />
                            </div>
                            
                            <div className="flex flex-col pr-1">
                                <span className="text-[13px] font-extrabold text-black uppercase tracking-wide leading-tight">
                                    {displayRole} PLAN
                                </span>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-tight mt-0.5">
                                    {displayRole === 'BASIC' || displayRole === 'ADMIN' || !userProfile.tierExpiresAt
                                        ? "Lifetime Access" 
                                        : `Expires ${dayjs(userProfile.tierExpiresAt).format("MMM DD, YY")}`
                                    }
                                </span>
                            </div>
                        </button>
                    )}

                    {/* CREATE LINK BUTTON */}
                    <button
                        className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-8 h-14 rounded-2xl font-bold transition-all duration-200 shadow-lg shadow-gray-300/50 whitespace-nowrap hover:-translate-y-0.5 w-full sm:w-auto"
                        onClick={() => setShortenPopUp(true)}
                    >
                        <FaPlus className="text-sm" />
                        <span>Create Link</span>
                    </button>
                </div>
            </div>

            {/* Graph Card Section */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 sm:p-8 mb-12 relative h-100 w-full">
                {(!totalClicks || totalClicks.length === 0) && (
                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-white/80 backdrop-blur-sm z-10 rounded-2xl">
                        <h1 className="text-black text-xl font-bold tracking-tight mb-2">
                            No data for this time period.
                        </h1>
                        <h3 className="text-center text-sm font-medium text-gray-500 max-w-sm">
                            Share your short links to view where your engagements are coming from.
                        </h3>
                    </div>
                )}
                <Graph graphData={totalClicks || []} />
            </div>

            {/* URL List Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-black tracking-tight mb-2">
                    Your Links
                </h2>
                <p className="text-sm font-medium text-gray-500 mb-6">
                    Manage and view details for all your shortened URLs.
                </p>

                {isLoading ? (
                    <Loader />
                ) : !hasUrls ? (
                    <div className="flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed border-gray-300 rounded-2xl bg-white mt-6">
                        <div className="bg-gray-100 p-4 rounded-full mb-4">
                            <FaLink className="text-gray-400 text-2xl" />
                        </div>
                        <h1 className="text-black text-lg font-bold tracking-tight mb-2">
                            No links found
                        </h1>
                        <p className="text-sm text-gray-500 font-medium mb-6 text-center max-w-md">
                            {page === 0 
                                ? "You haven't shortened any URLs. Click the button above to create your first short link."
                                : "No more URLs found on this page."}
                        </p>
                        {page === 0 && (
                            <button
                                className="bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-black px-6 py-2.5 rounded-lg font-bold transition-colors duration-200"
                                onClick={() => setShortenPopUp(true)}
                            >
                                Create your first link
                            </button>
                        )}
                    </div>
                ) : (
                    <ShortenUrlList 
                        data={myShortenUrlsData} 
                        refetch={refetch} 
                        currentPage={page} 
                        setPage={setPage} 
                    />
                )}
            </div>
        </div>
        )}

        <ShortenPopUp
          refetch={refetch}
          open={shortenPopUp}
          setOpen={setShortenPopUp}
        />

        {/* Render Billing Modal */}
        <ManageBillingModal 
            isOpen={billingModalOpen}
            onClose={() => setBillingModalOpen(false)}
            userProfile={userProfile}
        />
    </div>
  )
}

export default DashboardLayout;