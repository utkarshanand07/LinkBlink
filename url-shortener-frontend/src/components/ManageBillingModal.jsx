import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { FaCrown, FaExclamationTriangle } from 'react-icons/fa';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useCancelSubscription } from '../hooks/useQuery';
import { useStoreContext } from '../contextApi/ContextApi';
import { toast } from 'react-hot-toast';

const ManageBillingModal = ({ isOpen, onClose, userProfile }) => {
    const { token } = useStoreContext();
    const navigate = useNavigate();
    const [confirmCancel, setConfirmCancel] = useState(false);

    const cancelMutation = useCancelSubscription(token);

    if (!isOpen || !userProfile) return null;

    const displayRole = userProfile.role.replace('ROLE_', '');
    const isBasic = displayRole === 'BASIC';

    const handleCancel = () => {
        cancelMutation.mutate(null, {
            onSuccess: () => {
                toast.success("Subscription cancelled. You will not be billed again.");
                setConfirmCancel(false);
                onClose();
            },
            onError: () => toast.error("Failed to cancel subscription. Please contact support.")
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl transform transition-all relative">
                
                <button 
                    onClick={() => { setConfirmCancel(false); onClose(); }} 
                    className="absolute top-5 right-5 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                    <RxCross2 className="text-xl" />
                </button>

                <h2 className="text-2xl font-extrabold text-black tracking-tight mb-6">Manage Plan</h2>

                {/* Current Plan Card */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2.5 rounded-xl ${isBasic ? 'bg-gray-200 text-gray-500' : 'bg-yellow-100 text-yellow-600'}`}>
                            <FaCrown className="text-xl" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-0.5">Current Plan</span>
                            <span className="text-lg font-extrabold text-black">{displayRole}</span>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">Status</span>
                        <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                            Active
                        </span>
                    </div>
                    
                    {!isBasic && displayRole !== 'ADMIN' && (
                        <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-500">Renews / Expires on</span>
                            <span className="text-sm font-bold text-black">
                                {userProfile.tierExpiresAt ? dayjs(userProfile.tierExpiresAt).format("MMM DD, YYYY") : "Lifetime"}
                            </span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                {!confirmCancel ? (
                    <div className="space-y-3">
                        <button
                            onClick={() => { onClose(); navigate("/pricing"); }}
                            className="w-full py-3.5 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-md"
                        >
                            {isBasic ? "Upgrade Plan" : "Extend / Upgrade Plan"}
                        </button>
                        
                        {!isBasic && displayRole !== 'ADMIN' && (
                            <button
                                onClick={() => setConfirmCancel(true)}
                                className="w-full py-3.5 bg-white border border-gray-200 text-red-600 font-bold rounded-xl hover:bg-red-50 hover:border-red-100 transition-colors"
                            >
                                Cancel Subscription
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="p-5 bg-red-50 border border-red-100 rounded-2xl animate-fade-in">
                        <div className="flex items-center gap-2 mb-3 text-red-600">
                            <FaExclamationTriangle />
                            <span className="font-bold">Are you sure?</span>
                        </div>
                        <p className="text-sm text-red-800 mb-5">
                            If you cancel, you will keep your {displayRole} features until the end of your current billing period. After that, your account will be downgraded to Basic.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmCancel(false)}
                                className="flex-1 py-2.5 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={cancelMutation.isLoading}
                                className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl shadow-md hover:bg-red-700 disabled:opacity-70"
                            >
                                {cancelMutation.isLoading ? "Canceling..." : "Yes, Cancel"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageBillingModal;