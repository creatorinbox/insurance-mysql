// components/PayNowPopup.tsx
"use client";

import { useState } from "react";
import RazorpayButton from "./RazorpayButton";

interface Props {
  baseAmount: number;
  discount: number;
  payableAmount: number;
  dealerId:string;
}

export default function PayNowPopup({ baseAmount, discount, payableAmount,dealerId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Pay Now
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Payment</h2>

            <p className="mb-2">Due Amount: ₹ {baseAmount.toFixed(2)}</p>
            <p className="mb-2">Discount: {discount}%</p>
            <p className="mb-4 font-semibold">
              Payable Amount: ₹ {payableAmount.toFixed(2)}
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setOpen(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <RazorpayButton
                amount={+payableAmount.toFixed(2)}
                dealerId={dealerId}
                discount={discount}
                base={+baseAmount.toFixed(2)}
                onClose={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
