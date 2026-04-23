import React, { useState } from 'react';
import { useStoreContext } from '../../contextApi/ContextApi';
import { useFetchAllUsers, useChangeUserRole, useBulkDeleteUsers, useClearUserLinks, useClearUserClicks } from '../../hooks/useAdminQuery';
import { FaTrash, FaChevronLeft, FaChevronRight, FaLink, FaEraser } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';
import Loader from '../../components/Loader';
import ConfirmModal from '../../components/ConfirmModal';
import RoleDurationModal from '../../components/RoleDurationModal';

const UsersTable = () => {
    const { token } = useStoreContext();
    const [page, setPage] = useState(0);
    const size = 10;
    const [selectedIds, setSelectedIds] = useState([]);

    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null, confirmText: 'Confirm', isDanger: true });
    const [durationConfig, setDurationConfig] = useState({ isOpen: false, userId: null, newRole: '', username: '' });

    const { data: usersData, isLoading } = useFetchAllUsers(token, page, size, () => toast.error("Failed to fetch users"));
    const changeRoleMutation = useChangeUserRole(token);
    const bulkDeleteMutation = useBulkDeleteUsers(token);
    const clearLinksMutation = useClearUserLinks(token);
    const clearClicksMutation = useClearUserClicks(token);

    const users = usersData?.content || [];
    const totalPages = usersData?.totalPages || 0;
    const isFirst = usersData?.first || false;
    const isLast = usersData?.last || false;

    const openModal = (title, message, onConfirm, confirmText = "Delete", isDanger = true) => setModalConfig({ isOpen: true, title, message, onConfirm, confirmText, isDanger });
    const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

    const handleToggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    const handleSelectAll = () => setSelectedIds(users.map(u => u.id));
    const handleDeselectAll = () => setSelectedIds([]);

    const handleRoleChange = (userId, newRole, currentRole, username) => {
        if (newRole === "ROLE_BASIC" || newRole === "ROLE_ADMIN") {
            openModal(
                "Change User Role",
                `Change ${username}'s role from ${currentRole} to ${newRole} permanently?`,
                () => {
                    changeRoleMutation.mutate({ userId, newRole, durationDays: null }, {
                        onSuccess: () => toast.success("Role updated successfully"),
                        onError: (error) => toast.error(error.response?.data?.error || "Failed to update role")
                    });
                },
                "Update Role",
                false 
            );
        } else {
            setDurationConfig({ isOpen: true, userId, newRole, username });
        }
    };

    const handleDurationConfirm = (durationDays) => {
        changeRoleMutation.mutate({ userId: durationConfig.userId, newRole: durationConfig.newRole, durationDays }, {
            onSuccess: () => toast.success(`Subscription upgraded for ${durationDays ? durationDays + " days" : "Lifetime"}`),
            onError: (error) => toast.error(error.response?.data?.error || "Failed to update role")
        });
    };

    const handleBulkDelete = () => {
        openModal("Delete Multiple Users", `Are you sure you want to permanently delete ${selectedIds.length} users AND all of their associated links and analytics?`, () => {
            bulkDeleteMutation.mutate(selectedIds, { onSuccess: () => { toast.success("Users deleted"); setSelectedIds([]); }});
        }, "Delete Users");
    };

    const handleClearLinks = (userId, username) => {
        openModal("Delete All Links", `Permanently delete ALL short links created by ${username}? This will also wipe analytics.`, () => {
            clearLinksMutation.mutate(userId, { onSuccess: () => toast.success(`Links for ${username} deleted.`) });
        }, "Delete Links");
    };

    const handleClearClicks = (userId, username) => {
        openModal("Clear All Analytics", `Wipe all click tracking data for ALL links owned by ${username}?`, () => {
            clearClicksMutation.mutate(userId, { onSuccess: () => toast.success(`Analytics wiped for ${username}.`) });
        }, "Clear Analytics");
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
        <div className="space-y-6 animate-fade-in">
            
            {/* Action Bar */}
            <div className={`bg-white dark:bg-slate-900 px-6 py-5 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm transition-all duration-300 ${selectedIds.length > 0 ? 'opacity-100 ring-1 ring-slate-200 dark:ring-slate-700' : 'opacity-60'}`}>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {selectedIds.length} User(s) Selected
                </span>
                <div className="flex flex-wrap gap-3">
                    <button onClick={handleSelectAll} className="px-5 py-2.5 text-sm font-semibold border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors active:scale-95">Select All</button>
                    <button onClick={handleDeselectAll} className="px-5 py-2.5 text-sm font-semibold border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors active:scale-95">Deselect All</button>
                    <button 
                        onClick={handleBulkDelete} disabled={selectedIds.length === 0}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-md shadow-red-500/20 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed active:scale-95"
                    >
                        <FaTrash /> Delete Selected
                    </button>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-[2rem] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-5 w-12 text-center"></th>
                                <th className="px-6 py-5">ID</th>
                                <th className="px-6 py-5">Username</th>
                                <th className="px-6 py-5">Email</th>
                                <th className="px-6 py-5">Tier / Role</th>
                                <th className="px-6 py-5">Plan Expiry</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-5 text-center whitespace-nowrap">
                                        <input 
                                            type="checkbox" checked={selectedIds.includes(user.id)} onChange={() => handleToggleSelect(user.id)}
                                            className="w-5 h-5 text-slate-900 bg-white border-slate-300 dark:bg-slate-950 dark:border-slate-700 rounded focus:ring-slate-900 dark:focus:ring-white cursor-pointer accent-slate-900 dark:accent-white transition-all"
                                        />
                                    </td>
                                    <td className="px-6 py-5 text-sm font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap">#{user.id}</td>
                                    <td className="px-6 py-5 text-sm font-semibold text-slate-900 dark:text-slate-200 whitespace-nowrap">{user.username}</td>
                                    <td className="px-6 py-5 text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">{user.email}</td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <select 
                                            value={user.role} 
                                            onChange={(e) => handleRoleChange(user.id, e.target.value, user.role, user.username)}
                                            className="text-sm font-semibold border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-100 cursor-pointer shadow-sm hover:bg-white dark:hover:bg-slate-900 transition-colors"
                                        >
                                            <option value="ROLE_BASIC">Basic</option>
                                            <option value="ROLE_PRO">Pro</option>
                                            <option value="ROLE_ENTERPRISE">Enterprise</option>
                                            <option value="ROLE_ADMIN">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        {user.role === "ROLE_BASIC" || user.role === "ROLE_ADMIN" ? (
                                            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Lifetime</span>
                                        ) : user.tierExpiresAt ? (
                                            <span className={`text-sm font-semibold ${dayjs().isAfter(dayjs(user.tierExpiresAt)) ? 'text-red-500 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {dayjs(user.tierExpiresAt).format("MMM DD, YYYY")}
                                            </span>
                                        ) : (
                                            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Lifetime</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleClearClicks(user.id, user.username)}
                                                className="flex items-center gap-1.5 px-4 py-2.5 bg-orange-50 dark:bg-orange-500/10 hover:bg-orange-100 dark:hover:bg-orange-500/20 border border-orange-200 dark:border-orange-500/20 text-orange-600 dark:text-orange-400 rounded-xl transition-colors text-xs font-semibold shadow-sm active:scale-95"
                                                title="Reset click counts and wipe analytics history"
                                            >
                                                <FaEraser className="text-sm" /> Clear Analytics
                                            </button>
                                            <button 
                                                onClick={() => handleClearLinks(user.id, user.username)}
                                                className="flex items-center gap-1.5 px-4 py-2.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-colors text-xs font-semibold shadow-sm active:scale-95"
                                                title="Permanently delete all links"
                                            >
                                                <FaTrash className="text-sm" /> Delete Links
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
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Showing Page {page + 1} of {totalPages}</span>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={isFirst} className={`flex items-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors ${isFirst ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-transparent' : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm active:scale-95'}`}>
                                <FaChevronLeft className="text-xs mr-2" /> Previous
                            </button>
                            <div className="flex items-center gap-1 hidden sm:flex">
                                {getPageNumbers().map((num, i) => num === '...' ? <span key={`ell-${i}`} className="px-2 text-slate-400 dark:text-slate-600 font-semibold">...</span> : (
                                    <button key={num} onClick={() => setPage(num)} className={`w-10 h-10 flex items-center justify-center text-sm font-semibold rounded-xl transition-colors ${page === num ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm active:scale-95'}`}>
                                        {num + 1}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setPage(p => p + 1)} disabled={isLast} className={`flex items-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors ${isLast ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-transparent' : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm active:scale-95'}`}>
                                Next <FaChevronRight className="text-xs ml-2" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmModal isOpen={modalConfig.isOpen} onClose={closeModal} onConfirm={modalConfig.onConfirm} title={modalConfig.title} message={modalConfig.message} confirmText={modalConfig.confirmText} isDanger={modalConfig.isDanger} />
            <RoleDurationModal isOpen={durationConfig.isOpen} onClose={() => setDurationConfig({ ...durationConfig, isOpen: false })} onConfirm={handleDurationConfirm} username={durationConfig.username} newRole={durationConfig.newRole} />
        </div>
    );
};

export default UsersTable;