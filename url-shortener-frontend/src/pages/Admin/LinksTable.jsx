import React, { useState } from 'react';
import { useStoreContext } from '../../contextApi/ContextApi';
import { useFetchAllLinks, useBulkDeleteLinks, useClearLinkClicks } from '../../hooks/useAdminQuery';
import { FaTrash, FaChevronLeft, FaChevronRight, FaEraser } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';
import Loader from '../../components/Loader';

const LinksTable = () => {
    const { token } = useStoreContext();
    const [page, setPage] = useState(0);
    const size = 10;
    const [selectedIds, setSelectedIds] = useState([]);

    const { data: linksData, isLoading } = useFetchAllLinks(token, page, size, () => toast.error("Failed to fetch links"));
    const bulkDeleteMutation = useBulkDeleteLinks(token);
    const clearClicksMutation = useClearLinkClicks(token);

    const links = linksData?.content || [];
    const totalPages = linksData?.totalPages || 0;
    const isFirst = linksData?.first || false;
    const isLast = linksData?.last || false;

    const handleToggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    const handleSelectAll = () => setSelectedIds(links.map(l => l.id));
    const handleDeselectAll = () => setSelectedIds([]);

    const handleBulkDelete = () => {
        if (window.confirm(`Delete ${selectedIds.length} selected links permanently?`)) {
            bulkDeleteMutation.mutate(selectedIds, {
                onSuccess: () => { toast.success("Links deleted"); setSelectedIds([]); }
            });
        }
    };

    const handleClearClicks = (linkId) => {
        if (window.confirm("Wipe all click history for this link? This resets the count to 0.")) {
            clearClicksMutation.mutate(linkId, { onSuccess: () => toast.success("Analytics cleared") });
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
                    {selectedIds.length} Link(s) Selected
                </span>
                <div className="flex flex-wrap gap-3">
                    <button onClick={handleSelectAll} className="px-5 py-2.5 text-sm font-semibold border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-xl transition-colors shadow-sm">Select All</button>
                    <button onClick={handleDeselectAll} className="px-5 py-2.5 text-sm font-semibold border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-xl transition-colors shadow-sm">Deselect All</button>
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
                                <th className="px-6 py-5 font-bold">Owner</th>
                                <th className="px-6 py-5 font-bold">Short URL</th>
                                <th className="px-6 py-5 font-bold">Original</th>
                                <th className="px-6 py-5 font-bold text-center">Clicks</th>
                                <th className="px-6 py-5 font-bold">Expires</th>
                                <th className="px-6 py-5 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {links.map((link) => (
                                <tr key={link.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="px-6 py-5 text-center whitespace-nowrap">
                                        <input 
                                            type="checkbox" checked={selectedIds.includes(link.id)} onChange={() => handleToggleSelect(link.id)}
                                            className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black cursor-pointer accent-black"
                                        />
                                    </td>
                                    <td className="px-6 py-5 text-sm font-bold text-gray-900 whitespace-nowrap">{link.username}</td>
                                    <td className="px-6 py-5 text-sm font-bold text-blue-600 whitespace-nowrap">{link.shortUrl}</td>
                                    <td className="px-6 py-5 text-sm font-medium text-gray-500 truncate max-w-[250px]" title={link.originalUrl}>{link.originalUrl}</td>
                                    <td className="px-6 py-5 text-sm text-center font-bold text-gray-700 whitespace-nowrap">
                                        <span className="bg-gray-100 px-3 py-1 rounded-lg">{link.clickCount}</span>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-medium text-gray-500 whitespace-nowrap">
                                        {link.expiresAt ? dayjs(link.expiresAt).format("MMM DD, YYYY") : "Never"}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex justify-end opacity-80 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleClearClicks(link.id)}
                                                className="flex items-center gap-1.5 px-3 py-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-600 rounded-lg transition-colors text-xs font-bold shadow-sm"
                                                title="Wipe Analytics"
                                            >
                                                <FaEraser className="text-sm" /> Wipe Clicks
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

export default LinksTable;