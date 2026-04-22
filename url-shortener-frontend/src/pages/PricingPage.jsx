import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useStoreContext } from '../contextApi/ContextApi';
import CheckoutModal from '../components/CheckoutModal';
import ConfirmModal from '../components/ConfirmModal';
import { useSubmitEnterpriseContact } from '../hooks/useQuery';
import { toast } from 'react-hot-toast';

const PricingPage = () => {
    const { token } = useStoreContext();
    const navigate = useNavigate();
    const [cycle, setCycle] = useState('YEAR_1'); 
    const [checkoutConfig, setCheckoutConfig] = useState({ isOpen: false, targetTier: 'PRO' });
    const [enterpriseModalOpen, setEnterpriseModalOpen] = useState(false);
    
    const enterpriseMutation = useSubmitEnterpriseContact(token);

    const getPricingDetails = (basePrice) => {
        let multiplier = 1.0;
        let months = 1;
        if (cycle === 'MONTH_3') { multiplier = 0.90; months = 3; }
        else if (cycle === 'MONTH_6') { multiplier = 0.85; months = 6; }
        else if (cycle === 'YEAR_1') { multiplier = 0.80; months = 12; }

        const monthlyEquivalent = basePrice * multiplier;
        const totalBilled = basePrice * months * multiplier;
        const totalSavings = (basePrice * months) - totalBilled;

        return {
            monthly: monthlyEquivalent.toFixed(2),
            total: totalBilled.toFixed(2),
            savings: totalSavings.toFixed(2),
            monthsText: months === 1 ? 'month' : `${months} months`
        };
    };

    const proPricing = getPricingDetails(9.99);
    const enterprisePricing = getPricingDetails(29.99);

    const handleUpgradeClick = (tier) => {
        if (!token) {
            navigate("/login", { state: { message: "Please log in to upgrade your plan." } });
            return;
        }
        tier === 'CUSTOM' ? setEnterpriseModalOpen(true) : setCheckoutConfig({ isOpen: true, targetTier: tier });
    };

    const handleCustomSubmit = () => {
        enterpriseMutation.mutate({ companyName: "New Request", expectedLinks: "Custom" }, {
            onSuccess: () => {
                toast.success("Request sent! Our team will reach out shortly.");
                setEnterpriseModalOpen(false);
            },
            onError: () => toast.error("Failed to send request. Please try again.")
        });
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 pb-24 transition-colors duration-300 relative overflow-hidden">
            
            {/* Background Aesthetic Orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 dark:bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-16 sm:pt-24 relative z-10">
                
                {/* Refined Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-4 py-1.5 mb-6 text-[11px] font-bold tracking-[0.2em] uppercase bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-full text-slate-500 dark:text-slate-400 shadow-sm">
                        Pricing Plans
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
                        Scale your links.
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        Flexible plans for creators and teams. No surprises.
                    </motion.p>
                </div>

                {/* Glassmorphism Toggle */}
                <div className="flex justify-center mb-16">
                    <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex items-center">
                        {['MONTH_1', 'MONTH_3', 'MONTH_6', 'YEAR_1'].map((c) => (
                            <button
                                key={c}
                                onClick={() => setCycle(c)}
                                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all relative ${cycle === c ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                {c.replace('MONTH_', '').replace('YEAR_1', '12')}m
                                {c === 'YEAR_1' && <span className="absolute -top-1 -right-1 flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 dark:bg-green-500 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 dark:bg-green-400"></span></span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                    
                    {[
                        { 
                            title: 'Basic', price: 'Free', sub: 'For individuals.', 
                            perks: ['50 Short Links', '30-Day Expiration', 'Standard Analytics'], forbidden: ['Custom Aliases'],
                            color: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800', 
                            text: 'text-slate-900 dark:text-white', subText: 'text-slate-500 dark:text-slate-400', moText: 'text-slate-400 dark:text-slate-500', checkIcon: 'text-slate-900 dark:text-white',
                            btn: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700' 
                        },
                        { 
                            title: 'Pro', price: `$${proPricing.monthly}`, sub: 'For professionals.', featured: true, pricing: proPricing,
                            perks: ['1,000 Short Links', '1 Year Expiration', 'Custom Aliases', 'Standard Analytics'], 
                            color: 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white', 
                            text: 'text-white dark:text-slate-900', subText: 'text-slate-300 dark:text-slate-500', moText: 'text-slate-400 dark:text-slate-500', saveText: 'text-green-400 dark:text-green-600', checkIcon: 'text-yellow-400 dark:text-yellow-500',
                            btn: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800' 
                        },
                        { 
                            title: 'Enterprise', price: `$${enterprisePricing.monthly}`, sub: 'For heavy volume.', pricing: enterprisePricing,
                            perks: ['10,000 Short Links', 'Lifetime Expiration', 'Advanced Analytics', 'Custom Aliases'], 
                            color: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800', 
                            text: 'text-slate-900 dark:text-white', subText: 'text-slate-500 dark:text-slate-400', moText: 'text-slate-400 dark:text-slate-500', saveText: 'text-green-500 dark:text-green-400', checkIcon: 'text-slate-900 dark:text-white',
                            btn: 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100' 
                        },
                        { 
                            title: 'Custom', price: 'Contact', sub: 'For large teams.', 
                            perks: ['Unlimited Links', 'Dedicated Support', 'Custom SLA', 'Custom Domains'], 
                            color: 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800', 
                            text: 'text-slate-900 dark:text-white', subText: 'text-slate-500 dark:text-slate-400', checkIcon: 'text-slate-900 dark:text-white',
                            btn: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800' 
                        }
                    ].map((plan, i) => (
                        <div key={i} className={`${plan.color} ${plan.text} rounded-[2rem] p-8 border flex flex-col transition-all duration-300 hover:shadow-premium dark:hover:shadow-glass-dark hover:-translate-y-1 relative overflow-hidden`}>
                            {plan.featured && <div className="absolute top-0 right-0 bg-yellow-400 dark:bg-yellow-500 text-slate-900 font-black text-[9px] px-6 py-1 transform rotate-45 translate-x-6 translate-y-2 uppercase tracking-widest">Best</div>}
                            
                            <h3 className="text-xl font-extrabold mb-1">{plan.title}</h3>
                            <p className={`text-xs font-semibold ${plan.subText} mb-8`}>{plan.sub}</p>
                            
                            <div className="mb-10">
                                <span className="text-4xl font-black tracking-tight">{plan.price}</span>
                                {plan.pricing && <span className={`text-xs font-bold ${plan.moText} ml-2 tracking-wide`}>/mo</span>}
                                {plan.pricing && cycle !== 'MONTH_1' && (
                                    <div className={`mt-2 text-[10px] font-bold ${plan.saveText} uppercase tracking-widest`}>
                                        Save ${plan.pricing.savings} Total
                                    </div>
                                )}
                            </div>

                            <ul className="space-y-4 mb-12">
                                {plan.perks.map((p, j) => (
                                    <li key={j} className="flex items-center gap-3 text-sm font-semibold opacity-90">
                                        <FaCheck className={plan.checkIcon} /> {p}
                                    </li>
                                ))}
                                {plan.forbidden?.map((f, j) => (
                                    <li key={j} className="flex items-center gap-3 text-sm font-semibold opacity-30">
                                        <FaTimes /> {f}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto pt-6">
                                <button 
                                    onClick={() => handleUpgradeClick(plan.title.toUpperCase())}
                                    disabled={plan.title === 'Basic'}
                                    className={`w-full py-4 ${plan.btn} rounded-xl font-bold text-xs uppercase tracking-[0.15em] transition-all active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100`}
                                >
                                    {plan.title === 'Basic' ? 'Current Plan' : `Get ${plan.title}`}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <CheckoutModal isOpen={checkoutConfig.isOpen} onClose={() => setCheckoutConfig({ ...checkoutConfig, isOpen: false })} targetTier={checkoutConfig.targetTier} billingCycle={cycle} />
            <ConfirmModal isOpen={enterpriseModalOpen} onClose={() => setEnterpriseModalOpen(false)} onConfirm={handleCustomSubmit} title="Contact Sales" message="Discuss custom limits? We will review your account and email you shortly." confirmText={enterpriseMutation.isLoading ? "Sending..." : "Submit"} isDanger={false} />
        </div>
    );
};

export default PricingPage;