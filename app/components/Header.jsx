"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { UserAuth } from "../context/AuthContext";

export default function CustomHeader({ laundromatName }) {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);
  const today = new Date();

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  return (
    <div>
      <>
        <div className="flex justify-between px-6 pt-4">
          <h2>
            {" "}
            <span className="text-xl font-semibold">
              {laundromatName} Dashboard
            </span>
            <br />
          </h2>

          <h2>
            <span className="text-l text-transform: capitalize font-semibold">
              Welcome Back, {user.displayName}
            </span>{" "}
            <br />
            <span className="text-xs text-transform:lowercase ">
              Signed in as {user.email}
            </span>
            <br />
            <span className="text-xs font-semibold">
              {today.toDateString()} {new Date().toLocaleTimeString()}
            </span>
          </h2>
        </div>
      </>
    </div>
  );
}
