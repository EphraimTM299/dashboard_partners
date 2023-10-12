"use client";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import Profile from "../components/BusinessInfo";
import Sidebar from "../components/Sidebar";
import Home from "../page";

const page = () => {
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
    <div>
      {loading ? (
        <Spinner />
      ) : user ? (
        <Sidebar>
          <div className="bg-gray-100 min-h-screen">
            {" "}
            <Profile />
          </div>
        </Sidebar>
      ) : (
        <Home />
      )}
    </div>
  );
};

export default page;
