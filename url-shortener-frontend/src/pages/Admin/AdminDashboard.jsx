import React, { useState } from 'react';
import { useStoreContext } from '../../contextApi/ContextApi';
import { FaUsers, FaLink, FaDatabase } from 'react-icons/fa';

const AdminDashboard = () => {
    const { token } = useStoreContext();
    const [activeTab, setActiveTab] = useState("users");

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex flex-col pb-20">
            <div className="max-w-7xl w-full mx-auto px-6 lg:px-16 pt-12">
                
                {/* Admin Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-black tracking-tight mb-2 flex items-center gap-3">
                        <span className="bg-blue-100 text-blue-600 p-2 rounded-xl text-xl">🛡️</span>
                        Super Admin Control Panel
                    </h1>
                    <p className="text-sm font-medium text-gray-500">
                        Manage users, inspect platform links, and run cleanup operations.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-8 overflow-x-auto hide-scrollbar">
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`flex items-center gap-2 py-4 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === "users" 
                            ? "border-blue-600 text-blue-600" 
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <FaUsers /> User Management
                    </button>
                    <button
                        onClick={() => setActiveTab("links")}
                        className={`flex items-center gap-2 py-4 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === "links" 
                            ? "border-blue-600 text-blue-600" 
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <FaLink /> Platform Links
                    </button>
                    <button
                        onClick={() => setActiveTab("system")}
                        className={`flex items-center gap-2 py-4 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === "system" 
                            ? "border-blue-600 text-blue-600" 
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <FaDatabase /> System Tools
                    </button>
                </div>

                {/* Content Area */}
                <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 sm:p-8 min-h-125">
                    {activeTab === "users" && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">Users Table Placeholder</h2>
                            <p className="text-gray-500 text-sm">We will build the paginated Users table here next.</p>
                        </div>
                    )}
                    
                    {activeTab === "links" && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">Platform Links Placeholder</h2>
                            <p className="text-gray-500 text-sm">We will build the date-range filters and global links table here.</p>
                        </div>
                    )}

                    {activeTab === "system" && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">System Tools</h2>
                            <button className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg font-medium text-sm hover:bg-red-100 transition-colors">
                                Run Expired Link Cleanup
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;