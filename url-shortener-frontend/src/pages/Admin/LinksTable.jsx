import React, { useState } from 'react';
import { useStoreContext } from '../../contextApi/ContextApi';
import { useFetchAllLinks, useBulkDeleteLinks, useClearLinkClicks } from '../../hooks/useAdminQuery';
import { FaTrash, FaChevronLeft, FaChevronRight, FaEraser } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';
import Loader from '../../components/Loader';
import ConfirmModal from '../../components/ConfirmModal'; 

const LinksTable = () => {
    const { token } = useStoreContext();
    const [page, setPage] = useState(0);
    const size = 10;
    const [selectedIds, setSelectedIds] = useState([]);

    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null, confirmText: 'Confirm', isDanger: true });

    const { data: linksData, isLoading } = useFetchAllLinks(token, page, size, () => toast.error("Failed to fetch links"));
    const bulkDeleteMutation = useBulkDeleteLinks(token);
    const clearClicksMutation = useClearLinkClicks(token);

    const links = linksData?.content || [];
    const totalPages = linksData?.totalPages || 0;
    const isFirst = linksData?.first || false;
    const isLast = linksData?.last || false;

    const openModal = (title, message, onConfirm, confirmText = "Delete") => {
        setModalConfig({ isOpen: true, title, message, onConfirm, confirmText, isDanger: true });
    };
    const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

    const handleToggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    const handleSelectAll = () => setSelectedIds(links.map(l => l.id));
    const handleDeselectAll = () => setSelectedIds([]);

    const handleBulkDelete = () => {
        openModal(
            "Delete Selected Links",
            `Are you sure you want to permanently delete these ${selectedIds.length} links? This action cannot be undone.`,
            () => {
                bulkDeleteMutation.mutate(selectedIds, {
                    onSuccess: () => { toast.success("Links deleted"); setSelectedIds([]); }
                });
            },
            "Delete Links"
        );
    };

    const handleClearClicks = (linkId, shortUrl) => {
        openModal(
            "Clear Analytics",
            `Wipe all click tracking data for the short link '/s/${shortUrl}'? This will reset the click count to 0.`,
            () => clearClicksMutation.mutate(linkId, { onSuccess: () => toast.success("Analytics cleared") }),
            "Clear Analytics"
        );
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
                    {selectedIds.length} Link(s) Selected
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
                                <th className="px-6 py-5">Owner</th>
                                <th className="px-6 py-5">Short URL</th>
                                <th className="px-6 py-5">Original</th>
                                <th className="px-6 py-5 text-center">Clicks</th>
                                <th className="px-6 py-5">Expires</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {links.map((link) => (
                                <tr key={link.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-5 text-center whitespace-nowrap">
                                        <input 
                                            type="checkbox" checked={selectedIds.includes(link.id)} onChange={() => handleToggleSelect(link.id)}
                                            className="w-5 h-5 text-slate-900 bg-white border-slate-300 dark:bg-slate-950 dark:border-slate-700 rounded focus:ring-slate-900 dark:focus:ring-white cursor-pointer accent-slate-900 dark:accent-white transition-all"
                                        />
                                    </td>
                                    <td className="px-6 py-5 text-sm font-semibold text-slate-900 dark:text-slate-200 whitespace-nowrap">{link.username}</td>
                                    <td className="px-6 py-5 text-sm font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">{link.shortUrl}</td>
                                    <td className="px-6 py-5 text-sm font-medium text-slate-500 dark:text-slate-400 truncate max-w-[250px]" title={link.originalUrl}>{link.originalUrl}</td>
                                    <td className="px-6 py-5 text-sm text-center font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                        <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">{link.clickCount}</span>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                        {link.expiresAt ? dayjs(link.expiresAt).format("MMM DD, YYYY") : "Never"}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap flex justify-end">
                                        <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleClearClicks(link.id, link.shortUrl)}
                                                className="flex items-center gap-1.5 px-4 py-2.5 bg-orange-50 dark:bg-orange-500/10 hover:bg-orange-100 dark:hover:bg-orange-500/20 border border-orange-200 dark:border-orange-500/20 text-orange-600 dark:text-orange-400 rounded-xl transition-colors text-xs font-semibold shadow-sm active:scale-95"
                                                title="Wipe Analytics for this link"
                                            >
                                                <FaEraser className="text-sm" /> Clear Analytics
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

            <ConfirmModal 
                isOpen={modalConfig.isOpen} onClose={closeModal} onConfirm={modalConfig.onConfirm}
                title={modalConfig.title} message={modalConfig.message} confirmText={modalConfig.confirmText} isDanger={modalConfig.isDanger}
            />
        </div>
    );
};

export default LinksTable;