import React, { useState } from 'react';
import { useStoreContext } from '../../contextApi/ContextApi';
import { 
    useFetchAllUsers, 
    useChangeUserRole, 
    useBulkDeleteUsers,
    useClearUserLinks,
    useClearUserClicks
} from '../../hooks/useAdminQuery';
import { FaTrash, FaChevronLeft, FaChevronRight, FaLink, FaEraser } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Loader from '../../components/Loader';

const UsersTable = () => {
    const { token } = useStoreContext();
    const [page, setPage] = useState(0);
    const size = 10;
    const [selectedIds, setSelectedIds] = useState([]);

    const { data: usersData, isLoading } = useFetchAllUsers(token, page, size, () => toast.error("Failed to fetch users"));
    const changeRoleMutation = useChangeUserRole(token);
    const bulkDeleteMutation = useBulkDeleteUsers(token);
    const clearLinksMutation = useClearUserLinks(token);
    const clearClicksMutation = useClearUserClicks(token);

    const users = usersData?.content || [];
    const totalPages = usersData?.totalPages || 0;
    const isFirst = usersData?.first || false;
    const isLast = usersData?.last || false;

    const handleToggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    const handleSelectAll = () => setSelectedIds(users.map(u => u.id));
    const handleDeselectAll = () => setSelectedIds([]);

    const handleRoleChange = (userId, newRole) => {
        changeRoleMutation.mutate({ userId, newRole }, {
            onSuccess: () => toast.success("Role updated successfully"),
            onError: (error) => toast.error(error.response?.data?.error || "Failed to update role")
        });
    };

    const handleBulkDelete = () => {
        if (window.confirm(`Are you sure you want to permanently delete ${selectedIds.length} users AND all their links?`)) {
            bulkDeleteMutation.mutate(selectedIds, {
                onSuccess: () => { toast.success("Users deleted"); setSelectedIds([]); }
            });
        }
    };

    const handleClearLinks = (userId, username) => {
        if (window.confirm(`Permanently delete ALL links created by ${username}?`)) {
            clearLinksMutation.mutate(userId, { onSuccess: () => toast.success(`Links for ${username} deleted.`) });
        }
    };

    const handleClearClicks = (userId, username) => {
        if (window.confirm(`Wipe all click analytics for ALL links owned by ${username}?`)) {
            clearClicksMutation.mutate(userId, { onSuccess: () => toast.success(`Analytics wiped for ${username}.`) });
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 0; i < totalPages; i++) pages.push(i);
        } else {
            if (page <= 3) pages.push(0, 1, 2, 3, 4, '...', totalPages - 1);
            else if (page >= totalPages - 4) pages.push(0, '...', totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1);
            else pages.push(0, '...', page - 1, page, page + 1, '...', totalPages - 1);
        }
        return pages;
    };

    if (isLoading) return <div className="py-20"><Loader /></div>;

    return (
        <div className="space-y-6">
            
            {/* Action Bar */}
            <div className={`bg-white px-6 py-5 rounded-2xl border border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm transition-all duration-300 ${selectedIds.length > 0 ? 'opacity-100 ring-1 ring-gray-200' : 'opacity-60'}`}>
                <span className="text-sm font-bold text-gray-800">
                    {selectedIds.length} User(s) Selected
                </span>
                <div className="flex flex-wrap gap-3">
                    <button onClick={handleSelectAll} className="px-5 py-2.5 text-sm font-semibold border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-xl transition-colors shadow-sm">Select All</button>
                    <button onClick={handleDeselectAll} className="px-5 py-2.5 text-sm font-semibold border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-xl transition-colors shadow-sm">Deselect</button>
                    <button 
                        onClick={handleBulkDelete} disabled={selectedIds.length === 0}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-md shadow-red-200/50 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
                    >
                        <FaTrash /> Delete Selected
                    </button>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest border-b border-gray-200">
                                <th className="px-6 py-5 w-12 text-center"></th>
                                <th className="px-6 py-5 font-bold">ID</th>
                                <th className="px-6 py-5 font-bold">Username</th>
                                <th className="px-6 py-5 font-bold">Email</th>
                                <th className="px-6 py-5 font-bold">Tier / Role</th>
                                <th className="px-6 py-5 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="px-6 py-5 text-center whitespace-nowrap">
                                        <input 
                                            type="checkbox" checked={selectedIds.includes(user.id)} onChange={() => handleToggleSelect(user.id)}
                                            className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black cursor-pointer accent-black"
                                        />
                                    </td>
                                    <td className="px-6 py-5 text-sm font-medium text-gray-400 whitespace-nowrap">#{user.id}</td>
                                    <td className="px-6 py-5 text-sm font-bold text-gray-900 whitespace-nowrap">{user.username}</td>
                                    <td className="px-6 py-5 text-sm font-medium text-gray-500 whitespace-nowrap">{user.email}</td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <select 
                                            value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className="text-sm font-semibold border border-gray-200 rounded-xl px-4 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:border-black focus:ring-1 focus:ring-black cursor-pointer shadow-sm hover:bg-white transition-colors"
                                        >
                                            <option value="ROLE_BASIC">Basic</option>
                                            <option value="ROLE_PRO">Pro</option>
                                            <option value="ROLE_ENTERPRISE">Enterprise</option>
                                            <option value="ROLE_ADMIN">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleClearClicks(user.id, user.username)}
                                                className="flex items-center gap-1.5 px-3 py-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-600 rounded-lg transition-colors text-xs font-bold shadow-sm"
                                                title="Wipe Analytics for all links"
                                            >
                                                <FaEraser className="text-sm" /> Wipe Data
                                            </button>
                                            <button 
                                                onClick={() => handleClearLinks(user.id, user.username)}
                                                className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg transition-colors text-xs font-bold shadow-sm"
                                                title="Delete all links"
                                            >
                                                <FaLink className="text-sm" /> Clear Links
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Smart Pagination */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-6 bg-white border-t border-gray-100">
                        <span className="text-sm text-gray-500 font-medium">Showing Page {page + 1} of {totalPages}</span>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={isFirst} className={`flex items-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors ${isFirst ? 'bg-gray-50 text-gray-400 cursor-not-allowed border border-transparent' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm'}`}>
                                <FaChevronLeft className="text-xs mr-2" /> Previous
                            </button>
                            <div className="flex items-center gap-1 hidden sm:flex">
                                {getPageNumbers().map((num, i) => num === '...' ? <span key={`ell-${i}`} className="px-2 text-gray-400">...</span> : (
                                    <button key={num} onClick={() => setPage(num)} className={`w-10 h-10 flex items-center justify-center text-sm font-bold rounded-xl transition-colors ${page === num ? 'bg-black text-white shadow-md' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm'}`}>
                                        {num + 1}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setPage(p => p + 1)} disabled={isLast} className={`flex items-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors ${isLast ? 'bg-gray-50 text-gray-400 cursor-not-allowed border border-transparent' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm'}`}>
                                Next <FaChevronRight className="text-xs ml-2" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersTable;