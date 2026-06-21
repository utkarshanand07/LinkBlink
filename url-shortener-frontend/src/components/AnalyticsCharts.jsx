import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LabelList } from 'recharts';
import { useStoreContext } from '../contextApi/ContextApi';
import { FaExternalLinkAlt } from 'react-icons/fa';

const COLORS = ['#0f172a', '#334155', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0'];
const DARK_COLORS = ['#ffffff', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155'];

const formatTopData = (data, topN = 5) => {
    if (!data || data.length === 0) return [];
    if (data.length <= topN) return data;
    
    const sorted = [...data].sort((a, b) => b.value - a.value);
    const top = sorted.slice(0, topN);
    const otherValue = sorted.slice(topN).reduce((sum, item) => sum + item.value, 0);
    
    if (otherValue > 0) {
        top.push({ label: 'Other', value: otherValue });
    }
    return top;
};

const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, value, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.15; 
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="#64748b" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11} fontWeight={700}>
            {`${name} (${value})`}
        </text>
    );
};

export const DonutChartCard = ({ title, data }) => {
    const { theme } = useStoreContext();
    const colors = theme === 'dark' ? DARK_COLORS : COLORS;
    const formattedData = useMemo(() => formatTopData(data, 4), [data]);

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col h-full min-h-[300px]">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">{title}</h3>
            {(!formattedData.length) ? (
                <div className="flex-1 flex items-center justify-center text-sm font-medium text-slate-400">No data</div>
            ) : (
                <div className="flex-1 w-full relative">
                    <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none' }}>
                        <PieChart style={{ outline: 'none' }}>
                            <Pie 
                                data={formattedData} 
                                cx="50%" cy="50%" 
                                innerRadius={65} outerRadius={80} 
                                paddingAngle={4} 
                                dataKey="value" 
                                nameKey="label" 
                                stroke="none" 
                                label={renderCustomizedLabel} 
                                labelLine={false} 
                                isAnimationActive={false} /* FIX: Prevents labels from disappearing */
                                activeShape={null}        /* FIX: Prevents click highlight/border */
                                style={{ outline: 'none' }}
                            >
                                {formattedData.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} style={{ outline: 'none' }} />)}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: theme === 'dark' ? '#f8fafc' : '#0f172a', fontWeight: 'bold' }}
                                cursor={false}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export const PieChartCard = ({ title, data }) => {
    const { theme } = useStoreContext();
    const colors = theme === 'dark' ? DARK_COLORS : COLORS;
    const formattedData = useMemo(() => formatTopData(data, 4), [data]);

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col h-full min-h-[300px]">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">{title}</h3>
            {(!formattedData.length) ? (
                <div className="flex-1 flex items-center justify-center text-sm font-medium text-slate-400">No data</div>
            ) : (
                <div className="flex-1 w-full relative">
                    <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none' }}>
                        <PieChart style={{ outline: 'none' }}>
                            <Pie 
                                data={formattedData} 
                                cx="50%" cy="50%" 
                                outerRadius={80} 
                                dataKey="value" 
                                nameKey="label" 
                                stroke={theme === 'dark' ? '#0f172a' : '#ffffff'} 
                                strokeWidth={3} 
                                label={renderCustomizedLabel} 
                                labelLine={false} 
                                isAnimationActive={false} /* FIX: Prevents labels from disappearing */
                                activeShape={null}        /* FIX: Prevents click highlight/border */
                                style={{ outline: 'none' }}
                            >
                                {formattedData.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} style={{ outline: 'none' }} />)}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: theme === 'dark' ? '#f8fafc' : '#0f172a', fontWeight: 'bold' }}
                                cursor={false}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export const HorizontalBarCard = ({ title, data }) => {
    const { theme } = useStoreContext();
    const barColor = theme === 'dark' ? '#ffffff' : '#0f172a';
    const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';

    const chartHeight = data && data.length > 0 ? Math.max(250, data.length * 45) : 250;

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col h-[350px]">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">{title}</h3>
            {(!data || data.length === 0) ? (
                <div className="flex-1 flex items-center justify-center text-sm font-medium text-slate-400">No data available</div>
            ) : (
                <div className="flex-1 w-full overflow-y-auto overflow-x-hidden hide-scrollbar pr-2">
                    <div style={{ height: chartHeight, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none' }}>
                            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }} style={{ outline: 'none' }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="label" type="category" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 11, fontWeight: 600 }} width={120} />
                                
                                <Tooltip 
                                    cursor={{ fill: 'transparent' }} 
                                    contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: theme === 'dark' ? '#f8fafc' : '#0f172a', fontWeight: 'bold' }}
                                    labelStyle={{ color: theme === 'dark' ? '#94a3b8' : '#64748b', fontWeight: '600', marginBottom: '4px' }}
                                />
                                
                                <Bar 
                                    dataKey="value" 
                                    fill={barColor} 
                                    radius={[0, 4, 4, 0]} 
                                    barSize={20} 
                                    activeBar={false} /* FIX: Prevents click/hover highlight border */
                                    isAnimationActive={false}
                                    style={{ outline: 'none' }}
                                >
                                    <LabelList dataKey="value" position="right" fill={textColor} fontSize={11} fontWeight={700} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

export const ReferrerListCard = ({ title, data }) => {
    const formattedData = useMemo(() => formatTopData(data, 10), [data]); 
    const maxValue = formattedData.length > 0 ? Math.max(...formattedData.map(d => d.value)) : 0;

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col h-[350px]">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">{title}</h3>
            {(!formattedData.length) ? (
                <div className="flex-1 flex items-center justify-center text-sm font-medium text-slate-400">No data</div>
            ) : (
                <div className="flex flex-col gap-4 overflow-y-auto overflow-x-hidden hide-scrollbar pr-2">
                    {formattedData.map((item, index) => (
                        <div key={index} className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{item.label}</span>
                                <span className="text-sm font-black text-slate-900 dark:text-white">{item.value}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-900 dark:bg-white rounded-full" style={{ width: `${(item.value / maxValue) * 100}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};