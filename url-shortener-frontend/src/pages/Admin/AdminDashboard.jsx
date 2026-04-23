import React, { useState } from 'react';
import { useStoreContext } from '../../contextApi/ContextApi';
import { FaUsers, FaLink, FaDatabase, FaChartLine, FaCalendarDay } from 'react-icons/fa';
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
        <div className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 flex flex-col pb-20 transition-colors duration-300">
            <div className="max-w-7xl w-full mx-auto px-6 lg:px-16 pt-12">
                
                {/* Admin Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 flex items-center gap-3">
                            Admin Panel
                        </h1>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Manage users, inspect platform links, and run cleanup operations.
                        </p>
                    </div>
                </div>

                {/* Sleek Pill Tabs */}
                <div className="flex gap-3 mb-10 overflow-x-auto hide-scrollbar pb-2">
                    <button onClick={() => setActiveTab("users")} className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 whitespace-nowrap shadow-sm active:scale-95 ${activeTab === "users" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                        <FaUsers /> User Management
                    </button>
                    <button onClick={() => setActiveTab("links")} className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 whitespace-nowrap shadow-sm active:scale-95 ${activeTab === "links" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                        <FaLink /> Platform Links
                    </button>
                    <button onClick={() => setActiveTab("system")} className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 whitespace-nowrap shadow-sm active:scale-95 ${activeTab === "system" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                        <FaDatabase /> System Tools
                    </button>
                </div>

                {/* Content Area */}
                <div className="w-full">
                    {activeTab === "users" && <UsersTable />}
                    {activeTab === "links" && <LinksTable />}

                    {activeTab === "system" && (
                        <div className="space-y-6 animate-fade-in">
                            
                            {/* --- GLOBAL METRICS GRID --- */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-[2rem] p-6 sm:p-8">
                                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">Platform Overview</h2>
                                
                                {isMetricsLoading ? (
                                    <div className="py-10"><Loader /></div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        
                                        {/* Total Clicks */}
                                        <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-[1.5rem] border border-slate-200 dark:border-slate-800">
                                            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 mb-3">
                                                <FaChartLine className="text-blue-500 dark:text-blue-400 text-lg" />
                                                <span className="text-xs font-semibold uppercase tracking-widest">Total Clicks</span>
                                            </div>
                                            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                                {metrics?.totalClicks?.toLocaleString()}
                                            </div>
                                        </div>

                                        {/* Total Links */}
                                        <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-[1.5rem] border border-slate-200 dark:border-slate-800">
                                            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 mb-3">
                                                <FaLink className="text-green-500 dark:text-green-400 text-lg" />
                                                <span className="text-xs font-semibold uppercase tracking-widest">Active Links</span>
                                            </div>
                                            <div className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-baseline gap-2">
                                                {metrics?.totalLinks?.toLocaleString()}
                                            </div>
                                            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">
                                                <span className="text-slate-900 dark:text-white font-semibold">{metrics?.registeredLinks?.toLocaleString()}</span> Registered • <span className="text-slate-900 dark:text-white font-semibold">{metrics?.guestLinks?.toLocaleString()}</span> Guest
                                            </div>
                                        </div>

                                        {/* Users */}
                                        <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-[1.5rem] border border-slate-200 dark:border-slate-800">
                                            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 mb-3">
                                                <FaUsers className="text-purple-500 dark:text-purple-400 text-lg" />
                                                <span className="text-xs font-semibold uppercase tracking-widest">Registered Users</span>
                                            </div>
                                            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                                {metrics?.totalUsers?.toLocaleString()}
                                            </div>
                                        </div>

                                        {/* Today's Growth */}
                                        <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-[1.5rem] border border-slate-200 dark:border-slate-800">
                                            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 mb-3">
                                                <FaCalendarDay className="text-orange-500 dark:text-orange-400 text-lg" />
                                                <span className="text-xs font-semibold uppercase tracking-widest">Links Today</span>
                                            </div>
                                            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                                +{metrics?.linksToday?.toLocaleString()}
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </div>

                            {/* --- MAINTENANCE SECTION --- */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-[2rem] p-6 sm:p-8">
                                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">System Maintenance</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8 max-w-2xl">
                                    Run manual sweeps to keep the database optimized and ensure user subscriptions are strictly enforced.
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* 1. Garbage Collection Box */}
                                    <div className="p-8 border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-[1.5rem] flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-red-800 dark:text-red-400 font-extrabold mb-2 text-lg">Garbage Collection</h3>
                                            <p className="text-red-600 dark:text-red-300/80 text-sm mb-8 font-medium leading-relaxed">
                                                Permanently deletes URLs that have passed their expiration date, freeing up database storage.
                                            </p>
                                        </div>
                                        <button 
                                            onClick={handleCleanup}
                                            disabled={cleanupMutation.isLoading}
                                            className="bg-red-600 text-white shadow-md shadow-red-500/20 px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors w-full active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                                        >
                                            {cleanupMutation.isLoading ? "Cleaning Database..." : "Run Link Cleanup"}
                                        </button>
                                    </div>

                                    {/* 2. Role Verification Box */}
                                    <div className="p-8 border border-purple-200 dark:border-purple-900/30 bg-purple-50 dark:bg-purple-900/10 rounded-[1.5rem] flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-purple-800 dark:text-purple-400 font-extrabold mb-2 text-lg">Role Synchronization</h3>
                                            <p className="text-purple-600 dark:text-purple-300/80 text-sm mb-8 font-medium leading-relaxed">
                                                Scans all registered users. Anyone whose premium plan has passed its expiration date will be immediately demoted to Basic.
                                            </p>
                                        </div>
                                        <button 
                                            onClick={handleVerifyRoles}
                                            disabled={verifyRolesMutation.isLoading}
                                            className="bg-purple-600 text-white shadow-md shadow-purple-500/20 px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-purple-700 transition-colors w-full active:scale-95 disabled:opacity-50 disabled:active:scale-100"
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