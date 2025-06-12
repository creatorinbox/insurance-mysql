"use client";

import { useState } from "react";
import RazorpayButton from "./RazorpayButton";

interface Props {
  baseAmount: number;
  discount: number;
  payableAmount: number;
  dealerIds: number[]; // ✅ Handle multiple dealers
  bulkPayment?: boolean;
  dueAmount:number;
  gst:number;
  sgst:number;
}

export default function PayNowPopup({ baseAmount, discount, payableAmount, dealerIds, dueAmount,gst,sgst, bulkPayment = false }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`mt-2 ${bulkPayment ? "bg-purple-600" : "bg-blue-600"} text-white px-4 py-2 rounded hover:bg-purple-700`}
      >
        {bulkPayment ? "Pay Now (Bulk)" : "Pay Now"}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{bulkPayment ? "Confirm Bulk Payment" : "Confirm Payment"}</h2>

            <p className="mb-2">Sale Amount: ₹ {baseAmount.toFixed(2)}</p>
             <p className="mb-2">Due Amount :{dueAmount} </p>

            <p className="mb-2">Discount :{dueAmount*discount/100}</p>
           <p className="mb-2">GST18%: {(gst+sgst).toFixed(2)}</p>

            {/* <p className="mb-2">SGST18%: {sgst.toFixed(2)}</p> */}

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
                dealerIds={dealerIds} // ✅ Supports Bulk Payment
                discount={discount}
                base={+dueAmount.toFixed(2)}
                bulkPayment={bulkPayment} // Pass flag for bulk payment
                onClose={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
