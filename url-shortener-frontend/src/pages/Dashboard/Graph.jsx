import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(
  BarElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  Legend,
  Filler
);

const Graph = ({ graphData }) => {
  const labels = graphData?.map((item, i) => `${item.clickDate}`);
  const userPerDaya = graphData?.map((item) => item.count);

  const data = {
    labels:
      graphData && graphData.length > 0
        ? labels
        : ["", "", "", "", "", "", "", ""],
    datasets: [
      {
        label: "Total Clicks",
        data:
          graphData && graphData.length > 0
            ? userPerDaya
            : [1, 2, 3, 4, 5, 4, 3, 2],
        backgroundColor:
          graphData && graphData.length > 0 ? "#000000" : "#f3f4f6",
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
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#000000",
        bodyColor: "#6b7280",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        titleFont: {
          family: "'Montserrat', sans-serif",
          size: 13,
          weight: "600",
        },
        bodyFont: {
          family: "'Montserrat', sans-serif",
          size: 14,
          weight: "700",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: {
          color: "#f3f4f6",
          drawTicks: false,
        },
        ticks: {
          color: "#9ca3af",
          font: {
            family: "'Montserrat', sans-serif",
            size: 12,
            weight: "500",
          },
          callback: function (value) {
            if (Number.isInteger(value)) {
              return value.toString();
            }
            return "";
          },
        },
        title: {
          display: true,
          text: "Number Of Clicks",
          color: "#9ca3af",
          font: {
            family: "'Montserrat', sans-serif",
            size: 13,
            weight: "600",
          },
        },
      },
      x: {
        border: { display: false },
        grid: {
          display: false,
        },
        ticks: {
          color: "#9ca3af",
          font: {
            family: "'Montserrat', sans-serif",
            size: 12,
            weight: "500",
          },
        },
      },
    },
  };

  return <Bar className="w-full h-full" data={data} options={options}></Bar>;
};

export default Graph;