import React from "react";
import { useState } from "react";

export default function contact() {
  const [data, setData] =
    useState[
      {
        name: "",
        email,
      }
    ];
  const sendEmail = async (e) => {
    const response = await fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 200) {
      setData({});
    }
  };
  return <div>contact</div>;
}
