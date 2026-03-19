import React, { useState } from 'react';
import ShortenItem from './ShortenItem';
import api from '../../api/axiosApi';
import { useStoreContext } from '../../contextApi/ContextApi';
import { FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ConfirmModal from './ConfirmModal';

const ShortenUrlList = ({ data, refetch, currentPage, setPage }) => {
    const { token } = useStoreContext();
    const [selectedIds, setSelectedIds] = useState([]);
    const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

    // Extract Spring Boot Page data
    const urls = data?.content || [];
    const totalPages = data?.totalPages || 0;
    const isFirst = data?.first || false;
    const isLast = data?.last || false;

    const handleToggleSelect = (id) => {
        setSelectedIds((prev) => 
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        setSelectedIds(urls.map((item) => item.id));
    };

    const handleDeselectAll = () => {
        setSelectedIds([]);
    };

    const handleBulkDelete = async () => {
        try {
            await api.delete('/api/urls/bulk', {
                headers: { Authorization: `Bearer ${token}` },
                data: { ids: selectedIds } 
            });
            setSelectedIds([]); 
            refetch();          
        } catch (error) {
            console.error("Error bulk deleting URLs:", error);
            alert("Failed to delete URLs."); 
        }
    };

    // --- NEW: Helper function to generate smart page numbers with ellipsis ---
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            // If 7 or fewer pages, show them all
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Complex pagination with ellipsis
            if (currentPage <= 3) {
                // Near the start: 1, 2, 3, 4, 5, ..., Last
                pages.push(0, 1, 2, 3, 4, '...', totalPages - 1);
            } else if (currentPage >= totalPages - 4) {
                // Near the end: 1, ..., Last-4, Last-3, Last-2, Last-1, Last
                pages.push(0, '...', totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1);
            } else {
                // In the middle: 1, ..., Current-1, Current, Current+1, ..., Last
                pages.push(0, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages - 1);
            }
        }
        return pages;
    };

  return (
    <div className='my-6 space-y-4'>
        
        {/* Conditional Action Bar */}
        {selectedIds.length > 0 && (
            <div className="bg-white p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm transition-all duration-300">
                <span className="text-sm font-bold text-gray-700">
                    {selectedIds.length} item(s) selected
                </span>
                <div className="flex flex-wrap gap-3">
                    <button 
                        onClick={handleSelectAll} 
                        className="px-4 py-2 text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 text-black rounded-lg transition-colors"
                    >
                        Select All
                    </button>
                    <button 
                        onClick={handleDeselectAll} 
                        className="px-4 py-2 text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 text-black rounded-lg transition-colors"
                    >
                        Deselect All
                    </button>
                    <button 
                        onClick={() => setIsBulkDeleteModalOpen(true)} 
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-200/50"
                    >
                        <FaTrash /> Delete Selected
                    </button>
                </div>
            </div>
        )}

        {/* List of URLs */}
        {urls.map((item) => (
            <ShortenItem 
                key={item.id} 
                {...item} 
                isSelected={selectedIds.includes(item.id)}
                onToggleSelect={() => handleToggleSelect(item.id)}
                refetch={refetch}
            />
        ))}

        {/* UPDATED: Smart Pagination Controls */}
        {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 pb-2 border-t border-gray-200 mt-8">
                <span className="text-sm text-gray-500 font-medium">
                    Showing Page {currentPage + 1} of {totalPages}
                </span>
                
                <div className="flex items-center gap-1 sm:gap-2">
                    {/* Previous Button */}
                    <button 
                        onClick={() => setPage(prev => Math.max(0, prev - 1))}
                        disabled={isFirst}
                        className={`flex items-center justify-center p-2 sm:px-4 sm:py-2 text-sm font-medium rounded-lg transition-colors ${
                            isFirst 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white border border-gray-300 text-black hover:bg-gray-50'
                        }`}
                        title="Previous Page"
                    >
                        <FaChevronLeft className="text-xs sm:mr-2" /> 
                        <span className="hidden sm:inline">Previous</span>
                    </button>

                    {/* Numbered Page Buttons */}
                    <div className="flex items-center gap-1">
                        {getPageNumbers().map((pageNumber, index) => (
                            pageNumber === '...' ? (
                                <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
                            ) : (
                                <button
                                    key={pageNumber}
                                    onClick={() => setPage(pageNumber)}
                                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${
                                        currentPage === pageNumber
                                        ? 'bg-black text-white' 
                                        : 'bg-white border border-gray-300 text-black hover:bg-gray-50'
                                    }`}
                                >
                                    {pageNumber + 1}
                                </button>
                            )
                        ))}
                    </div>
                    
                    {/* Next Button */}
                    <button 
                        onClick={() => setPage(prev => prev + 1)}
                        disabled={isLast}
                        className={`flex items-center justify-center p-2 sm:px-4 sm:py-2 text-sm font-medium rounded-lg transition-colors ${
                            isLast 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white border border-gray-300 text-black hover:bg-gray-50'
                        }`}
                        title="Next Page"
                    >
                        <span className="hidden sm:inline">Next</span> 
                        <FaChevronRight className="text-xs sm:ml-2" />
                    </button>
                </div>
            </div>
        )}

        {/* Bulk Delete Confirmation Modal */}
        <ConfirmModal 
            isOpen={isBulkDeleteModalOpen}
            onClose={() => setIsBulkDeleteModalOpen(false)}
            onConfirm={handleBulkDelete}
            title="Delete Multiple URLs"
            message={`Are you sure you want to permanently delete these ${selectedIds.length} selected URLs? This action cannot be undone.`}
        />
    </div>
  )
}

export default ShortenUrlList;