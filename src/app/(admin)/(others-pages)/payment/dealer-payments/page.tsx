// Dealer Payment View Page
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface InsurancePayment {
  id: string;
  invoiceAmount: string;
  dueamount: string;
  paidstatus: number; 
}
export default  function DealerPaymentsPage() {
    const [insurances, setInsurances] = useState<InsurancePayment[]>([]);
    const router = useRouter();

    useEffect(() => {
      fetch("/api/insurance/dealer", { credentials: "include" })
        .then(res => res.json())
        .then(data => setInsurances(data));
    }, []);
  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-4">Dealer Payments</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Insurance Id</th>
            <th className="p-2">Sales Amount</th>
            <th className="p-2">Due Amount</th>
            <th className="p-2">Status</th>
            <th className="p-2">View</th>

          </tr>
        </thead>
        <tbody>
          {insurances.map((ins) => (
            <tr key={ins.id} className="border-b">
              <td className="p-2">{ins.id}</td>
              <td className="p-2">₹ {ins.invoiceAmount}</td>
              <td className="p-2">₹ {ins.dueamount}</td>
              <td className="p-2"> {ins.paidstatus === 1 ? "Paid" : "Not Paid"}</td>
              <td className="p-2">
                <button
                  onClick={() => router.push(`/insurance/${ins.id}`)}
                  className="text-blue-600 underline"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
