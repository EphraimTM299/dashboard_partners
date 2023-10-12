import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

export default function Invoice({
  laundromatName,
  clientFirstName,
  clientLastName,
  ClientEmail,
  Address,
  deliveryFee,
  laundryP,
  invoiceNumber,
  ServiceName,
}) {
  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let currentDate = `${day}-${month}-${year}`;

  return (
    <div className="min-w-full">
      <div className="bg-white border rounded-lg shadow-lg px-6 py-8 w-full mt-6">
        <h1 className="font-bold text-xl my-4 text-center text-blue-600">
          {laundromatName} Services
        </h1>
        <hr className="mb-2" />
        <div className="flex justify-between  mb-6">
          <h1 className="text-lg font-bold mr-6">Invoice</h1>
          <div className="text-gray-700">
            <div>Date: {currentDate}</div>
            <div>Invoice #:101{invoiceNumber}</div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">Bill To:</h2>
          <div className="text-gray-700 mb-1">
            {clientFirstName + " " + clientLastName}
          </div>

          <div className="text-gray-700 mb-1">{ClientEmail}</div>
          <div className="text-gray-700 mb-2">{Address}</div>
          <hr className="mb-2" />
        </div>
        <table className="w-full mb-8">
          <thead>
            <tr>
              <th className="text-left font-bold text-gray-700">
                Service Name
              </th>
              <th className="text-right font-bold text-gray-700">Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-left text-gray-700">{ServiceName}</td>
              <td className="text-right text-gray-700">{laundryP}</td>
            </tr>

            <hr className="mb-4 mt-4" />

            <tr>
              <td className="text-left text-gray-700">Delivery</td>
              <td className="text-right text-gray-700">
                R {deliveryFee.toFixed(2)}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td className="text-left font-bold text-gray-700">Total Due:</td>
              <td className="text-right font-bold text-gray-700">
                R {(laundryP * 1 + deliveryFee).toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
        <div className="text-gray-700 font-semibold mb-2">
          Thank you for your business!
        </div>
        <div className="text-gray-700 text-sm"></div>
      </div>
    </div>
  );
}
