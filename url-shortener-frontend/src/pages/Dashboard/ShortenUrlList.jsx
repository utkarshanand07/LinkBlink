import React, { useState } from 'react';
import ShortenItem from './ShortenItem';
import api from '../../api/axiosApi';
import { useStoreContext } from '../../contextApi/ContextApi';
import { FaTrash } from 'react-icons/fa';
import ConfirmModal from './ConfirmModal'; // Adjust path if needed

const ShortenUrlList = ({ data, refetch }) => {
    const { token } = useStoreContext();
    const [selectedIds, setSelectedIds] = useState([]);
    const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

    const handleToggleSelect = (id) => {
        setSelectedIds((prev) => 
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        setSelectedIds(data.map((item) => item.id));
    };

    const handleDeselectAll = () => {
        setSelectedIds([]);
    };

    const handleBulkDelete = async () => {
        try {
            await api.delete('/api/urls/bulk', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: { ids: selectedIds } 
            });
            setSelectedIds([]); // Clear selection
            refetch();          // Refresh the list
        } catch (error) {
            console.error("Error bulk deleting URLs:", error);
            alert("Failed to delete URLs."); // You could also replace this with a custom toast notification later
        }
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
        {data.map((item) => (
            <ShortenItem 
                key={item.id} 
                {...item} 
                isSelected={selectedIds.includes(item.id)}
                onToggleSelect={() => handleToggleSelect(item.id)}
                refetch={refetch}
            />
        ))}

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