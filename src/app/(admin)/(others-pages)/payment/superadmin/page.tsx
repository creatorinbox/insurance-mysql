"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SuperadminPaymentEntry {
  distributorId: string;
  distributorName: string;
  salesAmount: number;
     dueAmount:number;
     mobile:string;
     city:string;
     contactPerson:string;
  status: "ACTIVE" | "BLOCKED" | "TERMINATED" | "pending";
}
export default function SuperadminPaymentsPage() {
  const [distributors, setDistributors] = useState<SuperadminPaymentEntry[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/superadmin-payments", { credentials: "include" })
      .then((res) => res.json())
      .then((res) => setDistributors(res));
  }, []);
  const handleAction = async (id: string, action: "block" | "terminate"| "active") => {
    const confirmMsg = `Are you sure you want to ${action} this distributor?`;
    if (!window.confirm(confirmMsg)) return;

    const res = await fetch(`/api/distributor/${id}/${action}`, {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      alert(`Distributor ${action}d successfully.`);
      // Optionally refetch
      const updated = await fetch("/api/superadmin-payments", { credentials: "include" });
      const data = await updated.json();
      console.log('result',data);
      setDistributors(data);
    } else {
      alert(`Failed to ${action} distributor.`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-4">Distributor Payments</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Distributor Name</th>
            <th className="p-2">Mobile</th>
                        <th className="p-2">City</th>
            <th className="p-2">Contact Person</th>
            <th className="p-2">Sales Amount</th>
           <th className="p-2">Due Amount</th>
            <th className="p-2">View Distributor</th>
                        <th className="p-2">Status</th>

            <th className="p-2">Action</th>

          </tr>
        </thead>
        <tbody>
          {distributors.map((distributor, i: number) => (
            <tr key={i} className="border-b">
              <td className="p-2">{distributor.distributorName}</td>
                            <td className="p-2">{distributor.mobile}</td>
              <td className="p-2">{distributor.city}</td>
              <td className="p-2">{distributor.contactPerson}</td>
              {/* <td className="p-2">₹ {distributor.salesAmount}</td>
             <td className="p-2">₹ {distributor.dueAmount}</td>  */}
             <td className="p-2">{distributor.salesAmount ? `₹ ${distributor.salesAmount}` : "-"}</td>
<td className="p-2">{distributor.dueAmount ? `₹ ${distributor.dueAmount}` : "-"}</td>
              <td className="p-2">
                <button
                  onClick={() => router.push(`/payment/superadmin/view-insurance/${distributor.distributorId}`)}
                  className="text-blue-600 underline"
                >
                  View
                </button>
              </td>
              <td className="p-2">{distributor.status}</td> 
              <td className="p-2 space-x-2">
  {distributor.status === "ACTIVE" && (
    <>
      <button
        onClick={() => handleAction(distributor.distributorId, "block")}
        className="px-2 py-1 text-xs text-white bg-yellow-500 rounded"
      >
        Block
      </button>
      <button
        onClick={() => handleAction(distributor.distributorId, "terminate")}
        className="px-2 py-1 text-xs text-white bg-red-600 rounded"
      >
        Terminate
      </button>
    </>
  )}

  {distributor.status === "BLOCKED" && (
    <button
      onClick={() => handleAction(distributor.distributorId, "active")}
      className="px-2 py-1 text-xs text-white bg-green-600 rounded"
    >
      Activate
    </button>
  )}
   {distributor.status === "pending" && (
    <button
      onClick={() => handleAction(distributor.distributorId, "active")}
      className="px-2 py-1 text-xs text-white bg-green-600 rounded"
    >
      Approve
    </button>
  )}

  {distributor.status === "TERMINATED" && (
    <span className="text-xs text-gray-500">Terminated</span>
  )}
   <button
      className="px-2 py-1 text-xs text-white bg-green-600 rounded"
    >
      Edit
    </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
