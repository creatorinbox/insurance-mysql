// src/app/(admin)/(others-pages)/insurance/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Insurance {
  id: number;
  invoiceAmount: string;  // as stored in your DB
  dueamount?: string;
}

export default function DealerInsurancePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [insurances, setInsurances] = useState<Insurance[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/dealer/${id}/insurances`, {
          credentials: "include",
        });
                console.log('result',res);

        if (!res.ok) throw new Error("Not found");
        const data: Insurance[] = await res.json();
        setInsurances(data);
      } catch (err) {
        console.error("Error fetching dealer insurances", err);
        //router.replace("/404");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  if (loading) {
    return <p className="p-8">Loading…</p>;
  }
  if (insurances === null) {
    return null; // redirecting away
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-4">Dealer Insurance Details</h1>
      {insurances.length === 0 ? (
        <p>No insurance data found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Insurance ID</th>
              <th className="p-2">Sales Amount</th>
              {/* <th className="p-2">Due Amount</th> */}
            </tr>
          </thead>
          <tbody>
            {insurances.map((ins) => (
              <tr key={ins.id} className="border-b">
                <td className="p-2">{ins.id}</td>
                <td className="p-2">₹ {ins.invoiceAmount}</td>
                {/* <td className="p-2">₹ {ins.dueamount}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
