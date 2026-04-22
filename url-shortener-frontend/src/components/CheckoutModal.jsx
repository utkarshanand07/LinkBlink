import React from 'react';
import { RxCross2 } from 'react-icons/rx';
import { useFetchCheckoutPreview, useProcessCheckout } from '../hooks/useQuery';
import { useStoreContext } from '../contextApi/ContextApi';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CheckoutModal = ({ isOpen, onClose, targetTier, billingCycle }) => {
    const { token } = useStoreContext();
    const navigate = useNavigate();

    const { data: preview, isLoading: isPreviewLoading } = useFetchCheckoutPreview(
        token, 
        targetTier, 
        billingCycle, 
        isOpen
    );

    const processMutation = useProcessCheckout(token);

    if (!isOpen) return null;

    const handleCheckout = () => {
        processMutation.mutate({ targetTier, billingCycle }, {
            onSuccess: () => {
                toast.success("Payment successful! Your plan is now active.");
                onClose();
                navigate("/dashboard");
            },
            onError: (err) => toast.error(err.response?.data?.error || "Checkout failed.")
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 w-full max-w-md shadow-premium dark:shadow-glass-dark border border-slate-200 dark:border-slate-700 transform transition-all relative animate-fade-in">
                
                <button 
                    onClick={onClose} 
                    className="absolute top-6 right-6 p-2.5 text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors z-10"
                >
                    <RxCross2 className="text-xl" />
                </button>

                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Checkout</h2>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8">Review your order details below.</p>

                {isPreviewLoading || !preview ? (
                    <div className="animate-pulse space-y-4 mb-8">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-full"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4"></div>
                        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full mt-6"></div>
                    </div>
                ) : (
                    <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 mb-8">
                        <div className="flex justify-between items-center mb-5">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{targetTier} Plan ({preview.durationMonths} Months)</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">${preview.subtotal.toFixed(2)}</span>
                        </div>

                        {preview.prorationCredit > 0 && (
                            <div className="flex justify-between items-center mb-5 text-green-600 dark:text-green-400">
                                <span className="text-sm font-bold">Unused Time Credit</span>
                                <span className="text-sm font-bold">-${preview.prorationCredit.toFixed(2)}</span>
                            </div>
                        )}

                        <div className="border-t border-slate-200 dark:border-slate-800 pt-5 mt-2 flex justify-between items-center">
                            <span className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-widest">Total Due</span>
                            <span className="text-2xl font-black text-slate-900 dark:text-white">${preview.amountDue.toFixed(2)}</span>
                        </div>
                    </div>
                )}

                <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-5 mb-8 flex items-center gap-4 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="w-10 h-6 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-0.5">Mock Credit Card</p>
                        <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 font-mono tracking-[0.15em]">**** **** **** 4242</p>
                    </div>
                </div>

                <button
                    onClick={handleCheckout}
                    disabled={processMutation.isLoading || isPreviewLoading}
                    className="w-full py-4 text-sm font-bold text-white dark:text-slate-900 bg-slate-900 dark:bg-white rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                    {processMutation.isLoading ? "Processing..." : `Pay $${preview?.amountDue.toFixed(2) || "0.00"}`}
                </button>
            </div>
        </div>
    );
};

export default CheckoutModal;