import React, { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "../firebase";
import { Tooltip } from "react-tooltip";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const TopCards = () => {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);
  const [mylaundromat, setUserID] = useState([]);
  const [items, setItems] = useState([]);
  const [onlineItems, setOnlineItems] = useState([]);

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  useEffect(() => {
    const q = query(collection(db, "laundryUsers"));

    const queryRef = query(q, where("userEmail", "==", `${user.email}`));
    const unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
        setUserID(itemsArr[0].laundromatName);
      });

      return () => unsubscribe();
    });
  });

  // Read items from the database
  useEffect(() => {
    const q = query(collection(db, "orders"));

    const queryRef = query(
      q,
      where("laundromat", "==", `${mylaundromat}`),
      where("orderType", "==", "onSite")
    );

    const unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);
      // console.log(itemsArr);

      return () => unsubscribe();
    });
  }, [mylaundromat]);
  // Read items from the database
  useEffect(() => {
    const q = query(collection(db, "orders"));

    const queryRef = query(
      q,
      where("laundromat", "==", `${mylaundromat}`),
      where("orderType", "==", "online")
    );

    const unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setOnlineItems(itemsArr);
      // console.log(itemsArr);

      return () => unsubscribe();
    });
  }, [mylaundromat]);

  const total = items.reduce((sum, value) => {
    return sum + value.orderAmount;
  }, 0);

  const totalOnline = onlineItems.reduce((sum, value) => {
    return sum + value.orderAmount;
  }, 0);

  return (
    <div className="grid lg:grid-cols-8 gap-4 p-4">
      <>
        <div className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg">
          <div className="flex flex-col w-full pb-4">
            <p className="tex-2xl font-bold">R {total.toFixed(2)}</p>
            <p className="text-gray-600">
              {" "}
              Weekly Onsite Orders (
              <span className="font-bold text-black">{items.length}</span>)
            </p>
          </div>
          <Tooltip id="my-tooltip" />
          <a
            data-tooltip-id="my-tooltip"
            data-tooltip-content="The Delta betweeen Current Week vs Previous Week "
          >
            <p className="bg-blue-200 flex justify-center items-center p-4 rounded-lg">
              <span className="text-blue-800 text-lg">+24.84%</span>
            </p>
          </a>
        </div>
        <div className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg">
          <div className="flex flex-col w-full pb-4">
            <p className="tex-2xl font-bold">R {totalOnline.toFixed(2)}</p>
            <p className="text-gray-600">
              Weekly Online Orders (
              <span className="font-bold text-black">{onlineItems.length}</span>
              )
            </p>
          </div>
          <Tooltip id="my-tooltip" />
          <a
            data-tooltip-id="my-tooltip"
            data-tooltip-content="The Delta betweeen Current Week vs Previous Week "
          >
            <p className="bg-blue-200 flex justify-center items-center p-4 rounded-lg">
              <span className="text-blue-800 text-lg">+28.40%</span>
            </p>
          </a>
        </div>
        <div className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg">
          <div className="flex flex-col w-full pb-4">
            <p className="tex-2xl font-bold">
              {onlineItems.length + items.length}
            </p>
            <p className="text-gray-600">Weekly Complete Orders</p>
          </div>
          <Tooltip id="my-tooltip" />
          <a
            data-tooltip-id="my-tooltip"
            data-tooltip-content="The Delta betweeen Current Week vs Previous Week "
          >
            {" "}
            <p className="bg-blue-200 flex justify-center items-center p-4 rounded-lg">
              <span className="text-blue-800 text-lg">+14.89%</span>
            </p>
          </a>
        </div>
        <div className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg">
          <div className="flex flex-col w-full pb-4">
            <p className="tex-2xl font-bold">
              R {items.length == 0 ? 0 : (total / items.length).toFixed(2)}
            </p>
            <p className="text-gray-600">Average Revenue per Order</p>
          </div>
          <Tooltip id="my-tooltip" />
          <a
            data-tooltip-id="my-tooltip"
            data-tooltip-content="The Delta betweeen Current Week vs Previous Week "
          >
            <p className="bg-red-200 flex justify-center items-center p-4 rounded-lg">
              <span className="text-red-700 text-lg">-8.45%</span>
            </p>
          </a>
        </div>
      </>
    </div>
  );
};

export default TopCards;
