import React, { useState, useEffect, useRef } from "react";
import { BsDownload } from "react-icons/bs";
import {
  collection,
  orderBy,
  query,
  onSnapshot,
  where,
} from "firebase/firestore";

import { useDownloadExcel } from "react-export-table-to-excel";
import { UserAuth } from "../context/AuthContext";

import { db } from "../firebase";

const Complete = () => {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  const [items, setItems] = useState([]);
  const [mylaundromat, setUserID] = useState([]);

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
  }, []);

  // Read items from the database
  useEffect(() => {
    const q = query(collection(db, "orders"));

    const queryRef = query(
      q,
      where("laundromat", "==", `${mylaundromat}`),
      where("orderStatus", "==", "Complete"),
      orderBy("pickup", "desc")
    );

    const unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);

      return () => unsubscribe();
    });
  }, [mylaundromat]);

  const tableRef = useRef();

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Active Orders",
    sheet: "Active Orders",
  });

  return (
    <div className="overflow-hidden rounded-lg border block border-gray-200 shadow-md m-5">
      <div className="justify-between flex">
        <div className="m-5 text-xl font-semibold ">Completed Orders</div>
        <button
          onClick={onDownload}
          className="px-6 m-5 py-1 font-semibold text-white text-sm flex rounded-xl bg-blue-500 "
        >
          {" "}
          <BsDownload className="mr-2" size={20} /> Export
        </button>
      </div>
      <table
        ref={tableRef}
        className="w-full border-collapse bg-white text-left text-sm text-gray-500"
      >
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900">
              Order Number
            </th>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900">
              Client Name
            </th>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900">
              Order Status
            </th>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900">
              {" "}
              Order Value
            </th>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900">
              Delivery Status
            </th>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900">
              Laundromat
            </th>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900">
              Order type
            </th>
          </tr>
        </thead>
        {items.map((item, index) => (
          <tbody
            key={index}
            className="divide-y divide-gray-100 border-t border-gray-100"
          >
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4">{item.orderNumber}</td>
              <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                <div className="relative py-2">
                  {/* <RxPerson size={20}/> */}
                </div>
                <div className="text-sm">
                  <div className="">{item.userName}</div>
                </div>
              </th>
              <td className="px-6 py-4">{item.orderStatus}</td>
              <td className="px-6 py-4">R {item.orderAmount.toFixed(2)}</td>
              <td className="px-6 py-4">{item.deliveryStatus}</td>
              <td className="px-6 py-4">{item.laundromat}</td>
              <td className="px-6 py-4">online</td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
};

export default Complete;
