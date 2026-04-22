import React from "react";
import { Bar } from "react-chartjs-2";
import { useStoreContext } from '../../contextApi/ContextApi';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(BarElement, Tooltip, CategoryScale, LinearScale, Legend, Filler);

const Graph = ({ graphData }) => {
  const { theme } = useStoreContext(); 
  
  const isDark = theme === 'dark';
  
  // High Contrast Colors
  const textColor = isDark ? '#94a3b8' : '#64748b'; // slate-400 : slate-500
  const gridColor = isDark ? '#334155' : '#e2e8f0'; // slate-700 : slate-200
  const barColor = isDark ? '#ffffff' : '#0f172a'; // White bars in dark mode!

  const labels = graphData?.map((item) => `${item.clickDate}`);
  const userPerDay = graphData?.map((item) => item.count);

  const data = {
    labels: graphData?.length ? labels : ["", "", "", "", "", "", "", ""],
    datasets: [
      {
        label: "Total Clicks",
        data: graphData?.length ? userPerDay : [1, 2, 3, 4, 5, 4, 3, 2],
        backgroundColor: graphData?.length ? barColor : (isDark ? '#475569' : '#e2e8f0'), // Gray placeholder if empty
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.5,
        categoryPercentage: 0.8,
        maxBarThickness: 48, 
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? "#1e293b" : "#ffffff", // slate-800
        titleColor: isDark ? "#ffffff" : "#0f172a",
        bodyColor: isDark ? "#cbd5e1" : "#475569",
        borderColor: isDark ? "#334155" : "#e2e8f0",
        borderWidth: 1,
        padding: 14,
        displayColors: false,
        titleFont: { family: "'Montserrat', sans-serif", size: 13, weight: "600" },
        bodyFont: { family: "'Montserrat', sans-serif", size: 14, weight: "700" },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: gridColor, drawTicks: false },
        ticks: {
          color: textColor,
          font: { family: "'Montserrat', sans-serif", size: 12, weight: "600" },
          callback: (value) => Number.isInteger(value) ? value.toString() : "",
        },
      },
      x: {
        border: { display: false },
        grid: { display: false },
        ticks: {
          color: textColor,
          font: { family: "'Montserrat', sans-serif", size: 12, weight: "600" },
        },
      },
    },
  };

  return <Bar key={theme} className="w-full h-full" data={data} options={options}></Bar>;
};

export default Graph;