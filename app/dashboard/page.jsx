"use client";

import Head from "next/head";
import { useEffect, useState } from "react";
import SideBar from "../components/Sidebar";
import { UserAuth } from "../context/AuthContext";
import Home from "../page";
import Spinner from "../components/Spinner";
import CreateOrder from "../components/CreateOrder";

export default function Dashboard() {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : user ? (
        <SideBar>
          <>
            <Head>
              <title>Teillo Partners Dashboard</title>
              <meta name="description" content="teillo laundromat dashboard" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="bg-gray-100 min-h-screen">
              <CreateOrder />
              <div className="p-4 grid md:grid-cols-3 grid-cols-1 gap-4"></div>
            </main>
          </>
        </SideBar>
      ) : (
        <Home />
      )}
    </>
  );
}
