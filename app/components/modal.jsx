"use client";

import { Button, Modal } from "flowbite-react";
import { useState } from "react";

export default function DefaultModal(orderNumber) {
  const [openModal, setOpenModal] = useState();
  const props = { openModal, setOpenModal };

  return (
    <>
      <button
        onClick={() => props.setOpenModal("default")}
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        type="button"
      >
        View Order
      </button>

      <Modal
        show={props.openModal === "default"}
        onClose={() => props.setOpenModal(undefined)}
      >
        <Modal.Header>Order {orderNumber.number} </Modal.Header>
        <Modal.Body className="justify-center">
          <div>{orderNumber.count}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="bg-blue-500 border text-white font-semibold rounded-md"
            onClick={() => props.setOpenModal(undefined)}
          >
            Start Processing
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
