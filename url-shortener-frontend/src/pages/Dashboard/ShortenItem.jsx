import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FaExternalLinkAlt, FaRegCalendarAlt, FaTrash } from 'react-icons/fa';
import { IoCopy } from 'react-icons/io5';
import { LiaCheckSolid } from 'react-icons/lia';
import { MdAnalytics, MdOutlineAdsClick } from 'react-icons/md';
import api from '../../api/axiosApi';
import { Link, useNavigate } from 'react-router-dom';
import { useStoreContext } from '../../contextApi/ContextApi';
import { Hourglass } from 'react-loader-spinner';
import Graph from './Graph';
import ConfirmModal from './ConfirmModal'; // Ensure this matches where you saved the modal file

const ShortenItem = ({ id, originalUrl, shortUrl, clickCount, createdDate, isSelected, onToggleSelect, refetch }) => {
    const { token } = useStoreContext();
    const navigate = useNavigate();
    const [isCopied, setIsCopied] = useState(false);
    const [analyticToggle, setAnalyticToggle] = useState(false);
    const [loader, setLoader] = useState(false);
    const [selectedUrl, setSelectedUrl] = useState("");
    const [analyticsData, setAnalyticsData] = useState([]);
    
    // State for the single delete modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const frontendUrl = import.meta.env.VITE_REACT_FRONT_END_URL || "localhost:5173";
    const subDomain = frontendUrl.replace(/^https?:\/\//, "");

    const analyticsHandler = (shortUrl) => {
        if (!analyticToggle) {
            setSelectedUrl(shortUrl);
        }
        setAnalyticToggle(!analyticToggle);
    }

    const fetchMyShortUrl = async () => {
        setLoader(true);
        try {
            const currentEndDate = dayjs().format("YYYY-MM-DDTHH:mm:ss");
            
            const { data } = await api.get(
                `/api/urls/analytics/${selectedUrl}?startDate=2025-01-01T00:00:00&endDate=${currentEndDate}`, 
                {
                    headers: {
                      "Content-Type": "application/json",
                      Accept: "application/json",
                      Authorization: "Bearer " + token,
                    },
                }
            );
            setAnalyticsData(data);
            setSelectedUrl("");
            
        } catch (error) {
            navigate("/error");
            console.log(error);
        } finally {
            setLoader(false);
        }
    }

    const handleDelete = async () => {
        try {
            await api.delete(`/api/urls/${id}`, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            refetch(); // Refresh list after deleting
        } catch (error) {
            console.error("Error deleting URL:", error);
            alert("Failed to delete URL.");
        }
    }

    useEffect(() => {
        if (selectedUrl) {
            fetchMyShortUrl();
        }
    }, [selectedUrl]);

  return (
    <>
        {/* Main Card */}
        <div className={`bg-white border ${isSelected ? 'border-black' : 'border-gray-100'} p-6 rounded-2xl hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300`}>
          
          {/* Top Section */}
          <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-6">
            
            {/* Checkbox and URL Information */}
            <div className="flex items-start gap-4 flex-1">
                
                {/* Checkbox Container */}
                <div className="pt-1.5 shrink-0">
                    <input 
                        type="checkbox" 
                        className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black cursor-pointer accent-black"
                        checked={isSelected}
                        onChange={onToggleSelect}
                    />
                </div>

                <div className="flex-1 space-y-2 overflow-hidden">
                    <div className="flex items-center gap-3">
                        <Link
                            target='_blank'
                            className="text-lg font-bold text-black hover:text-gray-600 transition-colors tracking-tight truncate"
                            to={import.meta.env.VITE_REACT_FRONT_END_URL + "/s/" + `${shortUrl}`}
                        >
                            {subDomain + "/s/" + `${shortUrl}`}
                        </Link>
                        <FaExternalLinkAlt className="text-gray-400 text-sm shrink-0" />
                    </div>

                    <div className="flex items-center">
                        <h3 className="text-gray-500 font-medium text-sm truncate w-full max-w-xl">
                            {originalUrl}
                        </h3>
                    </div>

                    {/* Meta Data (Clicks & Date) */}
                    <div className="flex items-center gap-6 pt-4">
                        <div className="flex items-center gap-1.5 font-medium text-gray-700">
                            <MdOutlineAdsClick className="text-gray-400 text-xl" />
                            <span className="text-sm">{clickCount} {clickCount === 1 ? "Click" : "Clicks"}</span>
                        </div>

                        <div className="flex items-center gap-1.5 font-medium text-gray-700">
                            <FaRegCalendarAlt className="text-gray-400" />
                            <span className="text-sm">
                            {dayjs(createdDate).format("MMM DD, YYYY")}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex sm:justify-end items-start gap-3 shrink-0">
                <CopyToClipboard
                    onCopy={() => setIsCopied(true)}
                    text={`${import.meta.env.VITE_REACT_FRONT_END_URL + "/s/" + `${shortUrl}`}`}
                >
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-black rounded-lg font-medium transition-colors duration-200" title="Copy Link">
                        <span>{isCopied ? "Copied" : "Copy"}</span>
                        {isCopied ? (
                            <LiaCheckSolid className="text-lg" />
                        ) : (
                            <IoCopy className="text-lg" />
                        )}
                    </button>
                </CopyToClipboard>

                <button
                    onClick={() => analyticsHandler(shortUrl)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 ${
                      analyticToggle 
                        ? "bg-gray-800 text-white" 
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                    title="View Analytics"
                >
                    <span>Analytics</span>
                    <MdAnalytics className="text-lg" />
                </button>

                {/* Single Delete Button */}
                <button 
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="flex items-center justify-center px-4 py-2.5 bg-white border border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 rounded-lg transition-colors duration-200"
                    title="Delete URL"
                >
                    <FaTrash className="text-lg" />
                </button>
            </div>
          </div>

          {/* Analytics Graph Section */}
          <div 
            className={`transition-all duration-300 overflow-hidden ${
              analyticToggle ? "mt-6 pt-6 border-t border-gray-100 opacity-100" : "h-0 opacity-0"
            }`}
          >
              {loader ? (
                  <div className="min-h-75 flex justify-center items-center w-full">
                      <div className="flex flex-col items-center gap-3">
                          <Hourglass
                              visible={true}
                              height="40"
                              width="40"
                              ariaLabel="hourglass-loading"
                              colors={['#000000', '#e5e7eb']}
                          />
                          <p className='text-gray-500 font-medium text-sm animate-pulse'>Loading metrics...</p>
                      </div>
                  </div>
              ) : ( 
                  <div className="min-h-75 relative w-full">
                      {analyticsData.length === 0 && (
                          <div className="absolute inset-0 flex flex-col justify-center items-center bg-white/80 z-10 backdrop-blur-sm">
                              <h1 className="text-black text-xl font-bold tracking-tight mb-2">
                                  No data yet.
                              </h1>
                              <h3 className="text-center text-sm font-medium text-gray-500 max-w-sm">
                                  Share your short link to start tracking where your engagements are coming from.
                              </h3>
                          </div>
                      )}
                      <div className="h-75 w-full">
                        <Graph graphData={analyticsData} />
                      </div>
                  </div>
              )}
          </div>
          
        </div>

        {/* Single Delete Confirmation Modal */}
        <ConfirmModal 
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
            title="Delete URL"
            message="Are you sure you want to permanently delete this URL? This action cannot be undone."
        />
    </>
  )
}

export default ShortenItem;