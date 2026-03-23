import React, { useState } from 'react';
import { useStoreContext } from '../../contextApi/ContextApi';
import { FaUsers, FaLink, FaDatabase } from 'react-icons/fa';
import UsersTable from './UsersTable';
import LinksTable from './LinksTable';
import { useCleanupExpiredLinks } from '../../hooks/useAdminQuery';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
    const { token } = useStoreContext();
    const [activeTab, setActiveTab] = useState("users");
    const cleanupMutation = useCleanupExpiredLinks(token);

    const handleCleanup = () => {
        cleanupMutation.mutate(null, {
            onSuccess: (data) => toast.success(`Cleanup complete! Deleted ${data?.data?.deletedCount || 0} expired links.`),
            onError: () => toast.error("Cleanup failed.")
        });
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gray-100 flex flex-col pb-20">
            <div className="max-w-7xl w-full mx-auto px-6 lg:px-16 pt-12">
                
                {/* Admin Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-black tracking-tight mb-1 flex items-center gap-3">
                            <span className="text-3xl">🛡️</span> Super Admin
                        </h1>
                        <p className="text-sm font-medium text-gray-500 mt-2">
                            Manage users, inspect platform links, and run cleanup operations.
                        </p>
                    </div>
                </div>

                {/* Sleek Pill Tabs */}
                <div className="flex gap-3 mb-8 overflow-x-auto hide-scrollbar pb-2">
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap shadow-sm ${
                            activeTab === "users" 
                            ? "bg-black text-white shadow-gray-300/50" 
                            : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        <FaUsers /> User Management
                    </button>
                    <button
                        onClick={() => setActiveTab("links")}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap shadow-sm ${
                            activeTab === "links" 
                            ? "bg-black text-white shadow-gray-300/50" 
                            : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        <FaLink /> Platform Links
                    </button>
                    <button
                        onClick={() => setActiveTab("system")}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap shadow-sm ${
                            activeTab === "system" 
                            ? "bg-black text-white shadow-gray-300/50" 
                            : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        <FaDatabase /> System Tools
                    </button>
                </div>

                {/* Content Area */}
                <div className="w-full">
                    {activeTab === "users" && <UsersTable />}
                    
                    {activeTab === "links" && <LinksTable />}

                    {activeTab === "system" && (
                        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 sm:p-8 min-h-[400px]">
                            <h2 className="text-2xl font-bold text-black tracking-tight mb-2">System Maintenance</h2>
                            <p className="text-sm text-gray-500 font-medium mb-8 max-w-xl">
                                Force a manual database sweep to remove all URLs that have passed their expiration date. This frees up database storage.
                            </p>
                            
                            <div className="p-6 border border-red-100 bg-red-50 rounded-xl inline-block">
                                <h3 className="text-red-800 font-bold mb-1">Garbage Collection</h3>
                                <p className="text-red-600 text-sm mb-4">Permanently deletes expired records.</p>
                                <button 
                                    onClick={handleCleanup}
                                    disabled={cleanupMutation.isLoading}
                                    className="bg-red-600 text-white shadow-lg shadow-red-200/50 px-6 py-3 rounded-lg font-medium text-sm hover:bg-red-700 transition-colors"
                                >
                                    {cleanupMutation.isLoading ? "Cleaning Database..." : "Run Expired Link Cleanup"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;