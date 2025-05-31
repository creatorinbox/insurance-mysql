// // components/RazorpayButton.tsx
// "use client";

// import { useEffect, useState } from "react";


// import { useRouter } from "next/navigation";
// type Props = {
//   amount: number;
//   discount: number;
//   base: number;
// };

// export default function RazorpayButton({ amount, discount, base }: Props) {
//       const router = useRouter();

//   const [loading, setLoading] = useState(false);

// //   const handlePayment = async () => {
// //     setLoading(true);
// //     const res = await fetch("/api/payments/pay-now", {
// //       method: "POST",
// //       body: JSON.stringify({
// //         amount,
// //         discount,
// //         base,
// //       }),
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //     });

// //     const data = await res.json();
// //     if (!data || !data.order) {
// //       alert("Failed to initiate payment");
// //       setLoading(false);
// //       return;
// //     }else{
// //          router.push("/payment/history");
// //     }

// //     const script = document.createElement("script");
// //     script.src = "https://checkout.razorpay.com/v1/checkout.js";
// //     script.async = true;
// //     script.onload = () => {
// //       const options = {
// //         key: "rzp_test_8RId0V4Xf3nvQM",
// //         amount: data.order.amount,
// //         currency: data.order.currency,
// //         name: "Insurance Payment",
// //         description: "Monthly Due Payment",
// //         order_id: data.order.id,
// //         handler: function (response: any) {
// //           alert("✅ Payment Successful: " + response.razorpay_payment_id);
// //           // Optionally call /api/payments/confirm to update DB
// //         },
// //         prefill: {
// //           name: "Dealer",
// //           email: "dealer@example.com",
// //           contact: "9999999999",
// //         },
// //         theme: {
// //           color: "#1D4ED8",
// //         },
// //       };
// //       //@ts-ignore
// //       const rzp = new Razorpay(options);
// //       rzp.open();
// //       setLoading(false);
// //     };
// //     document.body.appendChild(script);
// //   };
//  const handlePayment = async () => {
//     setLoading(true);
//     const res = await fetch("/api/payments/pay-now", {
//       method: "POST",
//       body: JSON.stringify({ amount, discount, base }),
//       headers: { "Content-Type": "application/json" },
//     });

//     const data = await res.json();
//     if (!data || !data.order) {
//       alert("Failed to initiate payment");
//       setLoading(false);
//       return;
//     }

//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload = () => {
//       const options = {
//         key: "rzp_test_8RId0V4Xf3nvQM",
//         amount: data.order.amount,
//         currency: data.order.currency,
//         name: "Insurance Payment",
//         description: "Monthly Due Payment",
//         order_id: data.order.id,
//         handler: async function (response: any) {
//           try {
//             const confirmRes = await fetch("/api/payments/confirm", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 orderId: response.razorpay_order_id,
//                 paymentId: response.razorpay_payment_id,
//                 signature: response.razorpay_signature,
//                   base,
//       amount,
//       discount,

//               }),
//             });

//             const confirmData = await confirmRes.json();

//             if (confirmRes.ok) {
//               alert("✅ Payment Successful");
//               router.push("/payment/history");
//             } else {
//               console.error("Confirmation error:", confirmData.error);
//               alert("❌ Payment verified but failed to update backend.");
//             }
//           } catch (err) {
//             console.error("Verification failed", err);
//             alert("❌ Payment success but confirmation failed.");
//           }
//         },
//         prefill: {
//           name: "Dealer",
//           email: "dealer@example.com",
//           contact: "9999999999",
//         },
//         theme: { color: "#1D4ED8" },
//       };
//       //@ts-ignore
//       const rzp = new Razorpay(options);
//       rzp.open();
//     };
//     document.body.appendChild(script);
//     setLoading(false);
//   };
//   return (
//     <button
//       type="button"
//       onClick={handlePayment}
//       disabled={loading}
//       className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//     >
//       {loading ? "Processing..." : "Pay Now via Razorpay"}
//     </button>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  amount: number;
  discount: number;
  base: number;
  dealerId: string;
  onClose: () => void;  // add this line
};
interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
export default function RazorpayButton({ amount, discount, base, dealerId }: Props) {
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
      body: JSON.stringify({ amount, discount, base }),
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
        description: "Monthly Due Payment",
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
                dealerId
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
        dealerId,
        amount,
        base,
        paymentMode: mode,
        referenceNumber: refNo,
        remarks,
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Processing..." : "Pay Now via Razorpay"}
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
            {loading ? "Submitting..." : "Submit Manual Payment"}
          </button>
        </div>
      )}
    </div>
  );
}
