import React, { useState, useMemo } from 'react';
import Graph from './Graph';
import { useStoreContext } from '../../contextApi/ContextApi';
import { useFetchMyShortUrls, useFetchTotalClicks, useFetchCurrentUser, useFetchAdvancedAnalyticsTotal } from '../../hooks/useQuery';
import ShortenPopUp from './ShortenPopUp';
import { FaPlus, FaCrown, FaChartPie, FaListUl, FaArrowRight, FaTrophy, FaLink } from 'react-icons/fa';
import ShortenUrlList from './ShortenUrlList';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import dayjs from 'dayjs';
import ManageBillingModal from '../../components/ManageBillingModal';
import { DonutChartCard, PieChartCard, HorizontalBarCard, ReferrerListCard } from '../../components/AnalyticsCharts';

const DashboardLayout = () => {
    const { token } = useStoreContext();
    const navigate = useNavigate();

    const [shortenPopUp, setShortenPopUp] = useState(false);
    const [billingModalOpen, setBillingModalOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [view, setView] = useState('OVERVIEW');

    function onError() { navigate("/error"); }

    const { isLoading, data: myShortenUrlsData, refetch } = useFetchMyShortUrls(token, page, 10, onError);
    const { isLoading: loader, data: totalClicks } = useFetchTotalClicks(token, onError);
    const { data: userProfile } = useFetchCurrentUser(token, () => { });

    const topLink = useMemo(() => {
        if (!myShortenUrlsData?.content || myShortenUrlsData.content.length === 0) return null;
        return myShortenUrlsData.content.reduce((prev, current) => (prev.clickCount > current.clickCount) ? prev : current);
    }, [myShortenUrlsData]);

    const hasUrls = myShortenUrlsData?.content && myShortenUrlsData.content.length > 0;
    const totalLinksCount = myShortenUrlsData?.totalElements || 0;

    const displayRole = userProfile?.role ? userProfile.role.replace('ROLE_', '') : 'BASIC';
    const hasAdvancedAccess = displayRole === 'ENTERPRISE' || displayRole === 'ADMIN';

    const { data: advancedStats, isLoading: advLoader } = useFetchAdvancedAnalyticsTotal(token, hasAdvancedAccess);

    return (
        <div className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 flex flex-col pb-20 transition-colors duration-300">
            {loader ? <Loader /> : (
                <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-12 pt-8 lg:pt-12">

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pt-4">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                                {view === 'OVERVIEW' ? 'Command Center' : 'Link Management'}
                            </h1>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                {view === 'OVERVIEW' ? 'Your overall metrics and insights at a glance.' : 'Organize, edit, and track your individual URLs.'}
                            </p>
                        </div>

                        <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-2xl w-full md:w-auto">
                            <button onClick={() => setView('OVERVIEW')} className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${view === 'OVERVIEW' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                                <FaChartPie /> Overview
                            </button>
                            <button onClick={() => setView('LINKS')} className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${view === 'LINKS' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                                <FaListUl /> My Links
                            </button>
                        </div>
                    </div>

                    {view === 'OVERVIEW' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">

                            {/* BENTO 1: Engagement Timeline (Spans left 2 columns, spanning 2 rows down) */}
                            <div className="lg:col-span-2 lg:row-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl p-6 sm:p-8 h-[400px] lg:h-full flex flex-col relative transition-all hover:shadow-md">
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Engagement Timeline</h3>
                                {(!totalClicks || totalClicks.length === 0) && (
                                    <div className="absolute inset-0 flex flex-col justify-center items-center z-10"><p className="text-slate-500 dark:text-slate-400 font-medium">No click data available yet.</p></div>
                                )}
                                <div className="flex-1 w-full"><Graph graphData={totalClicks || []} /></div>
                            </div>

                            {/* BENTO 2: Current Plan (Top row of right block) */}
                            {userProfile && (
                                <div onClick={() => setBillingModalOpen(true)} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between cursor-pointer group hover:shadow-md transition-all h-full">
                                    <div className={`p-4 rounded-full w-fit mb-6 ${displayRole === 'BASIC' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'}`}>
                                        <FaCrown className="text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{displayRole}</h3>
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                                            {displayRole === 'BASIC' || displayRole === 'ADMIN' || !userProfile.tierExpiresAt
                                                ? "LIFETIME ACCESS" : `EXPIRES ${dayjs(userProfile.tierExpiresAt).format("MMM DD, YY")}`
                                            } <FaArrowRight className="text-[10px]" />
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* BENTO 3: Create Link Box (Top right corner) */}
                            <div onClick={() => setShortenPopUp(true)} className="bg-slate-900 dark:bg-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between cursor-pointer hover:scale-[1.02] active:scale-95 transition-all h-full">
                                <div className="bg-white/20 dark:bg-slate-900/10 p-3 rounded-xl w-fit mb-6">
                                    <FaPlus className="text-white dark:text-slate-900 text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-black text-white dark:text-slate-900 tracking-tight leading-none mb-1">Create<br />Link</h3>
                                </div>
                            </div>

                            {/* BENTO 4: Total Links Box (Bottom row of right block, left side) */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between h-full transition-all hover:shadow-md">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full w-fit mb-6">
                                    <FaLink className="text-blue-600 dark:text-blue-400 text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{totalLinksCount}</h3>
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Total Links</p>
                                </div>
                            </div>

                            {/* BENTO 5: Top Performing Link (Bottom right corner) */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/50 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between h-full transition-all hover:shadow-md">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-sm"><FaTrophy className="text-lg" /></div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 px-2 py-1 rounded-md shadow-sm">Top</span>
                                </div>
                                {topLink ? (
                                    <div className="flex flex-col overflow-hidden">
                                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 truncate w-full">{topLink.originalUrl}</p>
                                        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate w-full">/{topLink.shortUrl}</h3>
                                        <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-500 mt-2">{topLink.clickCount} <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Clicks</span></span>
                                    </div>
                                ) : (
                                    <h3 className="text-lg font-bold text-slate-400 mt-auto">No active links</h3>
                                )}
                            </div>

                            {/* ========================================== */}
                            {/* ADVANCED ANALYTICS SECTION                 */}
                            {/* ========================================== */}
                            {hasAdvancedAccess ? (
                                advLoader ? (
                                    <div className="md:col-span-2 lg:col-span-4 flex justify-center items-center h-[300px]"><Loader /></div>
                                ) : (
                                    <>
                                        {/* Row 3: Geo and Traffic */}
                                        <div className="md:col-span-2"><HorizontalBarCard title="Global Audience (City/Country)" data={advancedStats?.clicksByCountry} /></div>
                                        <div className="md:col-span-2"><ReferrerListCard title="Traffic Sources" data={advancedStats?.clicksByReferrer} /></div>

                                        {/* Row 4: Tech Stack (Ring, Solid Pie, Ring) */}
                                        <div className="col-span-1 lg:col-span-2 xl:col-span-1"><DonutChartCard title="Devices" data={advancedStats?.clicksByDevice} /></div>
                                        <div className="col-span-1 lg:col-span-2 xl:col-span-1"><PieChartCard title="OS" data={advancedStats?.clicksByOs} /></div>
                                        <div className="col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-2"><DonutChartCard title="Browsers" data={advancedStats?.clicksByBrowser} /></div>
                                    </>
                                )
                            ) : (
                                <div className="md:col-span-2 lg:col-span-4 bg-slate-900 dark:bg-slate-800 rounded-3xl p-8 sm:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8 mt-4 relative overflow-hidden">
                                    <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-blue-500/20 rounded-full blur-[40px] pointer-events-none"></div>
                                    <div>
                                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">Unlock Deep Audience Insights.</h2>
                                        <p className="text-slate-400 font-medium max-w-xl">Upgrade to Enterprise to reveal interactive dashboards showing your top cities, referral sources, devices, and browsers.</p>
                                    </div>
                                    <button onClick={() => navigate('/pricing')} className="shrink-0 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-500 active:scale-95 transition-all">
                                        Upgrade to Enterprise
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ========================================== */}
                    {/* VIEW B: LINK MANAGEMENT LIST               */}
                    {/* ========================================== */}
                    {view === 'LINKS' && (
                        <div className="animate-fade-in mt-4">

                            {/* Action Header for Links View */}
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={() => setShortenPopUp(true)}
                                    className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm active:scale-95 w-full sm:w-auto"
                                >
                                    <FaPlus className="text-xs" /> Create Link
                                </button>
                            </div>

                            {isLoading ? (
                                <Loader />
                            ) : !hasUrls ? (
                                <div className="flex flex-col items-center justify-center py-24 px-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-white dark:bg-slate-900">
                                    <h1 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight mb-3">No links found</h1>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6">You haven't shortened any URLs yet.</p>
                                </div>
                            ) : (
                                <ShortenUrlList data={myShortenUrlsData} refetch={refetch} currentPage={page} setPage={setPage} />
                            )}
                        </div>
                    )}
                </div>
            )}

            <ShortenPopUp refetch={refetch} open={shortenPopUp} setOpen={setShortenPopUp} />
            <ManageBillingModal isOpen={billingModalOpen} onClose={() => setBillingModalOpen(false)} userProfile={userProfile} />
        </div>
    )
}

export default DashboardLayout;