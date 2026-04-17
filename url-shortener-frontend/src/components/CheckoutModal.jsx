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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl transform transition-all relative">
                
                <button onClick={onClose} className="absolute top-5 right-5 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors z-10">
                    <RxCross2 className="text-xl" />
                </button>

                <h2 className="text-2xl font-extrabold text-black tracking-tight mb-2">Checkout</h2>
                <p className="text-sm font-medium text-gray-500 mb-6">Review your order details below.</p>

                {isPreviewLoading || !preview ? (
                    <div className="animate-pulse space-y-4 mb-8">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
                    </div>
                ) : (
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-bold text-gray-700">{targetTier} Plan ({preview.durationMonths} Months)</span>
                            <span className="text-sm font-bold text-black">${preview.subtotal.toFixed(2)}</span>
                        </div>

                        {preview.prorationCredit > 0 && (
                            <div className="flex justify-between items-center mb-4 text-green-600">
                                <span className="text-sm font-bold">Unused Time Credit</span>
                                <span className="text-sm font-bold">-${preview.prorationCredit.toFixed(2)}</span>
                            </div>
                        )}

                        <div className="border-t border-gray-200 pt-4 mt-2 flex justify-between items-center">
                            <span className="text-base font-extrabold text-black">Total Due Today</span>
                            <span className="text-2xl font-extrabold text-black">${preview.amountDue.toFixed(2)}</span>
                        </div>
                    </div>
                )}

                <div className="border border-gray-200 rounded-xl p-4 mb-6 flex items-center gap-3 bg-white">
                    <div className="w-8 h-5 bg-gray-200 rounded-sm"></div>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-gray-800">Mock Credit Card</p>
                        <p className="text-[10px] text-gray-400">**** **** **** 4242</p>
                    </div>
                </div>

                <button
                    onClick={handleCheckout}
                    disabled={processMutation.isLoading || isPreviewLoading}
                    className="w-full py-4 text-sm font-bold text-white bg-black rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-black/10 disabled:opacity-70"
                >
                    {processMutation.isLoading ? "Processing..." : `Pay $${preview?.amountDue.toFixed(2) || "0.00"}`}
                </button>
            </div>
        </div>
    );
};

export default CheckoutModal;