import React, { useState } from 'react';
import ShortenItem from './ShortenItem';
import api from '../../api/axiosApi';
import { useStoreContext } from '../../contextApi/ContextApi';
import { FaTrash, FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa';
import ConfirmModal from '../../components/ConfirmModal';

const ShortenUrlList = ({ data, refetch, currentPage, setPage }) => {
    const { token } = useStoreContext();
    const [selectedIds, setSelectedIds] = useState([]);
    const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

    const urls = data?.content || [];
    const totalPages = data?.totalPages || 0;
    const isFirst = data?.first || false;
    const isLast = data?.last || false;

    const handleToggleSelect = (id) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
    const handleSelectAll = () => setSelectedIds(urls.map((item) => item.id));
    const handleDeselectAll = () => setSelectedIds([]);

    const handleBulkDelete = async () => {
        try {
            await api.delete('/api/urls/bulk', { headers: { Authorization: `Bearer ${token}` }, data: { ids: selectedIds } });
            setSelectedIds([]); 
            refetch();          
        } catch (error) {
            alert("Failed to delete URLs."); 
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 0; i < totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) pages.push(0, 1, 2, 3, 4, '...', totalPages - 1);
            else if (currentPage >= totalPages - 4) pages.push(0, '...', totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1);
            else pages.push(0, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages - 1);
        }
        return pages;
    };

  return (
    <div className='my-6 space-y-6'>
        
        {/* Solid Bulk Action Bar */}
        {selectedIds.length > 0 && (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm transition-all duration-300">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {selectedIds.length} item(s) selected
                </span>
                <div className="flex flex-wrap gap-3">
                    <button onClick={handleSelectAll} className="px-5 py-2.5 text-sm font-semibold border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl transition-all">
                        Select All
                    </button>
                    <button onClick={handleDeselectAll} className="px-5 py-2.5 text-sm font-semibold border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl transition-all">
                        Deselect All
                    </button>
                    <button onClick={() => setIsBulkDeleteModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-md active:scale-95">
                        <FaTrash /> Delete
                    </button>
                </div>
            </div>
        )}

        {/* URLs */}
        <div className="space-y-4">
            {urls.map((item) => (
                <ShortenItem key={item.id} {...item} isSelected={selectedIds.includes(item.id)} onToggleSelect={() => handleToggleSelect(item.id)} refetch={refetch} />
            ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-200 dark:border-slate-800 mt-10">
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Showing Page {currentPage + 1} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setPage(prev => Math.max(0, prev - 1))} disabled={isFirst}
                        className={`flex items-center justify-center p-2 sm:px-4 sm:py-2.5 text-sm font-semibold rounded-xl transition-all ${isFirst ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm active:scale-95'}`}
                    >
                        <FaChevronLeft className="text-xs sm:mr-2" /> <span className="hidden sm:inline">Previous</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                        {getPageNumbers().map((pageNumber, index) => (
                            pageNumber === '...' ? (
                                <span key={`ellipsis-${index}`} className="px-2 text-slate-400 dark:text-slate-500 font-semibold">...</span>
                            ) : (
                                <button
                                    key={pageNumber} onClick={() => setPage(pageNumber)}
                                    className={`w-10 h-10 flex items-center justify-center text-sm font-semibold rounded-xl transition-all ${currentPage === pageNumber ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95'}`}
                                >
                                    {pageNumber + 1}
                                </button>
                            )
                        ))}
                    </div>
                    
                    <button 
                        onClick={() => setPage(prev => prev + 1)} disabled={isLast}
                        className={`flex items-center justify-center p-2 sm:px-4 sm:py-2.5 text-sm font-semibold rounded-xl transition-all ${isLast ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm active:scale-95'}`}
                    >
                        <span className="hidden sm:inline">Next</span> <FaChevronRight className="text-xs sm:ml-2" />
                    </button>
                </div>
            </div>
        )}

        <ConfirmModal 
            isOpen={isBulkDeleteModalOpen} 
            onClose={() => setIsBulkDeleteModalOpen(false)} 
            onConfirm={handleBulkDelete} 
            title="Delete Multiple URLs" 
            message={`Permanently delete these ${selectedIds.length} URLs?`} 
            confirmText="Delete"
        />
    </div>
  )
}

export default ShortenUrlList;