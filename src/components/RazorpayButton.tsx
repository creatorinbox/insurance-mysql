"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

type Props = {
  amount: number;
  discount: number;
  base: number;
  dealerIds: number[]; // ✅ Supports multiple dealer IDs for bulk payments
  bulkPayment?: boolean; // ✅ Determines if bulk payment mode is enabled
  onClose: () => void;
};

export default function RazorpayButton({ amount, discount, base, dealerIds, bulkPayment = false }: Props) {
  const [loading, setLoading] = useState(false);
  const [manual, setManual] = useState(false);

  const [mode, setMode] = useState("CHEQUE");
  const [refNo, setRefNo] = useState("");
  const [remarks, setRemarks] = useState("");

  const router = useRouter();

  const handlePayment = async () => {
    setLoading(true);
    const res = await fetch("/api/payments/pay-now", {
      method: "POST",
      body: JSON.stringify({ amount, discount, base, dealerIds }), // ✅ Include bulk dealer IDs
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (!data || !data.order) {
      alert("Failed to initiate payment");
      setLoading(false);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      const options = {
        key: "rzp_test_8RId0V4Xf3nvQM",
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Insurance Payment",
        description: bulkPayment ? "Bulk Due Payment" : "Monthly Due Payment",
        order_id: data.order.id,
        handler: async function (response: RazorpayPaymentResponse) {
          try {
            const confirmRes = await fetch("/api/payments/confirm", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                base,
                amount,
                discount,
                dealerIds, // ✅ Include dealerIds for bulk processing
                bulkPayment,
              }),
            });

            const confirmData = await confirmRes.json();

            if (confirmRes.ok) {
              alert("✅ Payment Successful");
              router.push("/payment/history");
            } else {
              console.error("Confirmation error:", confirmData.error);
              alert("❌ Payment verified but failed to update backend.");
            }
          } catch (err) {
            console.error("Verification failed", err);
            alert("❌ Payment success but confirmation failed.");
          }
        },
        prefill: {
          name: "Dealer",
          email: "dealer@example.com",
          contact: "9999999999",
        },
        theme: { color: "#1D4ED8" },
      };

      // @ts-expect-error Razorpay is loaded via external script
      const rzp = new Razorpay(options);
      rzp.open();
    };
    document.body.appendChild(script);
    setLoading(false);
  };

  const handleManualSubmit = async () => {
    if (!refNo) return alert("Please enter reference number");

    setLoading(true);

    const res = await fetch("/api/payments/manual", {
      method: "POST",
      body: JSON.stringify({
        dealerIds, // ✅ Handle multiple dealers for bulk payment
        amount,
        base,
        paymentMode: mode,
        referenceNumber: refNo,
        remarks,
        bulkPayment, // ✅ Pass bulk payment flag
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("✅ Manual Payment Submitted");
      router.push("/payment/history");
    } else {
      alert("❌ Failed to submit manual payment");
    }

    setLoading(false);
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handlePayment}
          disabled={loading}
          className={`px-4 py-2 text-white rounded ${bulkPayment ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Processing..." : bulkPayment ? "Pay Now (Bulk)" : "Pay Now via Razorpay"}
        </button>
        <button
          type="button"
          onClick={() => setManual((prev) => !prev)}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          {manual ? "Cancel Manual" : "Pay with Cash / Cheque"}
        </button>
      </div>

      {manual && (
        <div className="p-4 bg-gray-100 rounded border">
          <div className="mb-2">
            <label className="block text-sm mb-1 font-medium">Payment Mode</label>
            <select
              className="w-full border px-2 py-1 rounded"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="CHEQUE">Cheque</option>
              <option value="CASH">Cash</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="block text-sm mb-1 font-medium">Reference Number</label>
            <input
              type="text"
              className="w-full border px-2 py-1 rounded"
              placeholder="Cheque No or Receipt ID"
              value={refNo}
              onChange={(e) => setRefNo(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm mb-1 font-medium">Remarks</label>
            <textarea
              className="w-full border px-2 py-1 rounded"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Optional note"
            />
          </div>

          <button
            type="button"
            onClick={handleManualSubmit}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {loading ? "Submitting..." : bulkPayment ? "Submit Bulk Manual Payment" : "Submit Manual Payment"}
          </button>
        </div>
      )}
    </div>
  );
}
