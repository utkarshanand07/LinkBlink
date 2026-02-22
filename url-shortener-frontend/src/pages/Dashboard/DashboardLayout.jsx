import React, { useState } from 'react';
import Graph from './Graph';
import { useStoreContext } from '../../contextApi/ContextApi';
import { useFetchMyShortUrls, useFetchTotalClicks } from '../../hooks/useQuery';
import ShortenPopUp from './ShortenPopUp';
import { FaLink, FaPlus } from 'react-icons/fa';
import ShortenUrlList from './ShortenUrlList';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';

const DashboardLayout = () => {
    const { token } = useStoreContext();
    const navigate = useNavigate();
    const [shortenPopUp, setShortenPopUp] = useState(false);

    function onError() {
      navigate("/error");
    }

    const { isLoading, data: myShortenUrls, refetch } = useFetchMyShortUrls(token, onError);
    const { isLoading: loader, data: totalClicks } = useFetchTotalClicks(token, onError);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-100 flex flex-col pb-20">
        {loader ? ( 
            <Loader />
        ): ( 
        <div className="max-w-7xl w-full mx-auto px-6 lg:px-16 pt-12">
            
            {/* Dashboard Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-black tracking-tight mb-1">
                        Analytics Overview
                    </h1>
                    <p className="text-sm font-medium text-gray-500">
                        Track your link performance and engagement.
                    </p>
                </div>
                
                {/* Primary Action Button */}
                <button
                    className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3.5 rounded-lg font-medium transition-colors duration-200 shadow-lg shadow-gray-200/50 w-full sm:w-auto justify-center"
                    onClick={() => setShortenPopUp(true)}
                >
                    <FaPlus className="text-sm" />
                    <span>Create Link</span>
                </button>
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

                {!isLoading && (!myShortenUrls || myShortenUrls.length === 0) ? (
                    /* Premium Empty State */
                    <div className="flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed border-gray-300 rounded-2xl bg-white mt-6">
                        <div className="bg-gray-100 p-4 rounded-full mb-4">
                            <FaLink className="text-gray-400 text-2xl" />
                        </div>
                        <h1 className="text-black text-lg font-bold tracking-tight mb-2">
                            No links created yet
                        </h1>
                        <p className="text-sm text-gray-500 font-medium mb-6 text-center max-w-md">
                            You haven't shortened any URLs. Click the button above to create your first short link.
                        </p>
                        <button
                            className="bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-black px-6 py-2.5 rounded-lg font-medium transition-colors duration-200"
                            onClick={() => setShortenPopUp(true)}
                        >
                            Create your first link
                        </button>
                    </div>
                ) : (
                    // PASSED REFETCH DOWN HERE
                    <ShortenUrlList data={myShortenUrls} refetch={refetch} />
                )}
            </div>
        </div>
        )}

        <ShortenPopUp
          refetch={refetch}
          open={shortenPopUp}
          setOpen={setShortenPopUp}
        />
    </div>
  )
}

export default DashboardLayout;