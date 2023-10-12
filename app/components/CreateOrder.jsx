import React from "react";
import { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import myAlert from "../components/Alert";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  doc,
  query,
  where,
  getFirestore,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useForm, useWatch } from "react-hook-form";
import { GiCancel } from "react-icons/gi";
import SearchBox from "../components/searchbox";
import MultiSelectComponent from "../components/multiselect";
import Invoice from "./Invoice";
import ActiveOrders from "./ActiveOrders";
import TopCards from "./TopCards";
import CustomHeader from "./Header";
import Spinner from "./Spinner";

export default function CreateOrder() {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(false);
  let ms = Date.now();
  const orderNum = ms.toString();
  const newNum = orderNum.substring(10, 13);
  const orderNumber = newNum * 1598;

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  // date component
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let currentDate = `${day}-${month}-${year}`;

  let [showForm, updateSHowForm] = useState(false);
  let [isChecked, setIsChecked] = useState(false);
  let [clientFirstName, setClientName] = useState("");
  let [laundryService, setLaundryService] = useState("");
  let [clientLastName, setLastName] = useState("");
  let [clientEmailAdd, setClientEmailAdd] = useState("");
  let [myAddress, setAddress] = useState("");
  let [isLaundry, setIsLaundry] = useState("");
  let [serviceName, setServiceName] = useState("");
  let [isDry, setIsDry] = useState("");
  let [laundryP, updateLaundryP] = useState();
  let [dryP, updateDryP] = useState(0);
  let [deliveryFee, updateDeliveryFee] = useState(0);
  let [weight, updateWeight] = useState(0.0);
  let [total, updateTotal] = useState(0.0);
  let [isButtonDisabled, setButtonDisabled] = useState(false);

  const [mylaundromat, setUserID] = useState([]);

  let service = { name: "wash", price: 250 };

  function onCreateNewOrder() {
    updateSHowForm(true);
  }

  function onCancelNewOrder() {
    updateSHowForm(false);
    window.location.reload();
  }

  function calcPrice(event) {
    updateTotal(event.target.value);
  }

  function onServiceSelect(event) {
    setIsLaundry(event.target.value);
  }

  const [price, setPrice] = useState(20);

  function onLaundryServiceSelect(event) {
    setServiceName(event.target.value);

    switch (event.target.value) {
      case "Select A Service":
        setPrice(0);
        break;
      case "Wash , dry and fold":
        setPrice(28);
        break;
      case "Wash , dry and fold + Iron":
        setPrice(35);
        break;

      case "Iron only":
        setPrice(45);
        break;
    }
  }

  const handleChange = (event) => {
    setIsChecked(!isChecked);
    if (isChecked == false) {
      updateDeliveryFee(48);
    } else {
      updateDeliveryFee(0);
    }
  };

  const dbx = getFirestore();

  async function sendData(
    orderType,
    userName,
    pickupOption,
    delivery,
    deliveryFee,
    deliveryStatus,
    Instructions,
    address,
    cartItems,
    coupon,
    orderAmount,
    orderState,
    orderStatus,
    userEmail,
    userPhone,
    laundromat,
    pickup
  ) {
    try {
      addDoc(collection(dbx, "orders"), {
        orderType: orderType,
        userName: userName,
        pickupOption: pickupOption,
        delivery: delivery,
        deliveryFee: deliveryFee,
        deliveryStatus: deliveryStatus,
        Instructions: "",
        address: address ?? "",
        cartItems: [
          { itemcount: 1, productName: "Small Laundry Basket", service },
        ],
        coupon: coupon,
        orderAmount: orderAmount,
        createdAt: Timestamp.now(),
        orderState: orderState,
        orderStatus: orderStatus,
        userEmail: userEmail,
        userPhone: userPhone,
        laundromat: laundromat,
        orderNumber: `${orderNumber}`,
        pickup: pickup,
        //  pricelist:pricelist
      }).then((result) => {
        updateDoc(doc(dbx, "orders", result.id), {
          orderId: result.id,
        });
        <myAlert />;
        location.reload();
      });
    } catch (error) {
      alert(error);
    }
  }

  const { register, setValue, handleSubmit } = useForm({
    criteriaMode: "all",
  });

  let nextId = 0;
  const [basket, setBasket] = useState([]);

  const onSubmit = async (data, event) => {
    setLoading(true);
    await fetch("api/send", {
      method: "POST",
      body: JSON.stringify({
        firstname: clientFirstName,
        email: clientEmailAdd,
        clientAddress: myAddress,
        lastName: clientLastName,
        invoiceDate: currentDate,
        orderID: orderNumber,
        laundromat: mylaundromat,
        delivery: "now",
        price: price * weight,
        serviceName: serviceName,
      }),
    });
    try {
      sendData(
        "onSite",
        clientFirstName + " " + clientLastName,
        "delivery",
        Timestamp.now(),
        deliveryFee,
        "upcoming",
        "test",
        data.clientAddress,
        "test",
        "",
        price * weight,
        "Active",
        "Placed",
        clientEmailAdd,
        data.userPhone,
        mylaundromat,
        Timestamp.now()
      );
    } catch (error) {
      alert(error);
    }
  };

  const laundryType = [
    { myserviceName: "Select A Service", price: 20 },
    { myserviceName: "Wash , dry and fold", price: 20 },
    { myserviceName: "Wash , dry and fold + Iron", price: 30 },
    { myserviceName: "Iron only", price: 40 },
  ];

  // read data from database
  useEffect(() => {
    const q = query(collection(db, "laundryService"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      itemsArr;

      return () => unsubscribe();
    });
  }, []);

  useEffect(() => {
    const q = query(collection(db, "orders"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      itemsArr;

      return () => unsubscribe();
    });
  }, []);

  const serviceType = [
    {
      label: "Select Service",
      value: "0",
    },
    {
      label: "Clothes",
      value: "Laundry",
    },
    {
      label: "Dry Cleaning",
      value: "Dry Cleaning",
    },
  ];

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

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <div className>
          {!showForm && (
            <>
              <CustomHeader laundromatName={mylaundromat} />

              <TopCards />
              <div className="">
                <div className="flex justify-start px-7 pt-2">
                  <button
                    onClick={onCreateNewOrder}
                    className="text-white mt-6 ml-2 bg-blue-700 block hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    New Order{" "}
                  </button>
                </div>
              </div>
              <ActiveOrders />
            </>
          )}
          {showForm && (
            <div className="overflow-hidden  rounded-lg border justify-center items-center  m-5">
              <div className="m-5 flex font-semibold  justify-between  ">
                <p className="mt-2 text-2xl">Create A New Order</p>

                <GiCancel
                  className="mt-2 mr-2"
                  onClick={onCancelNewOrder}
                  size={22}
                />
              </div>

              <div className="overflow-hidden px-8 py-8 bg-white justify-around  flex rounded-lg  ">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="px-4 py-10 mr-4 w-full flex-1 sm:w-1/2"
                >
                  <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="first_name"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        htmlFor="fname"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                        placeholder="John"
                        onChange={(e) => setClientName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="last_name"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last_name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        placeholder="Doe"
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="tel"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="123-45-678"
                        {...register("userPhone", { required: true })}
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="john.doe@company.com"
                        onChange={(e) => {
                          setClientEmailAdd(e.target.value);
                        }}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="service"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Service
                      </label>
                      <select
                        onChange={onServiceSelect}
                        className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        name=""
                        id=""
                      >
                        {serviceType.map((option, index) => (
                          <option key={index} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {isLaundry == "Laundry" && (
                      <div>
                        <label
                          htmlFor="visitors"
                          className="block mb-2 text-sm font-medium text-gray-900 "
                        >
                          Enter Weight(kg)
                        </label>
                        <input
                          onChange={(e) => updateWeight(+e.target.value)}
                          min={0}
                          type="number"
                          id="visitors"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                          defaultValue={0}
                          placeholder="Minimum weight 5Kgs"
                          required
                        />
                      </div>
                    )}

                    {isLaundry == "Laundry" && (
                      <div>
                        <label
                          htmlFor="laundry"
                          className="block mb-2 text-sm font-medium text-gray-900 "
                        >
                          Laundry Type
                        </label>
                        <select
                          onChange={onLaundryServiceSelect}
                          className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                          name=""
                          id=""
                        >
                          {laundryType.map((option, i) => (
                            <option key={i}>{option.myserviceName} </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {isLaundry == "Dry Cleaning" && (
                      <div>{/* <MultiSelectComponent /> */}</div>
                    )}
                  </div>

                  <label className="relative mb-2 mt-8 inline-flex items-center cursor-pointer">
                    <input
                      onChange={handleChange}
                      checked={isChecked}
                      type="checkbox"
                      value=""
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300  rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900 ">
                      Deliver when Complete
                    </span>
                  </label>

                  {isChecked && (
                    <div>
                      <label
                        htmlFor="address"
                        className="block  mb-2 text-sm font-medium text-gray-900 "
                      >
                        Address
                      </label>
                      <SearchBox
                        {...register("clientAddress")}
                        {...register("latitude")}
                        {...register("longitude")}
                        onSelectAddress={(address, latitude, longitude) => {
                          setAddress(address);
                          setValue("clientAddress", address);
                          setValue("latitude", latitude);
                          setValue("longitude", longitude);
                        }}
                        defaultValue=""
                      />
                    </div>
                  )}
                  <div className="w-full md:w-1/3 pr-3 pl-0 mb-6 mt-5 md:mb-0">
                    <input
                      type="submit"
                      value="Create Order"
                      className="border-2 border-blue-500 cursor-pointer rounded-xl px-12 py-2 inline-block font-semibold bg-blue-500 text-white hover:border-blue-800 hover:bg-blue-800"
                    />
                  </div>
                </form>
                <div className="bg-white flex-1 max-w-lg justify-center">
                  {/* invoice generation */}
                  <Invoice
                    laundromatName={mylaundromat}
                    invoiceNumber={newNum}
                    Address={myAddress}
                    clientFirstName={clientFirstName}
                    clientLastName={clientLastName}
                    ClientEmail={clientEmailAdd}
                    deliveryFee={deliveryFee}
                    laundryP={(price * weight ?? 0).toFixed(2)}
                    ServiceName={serviceName}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
