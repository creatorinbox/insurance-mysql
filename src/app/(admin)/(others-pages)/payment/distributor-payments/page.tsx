"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PayNowPopup from "@/components/PayNowPopup";
interface DistributorPayment {
  id: number;
  dealerName: string;
  salesAmount: number;
  dueAmount: number;
  status: "ACTIVE" | "BLOCKED" | "TERMINATED";
  effectiveDeduction: number;
  finalDue: number;
}

export default function DistributorPaymentsPage() {
  const [dealers, setDealers] = useState<DistributorPayment[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/distributor-payments", { credentials: "include" })
      .then((res) => res.json())
      .then((res) => setDealers(res));
  }, []);

  const handleAction = async (id: number, action: "block" | "terminate"| "active") => {
    const confirmMsg = `Are you sure you want to ${action} this dealer?`;
    if (!window.confirm(confirmMsg)) return;

    const res = await fetch(`/api/dealer/${id}/${action}`, {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      alert(`Dealer ${action}d successfully.`);
      // Optionally refetch
      const updated = await fetch("/api/distributor-payments", { credentials: "include" });
      const data = await updated.json();
      console.log('result',data);
      setDealers(data);
    } else {
      alert(`Failed to ${action} dealer.`);
    }
  };
const handleMarkPaid = async (dealerId: number) => {
  const confirm = window.confirm("Are you sure you want to mark all dues as paid?");
  if (!confirm) return;

  const res = await fetch(`/api/mark-paid/${dealerId}`, {
    method: "POST",
    credentials: "include",
  });

  if (res.ok) {
    alert("Marked as paid successfully");
    const updated = await fetch("/api/distributor-payments", { credentials: "include" });
    const data = await updated.json();
    setDealers(data);
  } else {
    alert("Failed to mark as paid.");
  }
};
  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-4">Distributor Payments</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Dealer Name</th>
            <th className="p-2">Sales Amount</th>
            <th className="p-2">Due Amount</th>
            <th className="p-2">View Dealer</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {dealers.map((dealer, i) => (
            <tr key={i} className="border-b">
              <td className="p-2">{dealer.dealerName}</td>
              <td className="p-2">₹ {dealer.salesAmount}</td>
              <td className="p-2">₹ {dealer.dueAmount}</td>
              <td className="p-2">
                <button
                  onClick={() => router.push(`/dealer/insurance/${dealer.id}`)}
                  className="text-blue-600 underline"
                >
                  View
                </button>
              </td>
              {/* <td className="p-2 space-x-2">
  {dealer.status === "ACTIVE" && (
    <>
      <button
        onClick={() => handleAction(dealer.id, "block")}
        className="px-2 py-1 text-xs text-white bg-yellow-500 rounded"
      >
        Block
      </button>
      <button
        onClick={() => handleAction(dealer.id, "terminate")}
        className="px-2 py-1 text-xs text-white bg-red-600 rounded"
      >
        Terminate
      </button>
    </>
  )}

  {dealer.status === "BLOCKED" && (
    <button
      onClick={() => handleAction(dealer.id, "active")}
      className="px-2 py-1 text-xs text-white bg-green-600 rounded"
    >
      Activate
    </button>
  )}

  {dealer.status === "TERMINATED" && (
    <span className="text-xs text-gray-500">Terminated</span>
  )}
</td> */}
<td className="p-2 space-x-2">
  {dealer.status === "ACTIVE" && (
    <>
      <button
        onClick={() => handleAction(dealer.id, "block")}
        className="px-2 py-1 text-xs text-white bg-yellow-500 rounded"
      >
        Block
      </button>
      <button
        onClick={() => handleAction(dealer.id, "terminate")}
        className="px-2 py-1 text-xs text-white bg-red-600 rounded"
      >
        Terminate
      </button>
    </>
  )}

  {dealer.status === "BLOCKED" && (
    <button
      onClick={() => handleAction(dealer.id, "active")}
      className="px-2 py-1 text-xs text-white bg-green-600 rounded"
    >
      Activate
    </button>
  )}

  {dealer.status === "TERMINATED" && (
    <span className="text-xs text-gray-500">Terminated</span>
  )}

  {dealer.dueAmount > 0 && (
        <div>
    <button
      onClick={() => handleMarkPaid(dealer.id)}
      className="px-2 py-1 text-xs text-white bg-blue-600 rounded"
    >
      Mark as Paid
    </button>

     <PayNowPopup
                    baseAmount={dealer.salesAmount}
                    dealerId={dealer.id}
                    discount={dealer.effectiveDeduction}
                    payableAmount={dealer.finalDue}
                  />
                  </div>
  )}
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
