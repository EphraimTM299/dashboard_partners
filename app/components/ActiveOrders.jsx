"use client";

import React, { useState, useEffect } from "react";
import { RxPerson } from "react-icons/rx";
import { UserAuth } from "../context/AuthContext";
import {
  collection,
  updateDoc,
  orderBy,
  query,
  onSnapshot,
  where,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import DefaultModal from "./modal";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ActiveOrders() {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  const [mylaundromat, setUserID] = useState([]);

  const [items, setItems] = useState([]);

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
      where("orderState", "==", "Active"),
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

  // time function
  function timeConversion(seconds, nanoseconds) {
    const ts = (seconds + nanoseconds / 1000000000) * 1000;
    const ourDate = new Date(ts);
    return ourDate.toDateString();
  }

  // const delivery = items.data[0].delivery;
  // const ts = delivery * 1000;

  // Update items in database
  const updateOrder = async (orderId, orderStatus) => {
    const order = doc(db, "orders", orderId);

    try {
      await updateDoc(order, {
        orderStatus,
      }).then(function () {
        if (orderStatus == "Complete") {
          updateDoc(order, {
            orderState: "Inactive",
          });
          window.location.reload();
        }
      });
    } catch (error) {
      alert(error);
    }
  };

  const [openModal, setOpenModal] = useState();

  return (
    <div className="bg-gray-100 ">
      {/* active order component */}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
        <div className="m-5 font-semibold text-2xl ">Active Orders</div>
        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
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
                Due Date
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                Order Type
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                Contents
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
                    <RxPerson size={20} />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-700">
                      {item.userName}
                    </div>
                    <div className="text-gray-400">{item.orderNumber}</div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <select
                    defaultValue={item.orderStatus}
                    onChange={(e) => {
                      updateOrder(item.orderId, e.target.value);
                    }}
                    className=" border border-blue-50 text-gray-900 min-w-fit text-sm rounded-lg focus:ring-0 focus:ring-offset-00 block w-3/4 p-2.5"
                    name=""
                    id=""
                  >
                    <option value="Placed">Placed</option>
                    <option value="Picked Up">Picked Up</option>
                    <option value="Processing">Processing</option>
                    <option value="Done Processing">Done Processing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Complete">Complete</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  R{" "}
                  {(
                    item.orderAmount.toFixed(2) - item.deliveryFee.toFixed(2)
                  ).toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  {timeConversion(
                    item.delivery.seconds,
                    item.delivery.nanoseconds
                  )}
                </td>
                <td className="px-6 py-4">{item.orderType}</td>

                <td className="px-6 py-4">
                  <DefaultModal
                    number={item.orderNumber}
                    count={item.cartItems.map((cartItem, i) => (
                      <>
                        <div
                          key={i}
                          className=" flex items-center justify-center"
                        >
                          <a
                            href="#"
                            className="block max-w-sm p-6 bg-white border w-1/2 border-gray-200 rounded-lg shadow hover:bg-gray-100 "
                          >
                            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 ">
                              {cartItem.productName}
                            </h5>
                            <p className="font-normal text-l text-black ">
                              Service:{" "}
                              <span className="font-semibold">
                                {" "}
                                {cartItem.service.name}
                              </span>
                            </p>
                            <p className="font-normal text-l text-black ">
                              Qty:{" "}
                              <span className="font-semibold">
                                {" "}
                                {cartItem.itemCount}
                              </span>
                            </p>
                          </a>
                        </div>

                        <br />
                      </>
                    ))}
                  />
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}
