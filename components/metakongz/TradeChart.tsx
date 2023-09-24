import React from "react";
// import {
//     Chart as ChartJS,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Tooltip,
//     Legend,
//     Chart,
//   } from 'chart.js';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

//ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const TradeChart = (chartData: any) => {
  let dataJson: any[] = [];
  Object.keys(chartData).forEach(function (key) {
    dataJson.push(chartData[key]);
  });

  const data = {
    datasets: [
      {
        label: "NFT 판매데이터",
        data: dataJson[0],
        backgroundColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default TradeChart;
