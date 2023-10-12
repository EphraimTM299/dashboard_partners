import React, { useState, useEffect, useRef } from "react";
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

export default function Profile() {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [laundryUser, setUser] = useState([]);
  const [mylaundromat, setUserID] = useState([]);
  const [laundryUserEmail, setlaundryUserEmail] = useState([]);

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
        setUser(itemsArr[0].userName);
        setlaundryUserEmail(itemsArr[0].userEmail);
      });

      return () => unsubscribe();
    });
  }, [user]);

  // Read items from the database
  useEffect(() => {
    const q = query(collection(db, "laundromat"));

    const queryRef = query(q, where("name", "==", `${mylaundromat}`));

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
    <div className="">
      <div className="flex justify-between px-6 pt-4">
        <h2 className="text-xl font-semibold">Business Information</h2>
      </div>
      <div className="m-5 px-6 py-8 bg-white rounded-xl">
        <div className="px-4 sm:px-0 flex  justify-between">
          <p className="mt-1 max-w-2xl  text-sm leading-6 text-gray-500">
            Current Business details.
          </p>

          <p className="mt-1 max-w-2xl text-sm  leading-6 text-gray-500">
            Status:{" "}
            <span className="bg- bg-green-200  text-green-500 font-semibold text p-2 rounded-lg text-xs">
              Active
            </span>
          </p>
        </div>
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Trading Name
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {mylaundromat}
              </dd>
            </div>

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Contact Person
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {laundryUser} <br />({laundryUserEmail})
              </dd>
            </div>
            {items.map((item, i) => (
              <>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Business Type
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    Hybrid <br />
                    Laundromat, Dry Cleaner
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Registered Business Address
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {item.address}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Business Email address
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {laundryUserEmail}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Service Area(s)
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    Cape Town, Stellenbosch
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    No. of Branches(s)
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    2
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Subscription Plan
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    Enteprise Plan <br /> (Yearly Payment Plan)
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    About
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    WashAlot was founded in 1920 and it has been growing ever
                    since
                  </dd>
                </div>
              </>
            ))}

            {/* <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Attachments
              </dt>
              <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <ul
                  role="list"
                  className="divide-y divide-gray-100 rounded-md border border-gray-200"
                >
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          resume_back_end_developer.pdf
                        </span>
                        <span className="flex-shrink-0 text-gray-400">
                          2.4mb
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a
                        href="#"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Download
                      </a>
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          coverletter_back_end_developer.pdf
                        </span>
                        <span className="flex-shrink-0 text-gray-400">
                          4.5mb
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a
                        href="#"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Download
                      </a>
                    </div>
                  </li>
                </ul>
              </dd>
            </div> */}
          </dl>
        </div>
      </div>
    </div>
  );
}
