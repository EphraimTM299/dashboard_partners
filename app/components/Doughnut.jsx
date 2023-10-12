"use client";

import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Doughnut, Line } from "react-chartjs-2";
import "chart.js/auto";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FiMousePointer } from "react-icons/fi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DoughnutChart = () => {
  const data = {
    labels: ["Online", "Onsite"],
    options: {},
    datasets: [
      {
        label: "Order Type",
        data: [5, 7],
        backgroundColor: ["#357cd0", "#94b0da"],
        borderColor: ["#357cd0", "#94b0da"],
        aspectRatio: 1 / 2,
      },
    ],
  };

  const options = {
    responsive: true,
    layout: {
      padding: 15,
    },

    plugins: {
      legend: {
        position: "left",
      },
    },
  };

  return (
    <>
      <a
        href="#"
        className="block p-6 py-6 px-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
      >
        <div className="text-xl text-center mb-4 font-semibold text-black justify-center ">
          Order Makeup
        </div>

        <Doughnut data={data} options={options}></Doughnut>
      </a>
    </>
  );
};

export default DoughnutChart;
