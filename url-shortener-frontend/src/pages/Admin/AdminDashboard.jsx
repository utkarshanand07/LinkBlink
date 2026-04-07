import React, { useState } from 'react';
import { useStoreContext } from '../../contextApi/ContextApi';
import { FaUsers, FaLink, FaDatabase, FaChartLine, FaCalendarDay, FaGhost } from 'react-icons/fa';
import UsersTable from './UsersTable';
import LinksTable from './LinksTable';
import { useCleanupExpiredLinks, useFetchSystemMetrics, useVerifyExpiredRoles } from '../../hooks/useAdminQuery';
import { toast } from 'react-hot-toast';
import Loader from '../../components/Loader';

const AdminDashboard = () => {
    const { token } = useStoreContext();
    const [activeTab, setActiveTab] = useState("users");
    
    const cleanupMutation = useCleanupExpiredLinks(token);
    
    const verifyRolesMutation = useVerifyExpiredRoles(token);
    
    const { data: metrics, isLoading: isMetricsLoading } = useFetchSystemMetrics(
        token, 
        () => toast.error("Failed to load platform metrics")
    );

    const handleCleanup = () => {
        cleanupMutation.mutate(null, {
            onSuccess: (data) => toast.success(`Cleanup complete! Deleted ${data?.data?.deletedCount || 0} expired links.`),
            onError: () => toast.error("Cleanup failed.")
        });
    }
    const handleVerifyRoles = () => {
    verifyRolesMutation.mutate(null, {
        onSuccess: (data) => toast.success(`Sync complete! ${data?.data?.demotedCount || 0} expired plans were demoted.`),
        onError: () => toast.error("Failed to verify roles.")
    });
};

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gray-100 flex flex-col pb-20">
            <div className="max-w-7xl w-full mx-auto px-6 lg:px-16 pt-12">
                
                {/* Admin Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-black tracking-tight mb-1 flex items-center gap-3">
                            Admin Panel
                        </h1>
                        <p className="text-sm font-medium text-gray-500 mt-2">
                            Manage users, inspect platform links, and run cleanup operations.
                        </p>
                    </div>
                </div>

                {/* Sleek Pill Tabs */}
                <div className="flex gap-3 mb-8 overflow-x-auto hide-scrollbar pb-2">
                    <button onClick={() => setActiveTab("users")} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap shadow-sm ${activeTab === "users" ? "bg-black text-white shadow-gray-300/50" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"}`}>
                        <FaUsers /> User Management
                    </button>
                    <button onClick={() => setActiveTab("links")} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap shadow-sm ${activeTab === "links" ? "bg-black text-white shadow-gray-300/50" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"}`}>
                        <FaLink /> Platform Links
                    </button>
                    <button onClick={() => setActiveTab("system")} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap shadow-sm ${activeTab === "system" ? "bg-black text-white shadow-gray-300/50" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"}`}>
                        <FaDatabase /> System Tools
                    </button>
                </div>

                {/* Content Area */}
                <div className="w-full">
                    {activeTab === "users" && <UsersTable />}
                    {activeTab === "links" && <LinksTable />}

                    {activeTab === "system" && (
                        <div className="space-y-6">
                            
                            {/* --- GLOBAL METRICS GRID --- */}
                            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 sm:p-8">
                                <h2 className="text-2xl font-bold text-black tracking-tight mb-6">Platform Overview</h2>
                                
                                {isMetricsLoading ? (
                                    <div className="py-10"><Loader /></div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        
                                        {/* Total Clicks */}
                                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-3 text-gray-500 mb-2">
                                                <FaChartLine className="text-blue-500" />
                                                <span className="text-xs font-bold uppercase tracking-wider">Total Clicks</span>
                                            </div>
                                            <div className="text-3xl font-extrabold text-black">
                                                {metrics?.totalClicks?.toLocaleString()}
                                            </div>
                                        </div>

                                        {/* Total Links */}
                                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-3 text-gray-500 mb-2">
                                                <FaLink className="text-green-500" />
                                                <span className="text-xs font-bold uppercase tracking-wider">Active Links</span>
                                            </div>
                                            <div className="text-3xl font-extrabold text-black flex items-baseline gap-2">
                                                {metrics?.totalLinks?.toLocaleString()}
                                            </div>
                                            <div className="text-xs font-medium text-gray-400 mt-2">
                                                <span className="text-black font-bold">{metrics?.registeredLinks?.toLocaleString()}</span> Registered • <span className="text-black font-bold">{metrics?.guestLinks?.toLocaleString()}</span> Guest
                                            </div>
                                        </div>

                                        {/* Users */}
                                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-3 text-gray-500 mb-2">
                                                <FaUsers className="text-purple-500" />
                                                <span className="text-xs font-bold uppercase tracking-wider">Registered Users</span>
                                            </div>
                                            <div className="text-3xl font-extrabold text-black">
                                                {metrics?.totalUsers?.toLocaleString()}
                                            </div>
                                        </div>

                                        {/* Today's Growth */}
                                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-3 text-gray-500 mb-2">
                                                <FaCalendarDay className="text-orange-500" />
                                                <span className="text-xs font-bold uppercase tracking-wider">Links Today</span>
                                            </div>
                                            <div className="text-3xl font-extrabold text-black">
                                                +{metrics?.linksToday?.toLocaleString()}
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </div>

                            {/* --- MAINTENANCE SECTION --- */}
                            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 sm:p-8">
                                <h2 className="text-xl font-bold text-black tracking-tight mb-2">System Maintenance</h2>
                                <p className="text-sm text-gray-500 font-medium mb-8 max-w-2xl">
                                    Run manual sweeps to keep the database optimized and ensure user subscriptions are strictly enforced.
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* 1. Garbage Collection Box */}
                                    <div className="p-6 border border-red-100 bg-red-50 rounded-xl flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-red-800 font-bold mb-1">Garbage Collection</h3>
                                            <p className="text-red-600 text-sm mb-6 leading-relaxed">
                                                Permanently deletes URLs that have passed their expiration date, freeing up database storage.
                                            </p>
                                        </div>
                                        <button 
                                            onClick={handleCleanup}
                                            disabled={cleanupMutation.isLoading}
                                            className="bg-red-600 text-white shadow-lg shadow-red-200/50 px-6 py-3 rounded-lg font-bold text-sm hover:bg-red-700 transition-colors w-full"
                                        >
                                            {cleanupMutation.isLoading ? "Cleaning Database..." : "Run Link Cleanup"}
                                        </button>
                                    </div>

                                    {/* 2. Role Verification Box */}
                                    <div className="p-6 border border-purple-100 bg-purple-50 rounded-xl flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-purple-800 font-bold mb-1">Role Synchronization</h3>
                                            <p className="text-purple-600 text-sm mb-6 leading-relaxed">
                                                Scans all registered users. Anyone whose premium plan has passed its expiration date will be immediately demoted to Basic.
                                            </p>
                                        </div>
                                        <button 
                                            onClick={handleVerifyRoles}
                                            disabled={verifyRolesMutation.isLoading}
                                            className="bg-purple-600 text-white shadow-lg shadow-purple-200/50 px-6 py-3 rounded-lg font-bold text-sm hover:bg-purple-700 transition-colors w-full"
                                        >
                                            {verifyRolesMutation.isLoading ? "Verifying..." : "Verify Expired Plans"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;