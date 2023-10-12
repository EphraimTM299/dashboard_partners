"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Home from "../page";
import Complete from "../components/Complete";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Legend,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import Spinner from "../components/Spinner";
import { UserAuth } from "../context/AuthContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale
);

export default function History() {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  const data = {
    labels: ["Online", "Onsite"],
    options: {},
    datasets: [
      {
        label: "Order Type",
        data: [5, 7],
        backgroundColor: ["#2660a4", "#938ba1"],
        borderColor: ["#2660a4", "#938ba1"],
        aspectRatio: 1 / 2,
      },
    ],
  };

  const data1 = {
    labels: ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat"],
    datasets: [
      {
        label: "Revenue",
        data: [2504, 3502, 4850, 3250],
        backgroundColor: ["#274690"],
        tension: 0.25,
        borderColor: ["#274690"],
      },
    ],
  };

  const data2 = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Revenue",
        data: [2504, 3502, 4850, 3250, 2250, 3150, 3502, 4850, 3120],
        backgroundColor: ["#274690"],
        tension: 0.25,
        borderColor: ["#274690"],
      },
    ],
  };
  const data3 = {
    labels: ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat"],
    datasets: [
      {
        label: "Revenue",
        data: [2504, 3502, 4850, 3250, 1250],
        backgroundColor: ["#274690"],
        tension: 0.25,
        borderColor: ["#274690"],
      },
    ],
  };
  const data4 = {
    labels: ["Laundry", "Dry Cleaning", "Ironing"],
    datasets: [
      {
        label: "Revenue Breakdown",
        data: [525, 750, 920],
        backgroundColor: ["#e2725b", "#938ba1", "#33261d"],
        borderColor: ["#e2725b", "#938ba1", "#33261d"],
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
  const options1 = {
    responsive: true,

    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : user ? (
        <Sidebar>
          <div className="bg-gray-100 min-h-screen">
            <div className="flex justify-between px-6 pt-4">
              <h2 className="text-xl font-semibold">Analytics</h2>
            </div>

            <div className="px-6 pt-4"></div>
            <Complete />

            <div className="overflow-hidden max-h-fit rounded-lg border flex grid-cols-3 border-gray-200 shadow-md m-5">
              <div className="w-full max-w-md px-6 py-6 border-collapse bg-white text-left text-sm text-gray-500">
                <a
                  href="#"
                  className="block p-6 py-6 px-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 "
                >
                  <div className="text-xl text-center mb-4 font-semibold text-black justify-center ">
                    Order Makeup
                  </div>

                  <Doughnut data={data} options={options}></Doughnut>
                </a>
              </div>

              <div className="w-full px-6 py-6 border-collapse bg-white text-left text-sm text-gray-500">
                <a
                  href="#"
                  className="block p-6 py-6 px-6 h-full w-full bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
                >
                  <div className="text-xl text-center mb-4 font-semibold text-black justify-center ">
                    Monthly Revenue
                  </div>

                  <Line data={data2} options={options1}></Line>
                </a>
              </div>
            </div>
            <div className="overflow-hidden max-h-fit rounded-lg border flex grid-cols-3 border-gray-200 shadow-md m-5">
              <div className="w-full max-w-md px-6 py-6 border-collapse bg-white text-left text-sm text-gray-500">
                <a
                  href="#"
                  className="block p-6 py-6 px-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 "
                >
                  <div className="text-xl text-center mb-4 font-semibold text-black justify-center ">
                    Revenue Split
                  </div>

                  <Doughnut data={data4} options={options}></Doughnut>
                </a>
              </div>

              <div className="w-full px-6 py-6 border-collapse bg-white text-left text-sm text-gray-500">
                <a
                  href="#"
                  className="block  p-6 py-6 px-6 h-full w-full bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
                >
                  <div className="text-xl text-center mb-4 font-semibold text-black justify-center ">
                    Daily Revenue
                  </div>

                  <Line data={data1} options={options1}></Line>
                </a>
              </div>
            </div>
          </div>
        </Sidebar>
      ) : (
        <Home />
      )}
    </>
  );
}
