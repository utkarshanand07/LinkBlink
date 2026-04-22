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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 w-full max-w-md shadow-premium dark:shadow-glass-dark border border-slate-200 dark:border-slate-700 transform transition-all relative animate-fade-in">
                
                <button 
                    onClick={() => { setConfirmCancel(false); onClose(); }} 
                    className="absolute top-6 right-6 p-2.5 text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors z-10"
                >
                    <RxCross2 className="text-xl" />
                </button>

                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">Manage Plan</h2>

                {/* Current Plan Card */}
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] p-6 mb-8">
                    <div className="flex items-center gap-4 mb-5">
                        <div className={`p-3 rounded-xl ${isBasic ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400' : 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'}`}>
                            <FaCrown className="text-xl" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Current Plan</span>
                            <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{displayRole}</span>
                        </div>
                    </div>
                    
                    <div className="border-t border-slate-200 dark:border-slate-800 pt-5 flex justify-between items-center">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Status</span>
                        <span className="text-xs font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-500/20 uppercase tracking-wider">
                            Active
                        </span>
                    </div>
                    
                    {!isBasic && displayRole !== 'ADMIN' && (
                        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-4 flex justify-between items-center">
                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Renews / Expires on</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
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
                            className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-md active:scale-95"
                        >
                            {isBasic ? "Upgrade Plan" : "Upgrade Plan"}
                        </button>
                        
                        {!isBasic && displayRole !== 'ADMIN' && (
                            <button
                                onClick={() => setConfirmCancel(true)}
                                className="w-full py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-red-600 dark:text-red-400 font-semibold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-200 dark:hover:border-red-900/30 transition-colors active:scale-95"
                            >
                                Cancel Subscription
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl animate-fade-in">
                        <div className="flex items-center gap-2 mb-3 text-red-600 dark:text-red-400">
                            <FaExclamationTriangle className="text-lg" />
                            <span className="font-extrabold tracking-tight text-lg">Are you sure?</span>
                        </div>
                        <p className="text-sm text-red-800 dark:text-red-300/80 mb-6 font-medium leading-relaxed">
                            If you cancel, you will keep your {displayRole} features until the end of your current billing period. After that, your account will be downgraded to Basic.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmCancel(false)}
                                className="flex-1 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={cancelMutation.isLoading}
                                className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-xl shadow-md hover:bg-red-700 active:scale-95 disabled:opacity-70 transition-all"
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